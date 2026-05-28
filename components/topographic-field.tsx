'use client'

export function TopographicField() {
  return (
    <div className="relative w-full h-full min-h-[300px] lg:min-h-[440px] overflow-hidden rounded-2xl border border-[#313244] bg-[#11111b]/40 flex items-center justify-center">
      
      {/* Background radial glow */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(203, 166, 247, 0.08) 0%, transparent 60%)'
        }}
        aria-hidden="true"
      />
      
      <svg
        viewBox="0 0 520 520"
        className="absolute inset-0 h-full w-full object-cover opacity-80"
        role="img"
        aria-label="Abstract topographic signal field"
      >
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <g fill="none" stroke="#45475a" strokeOpacity="0.45" strokeWidth="1" className="transition-all duration-[2000ms] ease-in-out">
          {/* Outer contours */}
          <path d="M40 260 C 80 120, 320 80, 460 200 C 500 320, 360 480, 200 460 C 80 420, 20 360, 40 260 Z" />
          <path d="M80 260 C 110 160, 300 120, 410 220 C 440 300, 330 420, 210 400 C 120 370, 60 330, 80 260 Z" />
          <path d="M120 260 C 140 190, 280 160, 360 240 C 380 300, 300 380, 220 360 C 150 340, 110 300, 120 260 Z" />
          <path d="M160 260 C 170 220, 260 200, 310 260 C 320 300, 270 340, 230 330 C 180 310, 150 280, 160 260 Z" />
          {/* Core contour */}
          <path d="M190 260 C 195 240, 240 230, 270 260 C 275 280, 250 310, 235 305 C 205 295, 185 275, 190 260 Z" />
        </g>

        {/* Route Line */}
        <g fill="none" stroke="#cba6f7" strokeOpacity="0.65" strokeWidth="1.5">
          <path d="M160 380 C 220 330, 250 270, 310 260 S 390 180, 420 120" strokeDasharray="4 6" />
        </g>

        {/* Waypoints & Labels */}
        <g fontFamily="monospace" fontSize="11" letterSpacing="0.05em">
          {/* Origin */}
          <g transform="translate(160, 380)">
            <circle cx="0" cy="0" r="4" fill="#a6e3a1" filter="url(#glow)" />
            <circle cx="0" cy="0" r="1.5" fill="#11111b" />
            <text x="12" y="3" fill="#a6adc8">origin</text>
          </g>

          {/* Terrain */}
          <g transform="translate(250, 300)">
            <circle cx="0" cy="0" r="3" fill="#89b4fa" />
            <text x="10" y="3" fill="#6c7086">terrain</text>
          </g>

          {/* Signal */}
          <g transform="translate(310, 260)">
            <circle cx="0" cy="0" r="3" fill="#cba6f7" filter="url(#glow)" />
            <circle cx="0" cy="0" r="1" fill="#11111b" />
            <text x="-25" y="-12" fill="#6c7086">signal</text>
          </g>

          {/* Bearing */}
          <g transform="translate(420, 120)">
            <circle cx="0" cy="0" r="3" fill="#f9e2af" />
            <text x="-48" y="3" fill="#6c7086">bearing</text>
          </g>
        </g>
      </svg>

      <div className="absolute bottom-4 left-4 flex flex-col gap-0.5 font-mono text-[9px] text-[#6c7086] uppercase tracking-widest">
        <span>sys.cartography</span>
        <span className="text-[#cba6f7] opacity-60">map active</span>
      </div>
    </div>
  )
}
