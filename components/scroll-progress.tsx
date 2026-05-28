'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SECTIONS = [
  { id: 'hero', label: '00 // terminal', color: '#cba6f7' },
  { id: 'about', label: '01 // about', color: '#cba6f7' },
  { id: 'experience', label: '02 // experience', color: '#89b4fa' },
  { id: 'projects', label: '03 // projects', color: '#a6e3a1' },
  { id: 'contact', label: '04 // contact', color: '#94e2d5' }
]

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      const current = window.scrollY
      setProgress(total > 0 ? current / total : 0)

      // Find active section
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id)
        if (el && window.scrollY >= el.offsetTop - 240) {
          setActiveIndex(i)
          break
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const activeColor = SECTIONS[activeIndex].color

  return (
    <div
      className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-end gap-6"
      aria-hidden="true"
    >
      {/* Route track dots */}
      <div className="flex flex-col items-end gap-4">
        {SECTIONS.map((s, i) => {
          const isActive = i === activeIndex
          const isPast = i < activeIndex
          const isHovered = i === hoveredIndex

          return (
            <div 
              key={s.id} 
              className="relative flex items-center gap-3"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Dynamic slide-out label */}
              <AnimatePresence>
                {(isHovered || isActive) && (
                  <motion.span
                    initial={{ opacity: 0, x: 10, scale: 0.9 }}
                    animate={{ opacity: 0.85, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 10, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="font-mono text-[9px] px-2 py-0.5 border border-ctp-surface0 rounded bg-ctp-mantle/90 text-ctp-text whitespace-nowrap"
                    style={{ borderColor: isActive ? s.color : '#313244' }}
                  >
                    {s.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Waypoint circle button */}
              <button
                onClick={() => scrollTo(s.id)}
                className="w-5 h-5 flex items-center justify-center cursor-none focus:outline-none"
                aria-label={`Go to ${s.id} section`}
              >
                <div className="relative flex items-center justify-center">
                  {/* Outer active pulse ring */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute w-4 h-4 rounded-full border opacity-50"
                      style={{ borderColor: s.color }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}

                  {/* Inner dot */}
                  <span
                    className="rounded-full transition-all duration-300 relative z-10"
                    style={{
                      width: isActive ? 6 : 4,
                      height: isActive ? 6 : 4,
                      backgroundColor: isActive
                        ? s.color
                        : isPast
                        ? 'rgba(203,166,247,0.3)'
                        : '#313244',
                      boxShadow: isActive ? `0 0 8px ${s.color}` : 'none'
                    }}
                  />
                </div>
              </button>
            </div>
          )
        })}
      </div>

      {/* Cartographic Telemetry progress track line */}
      <div className="relative w-px h-24 rounded-full mr-2.5 bg-[#313244]" style={{ height: '90px' }}>
        {/* Dash/Track marker grids */}
        <div className="absolute inset-y-0 left-[-2px] flex flex-col justify-between w-[5px] h-full pointer-events-none opacity-40">
          <span className="w-1 h-px bg-ctp-overlay0" />
          <span className="w-1.5 h-px bg-ctp-overlay0" />
          <span className="w-1 h-px bg-ctp-overlay0" />
          <span className="w-1.5 h-px bg-ctp-overlay0" />
          <span className="w-1 h-px bg-ctp-overlay0" />
        </div>
        
        {/* Solid active indicator filling track */}
        <div
          className="absolute top-0 left-0 w-full rounded-full transition-all duration-150"
          style={{
            height: `${progress * 100}%`,
            backgroundColor: activeColor,
            boxShadow: `0 0 6px ${activeColor}`,
          }}
        />
      </div>
      
      {/* Tiny coordinates overlay */}
      <div className="mr-2 font-mono text-[7px] text-ctp-overlay2 uppercase tracking-widest pointer-events-none select-none">
        utc+07.00
      </div>
    </div>
  )
}

