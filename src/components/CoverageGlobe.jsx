import { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Billboard, RoundedBox, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { LAND_DOTS } from '../data/landDots';

/**
 * Coverage globe.
 *
 * A dark Earth turns while the SpotMe mark orbits it. Wherever the mark passes,
 * the land below lights up — the map filling in spot by spot. The orbit is
 * inclined and its inclination drifts, so over time the lit band reaches high
 * latitudes instead of tracing one stripe around the equator.
 *
 * The land is real: 2,409 sample points baked from Natural Earth 110m by
 * scripts/bake-land-dots.mjs. Nothing is fetched or parsed at runtime.
 *
 * Colours are read from the site's CSS custom properties, so the scene cannot
 * drift from the palette.
 */

const R = 1;                 // globe radius
const R_ORBIT = 1.26;        // how far out the mark rides
const COVER_RAD = 0.16;      // angular radius lit beneath the mark, radians
const SPIN = 0.2;            // globe rotation, rad/s
const ORBIT_SPEED = 0.42;    // the mark's trip around the globe, rad/s
const DRIFT_SPEED = 0.17;    // how fast the orbit's inclination wanders, rad/s

const Z_AXIS = new THREE.Vector3(0, 0, 1);
const BIG = new THREE.Vector3(1.3, 1.3, 1.3);      // a covered spot reads larger

function readTokens() {
  if (typeof window === 'undefined') return null;
  const s = getComputedStyle(document.documentElement);
  const get = (n, fb) => (s.getPropertyValue(n) || '').trim() || fb;
  return {
    sea: get('--green-900', '#0d2f11'),        // the dark globe
    land: get('--green-600', '#256a29'),       // land not yet covered
    lit: get('--green-200', '#bcdcc0'),        // a covered spot, lit up
    glow: get('--green-400', '#5aa164'),       // atmosphere + surface marker
    badge: get('--bg', '#ffffff'),             // the plate behind the mark
  };
}

/** lat/lon in degrees -> a point on the sphere. */
function toVec(lat, lon, r = R, out = new THREE.Vector3()) {
  const p = (90 - lat) * (Math.PI / 180);
  const t = (lon + 180) * (Math.PI / 180);
  return out.set(-r * Math.sin(p) * Math.cos(t), r * Math.cos(p), r * Math.sin(p) * Math.sin(t));
}

/** The company mark, riding in orbit on a small plate so it reads over the dark globe. */
function OrbitingMark({ tokens }) {
  const tex = useTexture('/SpotMeLogo-transparent.png');
  useEffect(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
  }, [tex]);

  const W = 0.52;
  const H = W * (364 / 1370);   // the logo's own aspect ratio

  return (
    <Billboard>
      {/* The mark is mid-green and the globe is near-black, so it needs a plate
          behind it to stay legible as it passes in front. */}
      <RoundedBox args={[W * 1.2, H * 1.95, 0.014]} radius={H * 0.9} smoothness={4}>
        <meshBasicMaterial color={tokens.badge} toneMapped={false} />
      </RoundedBox>
      <mesh position={[0, 0, 0.012]}>
        <planeGeometry args={[W, H]} />
        <meshBasicMaterial map={tex} transparent toneMapped={false} depthWrite={false} />
      </mesh>
    </Billboard>
  );
}

