import './HeroIllustration.css';

// Inline SVG hero illustration: top-down parking lot with radar + live detections.
function HeroIllustration() {
  return (
    <svg
      className="hero-illustration"
      viewBox="0 0 520 460"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Top-down parking lot illustration showing radar detection of occupied and available spots"
    >
      <defs>
        <filter id="hero-drop" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="8" />
          <feOffset dx="0" dy="10" result="off" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.18" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="lot-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F8FAFC" />
          <stop offset="100%" stopColor="#EEF2F7" />
        </linearGradient>
        <radialGradient id="radar-cone" cx="0.15" cy="0.9" r="0.95">
          <stop offset="0%" stopColor="#2E7D32" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#2E7D32" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#2E7D32" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Lot card with drop shadow */}
      <g filter="url(#hero-drop)">
        <rect x="40" y="50" width="440" height="360" rx="20" fill="url(#lot-bg)" stroke="#E2E8F0" />

        {/* Lane */}
        <rect x="60" y="220" width="400" height="28" fill="#E2E8F0" opacity="0.6" />
        <g stroke="#ffffff" strokeWidth="3" strokeDasharray="10 10">
          <line x1="70" y1="234" x2="450" y2="234" />
        </g>

        {/* Stall dividers — 3 columns x 2 rows = 6 spots */}
        {/* Top row stalls at y 80..210 */}
        <g stroke="#CBD5E1" strokeWidth="2">
          <line x1="200" y1="80" x2="200" y2="210" />
          <line x1="320" y1="80" x2="320" y2="210" />
          <line x1="440" y1="80" x2="440" y2="210" />
          <line x1="80" y1="80" x2="80" y2="210" />
          <line x1="80" y1="80" x2="440" y2="80" />
          <line x1="80" y1="210" x2="440" y2="210" />
        </g>
        {/* Bottom row stalls at y 260..390 */}
        <g stroke="#CBD5E1" strokeWidth="2">
          <line x1="200" y1="260" x2="200" y2="390" />
          <line x1="320" y1="260" x2="320" y2="390" />
          <line x1="440" y1="260" x2="440" y2="390" />
          <line x1="80" y1="260" x2="80" y2="390" />
          <line x1="80" y1="260" x2="440" y2="260" />
          <line x1="80" y1="390" x2="440" y2="390" />
        </g>

        {/* Available spots glow — spot[0,0] top-left and spot[1,1] bottom-middle */}
        <rect className="available-glow" x="90" y="90" width="100" height="110" rx="8" fill="#2E7D32" />
        <rect className="available-glow available-glow-2" x="210" y="270" width="100" height="110" rx="8" fill="#2E7D32" />

        {/* Available labels */}
        <text x="140" y="150" textAnchor="middle" fontSize="11" fontWeight="700" fill="#2E7D32" letterSpacing="1">FREE</text>
        <text x="260" y="330" textAnchor="middle" fontSize="11" fontWeight="700" fill="#2E7D32" letterSpacing="1">FREE</text>

        {/* Cars — 4 occupied */}
        {/* top row: position 1 (navy) and position 2 (white) */}
        <rect x="216" y="100" width="88" height="95" rx="10" fill="#1E293B" />
        <rect x="226" y="110" width="68" height="30" rx="6" fill="#0F172A" opacity="0.6" />
        <rect x="226" y="155" width="68" height="30" rx="6" fill="#0F172A" opacity="0.6" />

        <rect x="336" y="100" width="88" height="95" rx="10" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
        <rect x="346" y="110" width="68" height="30" rx="6" fill="#E2E8F0" />
        <rect x="346" y="155" width="68" height="30" rx="6" fill="#E2E8F0" />

        {/* bottom row: position 0 (gray) and position 2 (navy) */}
        <rect x="96" y="280" width="88" height="95" rx="10" fill="#94A3B8" />
        <rect x="106" y="290" width="68" height="30" rx="6" fill="#64748B" opacity="0.7" />
        <rect x="106" y="335" width="68" height="30" rx="6" fill="#64748B" opacity="0.7" />

        <rect x="336" y="280" width="88" height="95" rx="10" fill="#1E293B" />
        <rect x="346" y="290" width="68" height="30" rx="6" fill="#0F172A" opacity="0.6" />
        <rect x="346" y="335" width="68" height="30" rx="6" fill="#0F172A" opacity="0.6" />

        {/* Radar device on pole — bottom-left outside lot */}
        <line x1="52" y1="395" x2="52" y2="340" stroke="#64748B" strokeWidth="3" />
        <circle cx="52" cy="336" r="9" fill="#2E7D32" stroke="#ffffff" strokeWidth="2" />
        <circle cx="52" cy="336" r="3" fill="#ffffff" />

        {/* Radar detection cone */}
        <path
          d="M 52 336 L 470 100 L 470 380 Z"
          fill="url(#radar-cone)"
        />

        {/* DETECTED badge chips above 2 occupied cars */}
        <g className="detected-badge badge-1">
          <rect x="225" y="72" width="92" height="22" rx="11" fill="#ffffff" stroke="#2E7D32" strokeWidth="1.5" />
          <circle cx="238" cy="83" r="3.5" fill="#2E7D32" />
          <text x="250" y="87" fontSize="9" fontWeight="700" fill="#2E7D32" letterSpacing="0.8">DETECTED</text>
        </g>
        <g className="detected-badge badge-2">
          <rect x="345" y="252" width="92" height="22" rx="11" fill="#ffffff" stroke="#2E7D32" strokeWidth="1.5" />
          <circle cx="358" cy="263" r="3.5" fill="#2E7D32" />
          <text x="370" y="267" fontSize="9" fontWeight="700" fill="#2E7D32" letterSpacing="0.8">DETECTED</text>
        </g>

        {/* Mini dashboard card top-right */}
        <g>
          <rect x="350" y="18" width="150" height="56" rx="12" fill="#ffffff" stroke="#E2E8F0" strokeWidth="1.5" />
          <text x="365" y="38" fontSize="10" fontWeight="600" fill="#64748B" letterSpacing="0.5">LIVE OCCUPANCY</text>
          <text x="365" y="62" fontSize="18" fontWeight="700" fill="#1E293B">Spots free: </text>
          <text x="455" y="62" fontSize="18" fontWeight="700" fill="#2E7D32">2 / 6</text>
        </g>
      </g>
    </svg>
  );
}

export default HeroIllustration;
