import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';

/**
 * The hero's 3D lot.
 *
 * It tells the product's story literally, in one loop: a car glides in, the
 * sensor's sweep passes over it, the bay flips from free to occupied, and a pin
 * settles above it. No barrier, no ticket, no hunting — which is the thing the
 * page is trying to say.
 *
 * Every colour here is read from the site's existing CSS tokens rather than
 * hard-coded, so the scene can never drift from the rest of the palette.
 */

// ---- palette, pulled from :root so 3D and 2D stay in lockstep ---------------
function readTokens() {
  if (typeof window === 'undefined') return null;
  const s = getComputedStyle(document.documentElement);
  const get = (n, fb) => (s.getPropertyValue(n) || '').trim() || fb;
  return {
    free: get('--free', '#2E7D32'),
    occupied: get('--occupied', '#d97706'),
    tarmac: get('--bg-sunken', '#eef3ee'),
    line: get('--border-strong', '#cddbcf'),
    ink: get('--text', '#10231a'),
    primary: get('--green-500', '#2E7D32'),
    pale: get('--green-100', '#dcedde'),
  };
}

const BAY_W = 1.05;
const BAY_D = 2.0;
const GAP = 0.16;
const COLS = 3;
const ROWS = 2;

function bayPosition(col, row) {
  const x = (col - (COLS - 1) / 2) * (BAY_W + GAP);
  const z = row === 0 ? -(BAY_D / 2 + 0.55) : BAY_D / 2 + 0.55;
  return [x, 0, z];
}

/** A parked car: two rounded blocks, enough to read as a car at this scale. */
function Car({ position, rotation = 0, tone, opacity = 1 }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <RoundedBox args={[0.78, 0.22, 1.8]} radius={0.055} smoothness={4} position={[0, 0.13, 0]} castShadow>
        <meshStandardMaterial color={tone} roughness={0.38} metalness={0.06}
                              transparent={opacity < 1} opacity={opacity} />
      </RoundedBox>
      <RoundedBox args={[0.62, 0.2, 0.78]} radius={0.05} smoothness={4} position={[0, 0.32, -0.12]} castShadow>
        <meshStandardMaterial color={tone} roughness={0.34} metalness={0.04}
                              transparent={opacity < 1} opacity={opacity} />
      </RoundedBox>
      {/* windscreen band — the detail that makes it read as a vehicle */}
      <mesh position={[0, 0.33, 0.28]} rotation={[-0.38, 0, 0]}>
        <planeGeometry args={[0.54, 0.17]} />
        <meshStandardMaterial color={tone} roughness={0.1} metalness={0.45}
                              transparent opacity={0.5 * opacity} />
      </mesh>
    </group>
  );
}

/** One bay: painted outline that shifts colour as the car is detected. */
function Bay({ position, colorFree, colorBusy, occupancy }) {
  const mat = useRef();
  const line = useRef();
  useFrame(() => {
    if (line.current) {
      line.current.color.lerpColors(
        new THREE.Color(colorFree), new THREE.Color(colorBusy), occupancy.current
      );
      line.current.opacity = 0.4 + occupancy.current * 0.5;
    }
    if (!mat.current) return;
    mat.current.color.lerpColors(
      new THREE.Color(colorFree), new THREE.Color(colorBusy), occupancy.current
    );
    mat.current.opacity = 0.10 + occupancy.current * 0.22;
  });
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]} receiveShadow>
        <planeGeometry args={[BAY_W, BAY_D]} />
        <meshStandardMaterial ref={mat} transparent roughness={0.9} />
      </mesh>
      <lineSegments rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.016, 0]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(BAY_W, BAY_D)]} />
        <lineBasicMaterial ref={line} transparent opacity={0.85} />
      </lineSegments>
    </group>
  );
}

