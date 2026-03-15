'use client'

import { useEffect, useState } from 'react'
import { Terminal } from 'lucide-react'

const NAV_SECTIONS = [
  { id: 'about', label: 'about' },
  { id: 'skills', label: 'skills' },
  { id: 'projects', label: 'projects' },
  { id: 'contact', label: 'contact' },
]

export function NavBar({ onOpenPalette }: { onOpenPalette: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)

      // Track active section
      for (const section of [...NAV_SECTIONS].reverse()) {
        const el = document.getElementById(section.id)
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(section.id)
          break
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? 'rgba(30, 30, 46, 0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid #313244' : '1px solid transparent',
      }}
    >
      <nav
        className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 font-mono text-sm font-semibold cursor-none group"
          style={{ color: '#cba6f7' }}
          aria-label="Go to top"
        >
          <Terminal size={15} />
          <span className="group-hover:opacity-75 transition-opacity">zm</span>
          <span style={{ color: '#313244' }}>/</span>
          <span
            className="terminal-cursor"
            style={{ width: '6px', height: '0.85em' }}
            aria-hidden="true"
          />
        </button>

        {/* Nav links — hidden on mobile */}
        <div className="hidden sm:flex items-center gap-6">
          {NAV_SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollTo(section.id)}
              className="font-mono text-xs transition-all duration-150 cursor-none relative"
              style={{
                color: activeSection === section.id ? '#cba6f7' : '#6c7086',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#a6adc8' }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = activeSection === section.id ? '#cba6f7' : '#6c7086'
              }}
              aria-current={activeSection === section.id ? 'true' : undefined}
            >
              {activeSection === section.id && (
                <span
                  className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: '#cba6f7' }}
                  aria-hidden="true"
                />
              )}
              {section.label}
            </button>
          ))}
        </div>

        {/* Cmd+K button */}
        <button
          onClick={onOpenPalette}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded font-mono text-xs transition-all duration-150 cursor-none"
          style={{
            backgroundColor: '#313244',
            color: '#6c7086',
            border: '1px solid #45475a',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#cba6f7'
            e.currentTarget.style.color = '#cba6f7'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#45475a'
            e.currentTarget.style.color = '#6c7086'
          }}
          aria-label="Open command palette (Cmd+K)"
        >
          <kbd style={{ fontFamily: 'inherit', fontSize: 'inherit' }}>⌘K</kbd>
        </button>

        {/* Mobile: just show cmd+k trigger */}
        <button
          onClick={onOpenPalette}
          className="sm:hidden flex items-center gap-1.5 font-mono text-xs cursor-none"
          style={{ color: '#6c7086' }}
          aria-label="Open command palette"
        >
          <Terminal size={14} />
          menu
        </button>
      </nav>
    </header>
  )
}