function Globe({ tokens, reduced, onProgress }) {
  const dots = useRef();
  const world = useRef();
  const outer = useRef();
  const orbitPlane = useRef();
  const orbiter = useRef();
  const marker = useRef();

  const count = LAND_DOTS.length;

  const dirs = useMemo(
    () => LAND_DOTS.map(([lat, lon]) => toVec(lat, lon, 1, new THREE.Vector3())),
    []
  );

  const covered = useMemo(() => new Uint8Array(count), [count]);
  // Kept so a dot can be re-composed at a larger scale the moment it is covered.
  const quats = useMemo(
    () => Array.from({ length: count }, () => new THREE.Quaternion()),
    [count]
  );

  const colFree = useMemo(() => new THREE.Color(tokens.land), [tokens.land]);
  const colDone = useMemo(() => new THREE.Color(tokens.lit), [tokens.lit]);

  // Lay the dots out once; only their colour and scale change after this.
  useEffect(() => {
    if (!dots.current) return;
    const m = new THREE.Matrix4();
    const pos = new THREE.Vector3();
    const scl = new THREE.Vector3(1, 1, 1);
    for (let i = 0; i < count; i++) {
      pos.copy(dirs[i]).multiplyScalar(R);
      quats[i].setFromUnitVectors(Z_AXIS, dirs[i]);   // lie each disc on the surface
      m.compose(pos, quats[i], scl);
      dots.current.setMatrixAt(i, m);
      dots.current.setColorAt(i, colFree);
    }
    dots.current.instanceMatrix.needsUpdate = true;
    if (dots.current.instanceColor) dots.current.instanceColor.needsUpdate = true;
  }, [dirs, count, colFree, quats]);

  // Reduced motion: show the story's end state, no animation at all.
  useEffect(() => {
    if (!reduced || !dots.current) return;
    const m = new THREE.Matrix4();
    const pos = new THREE.Vector3();
    let n = 0;
    for (let i = 0; i < count; i++) {
      if (dirs[i].y > -0.35 && dirs[i].y < 0.8) {
        covered[i] = 1; n++;
        dots.current.setColorAt(i, colDone);
        m.compose(pos.copy(dirs[i]).multiplyScalar(R), quats[i], BIG);
        dots.current.setMatrixAt(i, m);
      }
    }
    dots.current.instanceMatrix.needsUpdate = true;
    if (dots.current.instanceColor) dots.current.instanceColor.needsUpdate = true;
    onProgress?.(n / count);
  }, [reduced, dirs, count, colDone, covered, quats, onProgress]);

  const sub = useMemo(() => new THREE.Vector3(), []);
  const local = useMemo(() => new THREE.Vector3(), []);
  const mark = useMemo(() => new THREE.Matrix4(), []);
  const pos = useMemo(() => new THREE.Vector3(), []);
  const lastReport = useRef(0);

  useFrame((state) => {
    if (reduced || !world.current || !dots.current || !orbiter.current) return;
    const t = state.clock.elapsedTime;

    world.current.rotation.y = t * SPIN;

    // Inclination wanders, so the lit band eventually reaches high latitudes
    // instead of painting one ring around the equator.
    orbitPlane.current.rotation.x = 0.5 + Math.sin(t * DRIFT_SPEED) * 0.62;
    orbitPlane.current.rotation.z = Math.cos(t * DRIFT_SPEED * 0.7) * 0.3;

    const a = t * ORBIT_SPEED;
    orbiter.current.position.set(Math.cos(a) * R_ORBIT, 0, Math.sin(a) * R_ORBIT);

    // Where the mark sits over the globe, in the globe's own (unrotated) frame.
    orbiter.current.getWorldPosition(sub);
    outer.current.worldToLocal(sub).normalize();

    if (marker.current) {
      marker.current.position.copy(sub).multiplyScalar(R + 0.006);
      marker.current.quaternion.setFromUnitVectors(Z_AXIS, sub);
    }

    const inv = -world.current.rotation.y;
    const cos = Math.cos(inv), sin = Math.sin(inv);
    local.set(sub.x * cos - sub.z * sin, sub.y, sub.x * sin + sub.z * cos);

    let touched = false;
    const cutoff = Math.cos(COVER_RAD);
    for (let i = 0; i < count; i++) {
      if (covered[i]) continue;
      if (dirs[i].dot(local) > cutoff) {
        covered[i] = 1;
        dots.current.setColorAt(i, colDone);
        mark.compose(pos.copy(dirs[i]).multiplyScalar(R), quats[i], BIG);
        dots.current.setMatrixAt(i, mark);
        touched = true;
      }
    }
    if (touched) {
      dots.current.instanceMatrix.needsUpdate = true;
      if (dots.current.instanceColor) dots.current.instanceColor.needsUpdate = true;
    }

    if (t - lastReport.current > 0.4) {
      lastReport.current = t;
      let n = 0;
      for (let i = 0; i < count; i++) n += covered[i];
      onProgress?.(n / count);
    }
  });

  return (
    <group ref={outer} rotation={[0.32, 0, 0.22]}>
      <group ref={world}>
        <mesh>
          <sphereGeometry args={[R - 0.012, 64, 64]} />
          <meshBasicMaterial color={tokens.sea} toneMapped={false} />
        </mesh>

        <instancedMesh ref={dots} args={[undefined, undefined, count]}>
          <circleGeometry args={[0.0165, 6]} />
          <meshBasicMaterial toneMapped={false} side={THREE.DoubleSide} />
        </instancedMesh>
      </group>

      {/* the patch of ground currently being claimed */}
      <mesh ref={marker}>
        <ringGeometry args={[0.115, 0.145, 40]} />
        <meshBasicMaterial color={tokens.glow} transparent opacity={0.75}
                           side={THREE.DoubleSide} depthWrite={false} toneMapped={false} />
      </mesh>

      {/* The mark orbits: the sphere occludes it on the far side of the pass,
          which is what sells it as an orbit rather than a sticker. */}
      <group ref={orbitPlane}>
        <group ref={orbiter}>
          <Suspense fallback={null}>
            <OrbitingMark tokens={tokens} />
          </Suspense>
        </group>
      </group>

      {/* atmosphere */}
      <mesh>
        <sphereGeometry args={[R * 1.06, 48, 48]} />
        <meshBasicMaterial color={tokens.glow} transparent opacity={0.16}
                           side={THREE.BackSide} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

export default function CoverageGlobe({ reduced = false, onProgress }) {
  const [tokens, setTokens] = useState(null);
  useEffect(() => { setTokens(readTokens()); }, []);
  if (!tokens) return <div className="globe-placeholder" aria-hidden="true" />;

  return (
    <Canvas
      className="globe-canvas"
      flat
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.45, 6.0], fov: 30 }}
      gl={{ antialias: true, alpha: true }}
      aria-label="A dark globe turning while the SpotMe mark orbits it, lighting up the map spot by spot"
    >
      <Globe tokens={tokens} reduced={reduced} onProgress={onProgress} />
    </Canvas>
  );
}