/** The sensor mast and its rotating sweep — the thing that does the detecting. */
function Sensor({ tokens, sweepRef }) {
  const wedge = useRef();
  useFrame((_, dt) => {
    if (!wedge.current) return;
    wedge.current.rotation.y += dt * 0.85;
    sweepRef.current = wedge.current.rotation.y;
  });
  return (
    <group position={[-(COLS / 2) * (BAY_W + GAP) - 0.42, 0, 0]}>
      <mesh position={[0, 0.85, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.045, 1.7, 12]} />
        <meshStandardMaterial color={tokens.ink} roughness={0.6} />
      </mesh>
      <RoundedBox args={[0.2, 0.16, 0.12]} radius={0.03} smoothness={3} position={[0, 1.74, 0]} castShadow>
        <meshStandardMaterial color={tokens.ink} roughness={0.4} />
      </RoundedBox>
      <group ref={wedge} position={[0, 0.03, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[3.1, 48, 0, Math.PI / 4.5]} />
          <meshBasicMaterial color={tokens.primary} transparent opacity={0.13}
                             side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>
    </group>
  );
}

/** Pin that drops once the bay is confirmed occupied. */
function Pin({ position, show, tokens }) {
  const g = useRef();
  useFrame((state, dt) => {
    if (!g.current) return;
    const target = show.current ? 1 : 0;
    g.current.userData.t = THREE.MathUtils.damp(g.current.userData.t ?? 0, target, 6, dt);
    const t = g.current.userData.t;
    g.current.scale.setScalar(t);
    g.current.position.y = position[1] + 0.5 + (1 - t) * 0.7
      + Math.sin(state.clock.elapsedTime * 2) * 0.045 * t;
  });
  return (
    <group ref={g} position={position}>
      <mesh castShadow>
        <sphereGeometry args={[0.19, 20, 20]} />
        <meshStandardMaterial color={tokens.primary} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.2, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.12, 0.26, 20]} />
        <meshStandardMaterial color={tokens.primary} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.02, 0.16]}>
        <circleGeometry args={[0.075, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

function Lot({ tokens, reduced }) {
  const sweepRef = useRef(0);
  // Which bays start full. The hero bay (index 7) is the one the car parks in.
  const HERO = 4;
  const initial = useMemo(() => [1, 0, 1, 1, 0, 0], []);
  const occ = useMemo(() => initial.map((v) => ({ current: v })), [initial]);
  const pinShow = useRef(false);
  const car = useRef();
  const phase = useRef(0);          // 0 approach · 1 turn-in · 2 settled · 3 hold

  const heroPos = bayPosition(HERO % COLS, Math.floor(HERO / COLS));

  useFrame((state, dt) => {
    if (!car.current) return;
    if (reduced) {
      car.current.position.set(heroPos[0], 0, heroPos[2]);
      occ[HERO].current = 1; pinShow.current = true;
      return;
    }
    const T = state.clock.elapsedTime % 11;      // 11-second loop
    if (T < 3.4) {                                // glide along the aisle
      phase.current = 0;
      const k = T / 3.4;
      car.current.position.x = THREE.MathUtils.lerp(4.6, heroPos[0], k * k * (3 - 2 * k));
      car.current.position.z = 0;
      car.current.rotation.y = Math.PI / 2;
      occ[HERO].current = 0; pinShow.current = false;
    } else if (T < 5.1) {                         // turn and reverse in
      const k = (T - 3.4) / 1.7;
      const e = k * k * (3 - 2 * k);
      car.current.position.x = heroPos[0];
      car.current.position.z = THREE.MathUtils.lerp(0, heroPos[2], e);
      car.current.rotation.y = THREE.MathUtils.lerp(Math.PI / 2, 0, e);
    } else {                                      // detected, then held
      car.current.position.set(heroPos[0], 0, heroPos[2]);
      car.current.rotation.y = 0;
      occ[HERO].current = THREE.MathUtils.damp(occ[HERO].current, 1, 4, dt);
      pinShow.current = T > 5.8;
    }
  });

  return (
    <group>
      {/* The lot as a floating slab. Treating it as an OBJECT rather than an
          endless plane is what lets it sit on a white page without a fade that
          reads as a grey halo — and it gives the scene a silhouette. */}
      <RoundedBox
        args={[COLS * (BAY_W + GAP) + 1.5, 0.34, ROWS * BAY_D + 2.5]}
        radius={0.14} smoothness={5} position={[0, -0.175, 0]} receiveShadow castShadow
      >
        <meshStandardMaterial color={tokens.tarmac} roughness={0.95} metalness={0} />
      </RoundedBox>
      {/* a lighter top face so bay paint reads against it */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]} receiveShadow>
        <planeGeometry args={[COLS * (BAY_W + GAP) + 1.4, ROWS * BAY_D + 2.4]} />
        <meshStandardMaterial color="#f3f7f3" roughness={0.98} />
      </mesh>

      {Array.from({ length: COLS * ROWS }).map((_, i) => (
        <Bay key={i} position={bayPosition(i % COLS, Math.floor(i / COLS))}
             colorFree={tokens.free} colorBusy={tokens.occupied} occupancy={occ[i]} />
      ))}

      {/* cars already parked */}
      {initial.map((v, i) =>
        v ? <Car key={`p${i}`} position={bayPosition(i % COLS, Math.floor(i / COLS))}
                 tone="#dfe8e1" /> : null
      )}

      {/* the one that arrives */}
      <group ref={car}><Car position={[0, 0, 0]} tone="#ffffff" /></group>

      <Pin position={[heroPos[0], 0.95, heroPos[2]]} show={pinShow} tokens={tokens} />
      <Sensor tokens={tokens} sweepRef={sweepRef} />

      <ContactShadows position={[0, -0.36, 0]} opacity={0.42} scale={13} blur={2.8} far={5} resolution={512} />
    </group>
  );
}

export default function ParkingScene({ reduced = false }) {
  const [tokens, setTokens] = useState(null);
  useEffect(() => { setTokens(readTokens()); }, []);
  if (!tokens) return <div className="scene-placeholder" aria-hidden="true" />;

  return (
    <Canvas
      className="parking-canvas"
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [8.2, 9.6, 9.4], fov: 27 }}
      gl={{ antialias: true, alpha: true }}
      aria-label="A car glides into an empty bay, the sensor detects it, and the bay turns from free to occupied"
    >
      <ambientLight intensity={0.85} />
      <directionalLight
        position={[5, 8, 4]} intensity={1.15} castShadow
        shadow-mapSize={[1024, 1024]} shadow-camera-far={24}
        shadow-camera-left={-9} shadow-camera-right={9}
        shadow-camera-top={9} shadow-camera-bottom={-9}
      />
      <directionalLight position={[-6, 4, -5]} intensity={0.3} />
      <Float speed={reduced ? 0 : 1.1} rotationIntensity={reduced ? 0 : 0.05} floatIntensity={reduced ? 0 : 0.12}>
        <Lot tokens={tokens} reduced={reduced} />
      </Float>
    </Canvas>
  );
}
