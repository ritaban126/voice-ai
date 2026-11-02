export function NearbyMap() {
  return (
    <svg
      viewBox="0 0 640 480"
      role="img"
      aria-label="Map of Indiranagar showing Ravi Kumar, 1.2 km from your home"
      className="block h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="640" height="480" fill="#ECE5D6" />

      <rect x="48" y="48" width="184" height="118" rx="20" fill="#D5E5D8" />
      <rect x="430" y="330" width="160" height="108" rx="20" fill="#D5E5D8" />

      <g fill="#E2D9C6">
        <rect x="262" y="60" width="120" height="70" rx="10" />
        <rect x="402" y="60" width="88" height="70" rx="10" />
        <rect x="262" y="350" width="120" height="90" rx="10" />
        <rect x="48" y="330" width="170" height="90" rx="10" />
        <rect x="520" y="170" width="70" height="100" rx="10" />
      </g>

      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M-10 150 C 180 190, 380 110, 660 170" stroke="#FBF8F3" strokeWidth="26" />
        <path d="M-10 300 L 660 252" stroke="#FBF8F3" strokeWidth="22" />
        <path d="M236 -10 L 258 490" stroke="#FBF8F3" strokeWidth="20" />
        <path d="M494 -10 L 472 490" stroke="#FBF8F3" strokeWidth="16" />
        <path d="M-10 420 L 660 400" stroke="#FBF8F3" strokeWidth="12" />
      </g>

      <text x="62" y="222" fill="#6B665B" fontSize="14" fontWeight="600" letterSpacing="0.06em">
        INDIRANAGAR
      </text>

      <path
        d="M168 352 C 220 300, 290 330, 350 268 S 400 228, 430 206"
        fill="none"
        stroke="#B8421E"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="2 10"
      />

      <g>
        <rect x="292" y="268" width="84" height="28" rx="14" fill="#1D1B17" />
        <text x="334" y="287" fill="#FBF8F3" fontSize="13" fontWeight="600" textAnchor="middle">
          1.2 km
        </text>
      </g>

      {[
        [96, 186],
        [560, 84],
        [566, 396],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="8" fill="#6B665B" stroke="#FBF8F3" strokeWidth="3" />
      ))}

      <g transform="translate(168 352)">
        <circle r="26" fill="#1D1B17" stroke="#FBF8F3" strokeWidth="4" />
        <text y="5" fill="#FBF8F3" fontSize="14" fontWeight="600" textAnchor="middle">
          RK
        </text>
      </g>

      <g transform="translate(430 206)">
        <circle r="30" fill="#B8421E" fillOpacity="0.15" />
        <circle r="13" fill="#B8421E" stroke="#FBF8F3" strokeWidth="4" />
      </g>
      <g transform="translate(430 178)">
        <rect x="-30" y="-22" width="60" height="26" rx="13" fill="#FBF8F3" />
        <text y="-4" fill="#1D1B17" fontSize="13" fontWeight="600" textAnchor="middle">
          You
        </text>
      </g>
    </svg>
  );
}
