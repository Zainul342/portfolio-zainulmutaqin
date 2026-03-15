'use client'

import { useEffect, useState } from 'react'

const SECTIONS = ['hero', 'about', 'skills', 'projects', 'contact']

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      const current = window.scrollY
      setProgress(total > 0 ? current / total : 0)

      // Find active section
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i])
        if (el && window.scrollY >= el.offsetTop - 200) {
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

  return (
    <div
      className="fixed right-5 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center gap-3"
      aria-hidden="true"
    >
      {/* Section dots */}
      <div className="flex flex-col items-center gap-2">
        {SECTIONS.map((s, i) => (
          <button
            key={s}
            onClick={() => scrollTo(s)}
            className="group w-5 h-5 flex items-center justify-center cursor-none"
            title={s}
            aria-label={`Go to ${s} section`}
          >
            <span
              className="rounded-full transition-all duration-300"
              style={{
                width: i === activeIndex ? 6 : 4,
                height: i === activeIndex ? 6 : 4,
                backgroundColor:
                  i === activeIndex
                    ? '#cba6f7'
                    : i < activeIndex
                    ? 'rgba(203,166,247,0.4)'
                    : '#313244',
                boxShadow: i === activeIndex ? '0 0 6px rgba(203,166,247,0.5)' : 'none',
              }}
            />
          </button>
        ))}
      </div>

      {/* Progress line */}
      <div className="relative w-0.5 h-20 rounded-full" style={{ backgroundColor: '#313244' }}>
        <div
          className="absolute top-0 left-0 w-full rounded-full transition-all duration-150"
          style={{
            height: `${progress * 100}%`,
            backgroundColor: '#cba6f7',
            boxShadow: '0 0 4px rgba(203,166,247,0.4)',
          }}
        />
      </div>
    </div>
  )
}
