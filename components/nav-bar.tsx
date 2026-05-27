'use client'

import { useEffect, useState } from 'react'
import { Terminal } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_SECTIONS = [
  { id: 'about', label: 'about', isHash: true },
  { id: 'experience', label: 'experience', isHash: true },
  { id: 'projects', label: 'projects', isHash: true },
  { id: 'contact', label: 'contact', isHash: true },
  { id: 'blog', label: 'blog', isHash: false, path: '/blog' },
]

export function NavBar({ onOpenPalette }: { onOpenPalette: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const pathname = usePathname()

  useEffect(() => {
    if (pathname !== '/') {
      setActiveSection('blog')
      return
    }

    const onScroll = () => {
      setScrolled(window.scrollY > 40)

      // Track active section on homepage
      for (const section of [...NAV_SECTIONS].reverse()) {
        if (!section.isHash) continue
        const el = document.getElementById(section.id)
        if (el && window.scrollY >= el.offsetTop - 140) {
          setActiveSection(section.id)
          break
        }
      }
    }
    
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  const scrollTo = (id: string) => {
    if (pathname !== '/') {
      window.location.href = `/#${id}`
      return
    }
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Check if prefers reduced motion is enabled to avoid sliding layout animations
  const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <motion.header
      initial={isReducedMotion ? {} : { y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
      style={{
        backgroundColor: scrolled || pathname !== '/' ? 'rgba(30, 30, 46, 0.92)' : 'transparent',
        backdropFilter: scrolled || pathname !== '/' ? 'blur(12px)' : 'none',
        borderBottom: scrolled || pathname !== '/' ? '1px solid #313244' : '1px solid transparent',
      }}
    >
      <nav
        className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-mono text-sm font-semibold cursor-none group"
          style={{ color: '#cba6f7' }}
          aria-label="Go to homepage"
        >
          <Terminal size={15} />
          <span className="group-hover:opacity-75 transition-opacity">zm</span>
          <span style={{ color: '#313244' }}>/</span>
          <span
            className="terminal-cursor"
            style={{ width: '6px', height: '0.85em' }}
            aria-hidden="true"
          />
        </Link>

        {/* Nav links — hidden on mobile */}
        <div className="hidden sm:flex items-center gap-6">
          {NAV_SECTIONS.map((section) => {
            const isActive = activeSection === section.id || (section.id === 'blog' && pathname.startsWith('/blog'))

            if (section.isHash) {
              return (
                <button
                  key={section.id}
                  onClick={() => scrollTo(section.id)}
                  className="font-mono text-xs transition-all duration-150 cursor-none relative"
                  style={{
                    color: isActive ? '#cba6f7' : '#6c7086',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#a6adc8' }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = isActive ? '#cba6f7' : '#6c7086'
                  }}
                  aria-current={isActive ? 'true' : undefined}
                >
                  {isActive && (
                    isReducedMotion ? (
                      <span
                        className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: '#cba6f7' }}
                        aria-hidden="true"
                      />
                    ) : (
                      <motion.span
                        layoutId="activeSectionDot"
                        className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: '#cba6f7' }}
                        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                        aria-hidden="true"
                      />
                    )
                  )}
                  {section.label}
                </button>
              )
            } else {
              return (
                <Link
                  key={section.id}
                  href={section.path || '/'}
                  className="font-mono text-xs transition-all duration-150 cursor-none relative"
                  style={{
                    color: isActive ? '#cba6f7' : '#6c7086',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#a6adc8' }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = isActive ? '#cba6f7' : '#6c7086'
                  }}
                  aria-current={isActive ? 'true' : undefined}
                >
                  {isActive && (
                    isReducedMotion ? (
                      <span
                        className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: '#cba6f7' }}
                        aria-hidden="true"
                      />
                    ) : (
                      <motion.span
                        layoutId="activeSectionDot"
                        className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: '#cba6f7' }}
                        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                        aria-hidden="true"
                      />
                    )
                  )}
                  {section.label}
                </Link>
              )
            }
          })}
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
    </motion.header>
  )
}
