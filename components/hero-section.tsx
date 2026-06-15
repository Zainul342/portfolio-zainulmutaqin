'use client'

import { useEffect, useState, useRef } from 'react'
import { ArrowRight, Mail } from 'lucide-react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { MagneticButton } from '@/components/magnetic-button'
import { TextReveal } from '@/components/text-reveal'

function GlobeLoadingSkeleton() {
  return (
    <div
      className="w-full h-full rounded-full border animate-pulse"
      style={{ borderColor: 'var(--overlay)' }}
      aria-hidden="true"
    />
  )
}

// Lazy-load the topographic contour canvas so it never blocks initial paint
const TopographicCanvas = dynamic(
  () => import('@/components/topographic-canvas').then((m) => m.TopographicCanvas),
  { ssr: false, loading: () => <GlobeLoadingSkeleton /> },
)

// ─── Syntax-highlighted terminal line renderer ─────────────────────────────
// Parses a terminal line string into coloured <span> segments.
function TerminalLine({ raw }: { raw: string }) {
  // Line 0: "zainul@archlinux:~$ init_system --start"
  const promptMatch = raw.match(/^([^@]+)(@)([^:]+)(:)(~)(\$\s*)(.*)$/)
  if (promptMatch) {
    const [, user, at, host, colon, tilde, dollar, cmd] = promptMatch
    return (
      <span>
        <span style={{ color: '#a6e3a1' }}>{user}</span>   {/* green  — user  */}
        <span style={{ color: '#6c7086' }}>{at}</span>
        <span style={{ color: '#89b4fa' }}>{host}</span>   {/* blue   — host  */}
        <span style={{ color: '#6c7086' }}>{colon}</span>
        <span style={{ color: '#89dceb' }}>{tilde}</span>  {/* sky    — path  */}
        <span style={{ color: '#6c7086' }}>{dollar}</span>
        <span style={{ color: '#cdd6f4' }}>{cmd}</span>    {/* text   — cmd   */}
      </span>
    )
  }

  // Lines starting with ">" — output arrows
  if (raw.startsWith('>')) {
    const arrow = '>'
    const rest = raw.slice(1)
    // Last output line gets green accent
    const isSuccess = raw.includes('ready') || raw.includes('welcome')
    return (
      <span>
        <span style={{ color: '#f38ba8' }}>{arrow}</span>  {/* red/pink — arrow */}
        <span style={{ color: isSuccess ? '#a6e3a1' : '#cdd6f4' }}>{rest}</span>
      </span>
    )
  }

  // Fallback
  return <span style={{ color: '#cdd6f4' }}>{raw}</span>
}

export function HeroSection() {
  const [isMounted, setIsMounted] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [glitching, setGlitching] = useState(false)

  const heroRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const terminalLines = [
    'zainul@archlinux:~$ init_system --start',
    '> loading core modules...',
    '> fetching projects data...',
    '> system ready. welcome.',
  ]

  useEffect(() => {
    if (revealed) {
      setGlitching(true)
      const t = setTimeout(() => setGlitching(false), 700)
      return () => clearTimeout(t)
    }
  }, [revealed])

  // SSR Skeleton — matches the terminal frame dimensions to avoid layout shift
  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="w-full max-w-2xl mx-auto bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 rounded-sm h-[168px]" />
      </div>
    )
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const hero = heroRef.current
    if (!hero) return
    const rect = hero.getBoundingClientRect()
    hero.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
    hero.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
  }

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="noise-overlay relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Ambient topographic background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.12] z-0"
        aria-hidden="true"
      >
        <TopographicCanvas />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-3xl mx-auto px-6 py-20 flex flex-col items-center text-center">
        <div className="flex flex-col items-center w-full">

          {/* ── Terminal window ─────────────────────────────────────────── */}
          <div className="w-full max-w-2xl mx-auto bg-[#0d0d0d]/80 backdrop-blur-xl border border-white/10 rounded-sm overflow-hidden shadow-2xl mb-10">

            {/* Title bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.04] border-b border-white/10 font-mono tracking-wider select-none">
              {/* Workspace tabs */}
              <div className="flex space-x-3 text-xs">
                <span className="text-white/25">1</span>
                <span style={{ color: '#a6e3a1' }}>2</span>
                <span className="text-white/25">3</span>
              </div>
              {/* Title — syntax coloured */}
              <div className="font-mono text-xs">
                <span style={{ color: '#a6e3a1' }}>zainul</span>
                <span style={{ color: '#6c7086' }}>@</span>
                <span style={{ color: '#89b4fa' }}>archlinux</span>
                <span style={{ color: '#6c7086' }}>:</span>
                <span style={{ color: '#89dceb' }}>~</span>
              </div>
              {/* Window controls */}
              <div className="flex space-x-2 text-xs text-white/25">
                <span>_</span>
                <span>□</span>
                <span>x</span>
              </div>
            </div>

            {/* Terminal body */}
            <div
              className="px-6 py-5 font-mono text-sm text-left leading-7"
              aria-live="polite"
              aria-label="Terminal boot sequence"
            >
              {terminalLines.map((line, index) => {
                const isLastLine = index === terminalLines.length - 1
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.35, ease: 'easeOut' }}
                    onAnimationComplete={() => {
                      if (isLastLine) setRevealed(true)
                    }}
                    className="mb-1.5"
                  >
                    <TerminalLine raw={line} />
                  </motion.div>
                )
              })}

              {/* Blinking block cursor */}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ repeat: Infinity, duration: 0.75, repeatType: 'reverse', delay: terminalLines.length * 0.35 }}
                className="inline-block w-[9px] h-[15px] align-middle mt-1"
                style={{ backgroundColor: '#a6e3a1' }}
                aria-hidden="true"
              />
            </div>
          </div>

          {/* ── Name + Tagline — revealed after boot ───────────────────── */}
          <div
            className="transition-all duration-700 flex flex-col items-center w-full"
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? 'translateY(0)' : 'translateY(16px)',
            }}
          >
            <h1
              ref={nameRef}
              data-text="Zainul Mutaqin"
              className={`glitch-text text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-4 text-balance ${
                glitching ? 'animate-glitch' : ''
              }`}
              style={{ color: '#cdd6f4', lineHeight: 1.1 }}
            >
              <TextReveal text="Zainul Mutaqin" trigger={revealed} mode="chars" delay={0.1} stagger={0.03} />
            </h1>

            <p
              className="text-lg sm:text-xl leading-relaxed text-pretty max-w-xl text-center"
              style={{ color: '#a6adc8' }}
            >
              <TextReveal
                text="Building high-performance web systems and exploring terminal environments. Crafting clean, "
                trigger={revealed}
                mode="words"
                delay={0.6}
                stagger={0.015}
              />{' '}
              <span style={{ color: '#cba6f7' }}>
                <TextReveal
                  text="elegant software architectures."
                  trigger={revealed}
                  mode="words"
                  delay={1.4}
                  stagger={0.02}
                />
              </span>
            </p>

            {/* System metadata */}
            <div
              className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 mt-3 mb-8 font-mono text-[10px]"
              style={{ color: '#a6adc8' }}
            >
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#a6e3a1' }} />
                <span style={{ color: '#7f849c' }}>LOC:</span>
                <span style={{ color: '#cdd6f4' }}>6.2088° S, 106.8456° E</span>
              </div>
              <span className="text-white/10">|</span>
              <div className="flex items-center gap-1">
                <span style={{ color: '#7f849c' }}>ZONE:</span>
                <span style={{ color: '#cdd6f4' }}>UTC+07.00</span>
              </div>
              <span className="text-white/10">|</span>
              <div className="flex items-center gap-1">
                <span style={{ color: '#7f849c' }}>STATUS:</span>
                <span style={{ color: '#a6e3a1' }}>ONLINE</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <MagneticButton>
                <button
                  onClick={() => scrollTo('projects')}
                  className="group flex items-center gap-2 px-5 py-2.5 rounded-md font-mono text-sm font-medium transition-all duration-200 cursor-none"
                  style={{ backgroundColor: '#cba6f7', color: '#1e1e2e' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#d4b5f8'
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(203,166,247,0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#cba6f7'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  View Projects
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </MagneticButton>

              <MagneticButton>
                <button
                  onClick={() => scrollTo('contact')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-md font-mono text-sm font-medium transition-all duration-200 cursor-none"
                  style={{ backgroundColor: 'transparent', color: '#89b4fa', border: '1px solid #89b4fa' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(137,180,250,0.1)'
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(137,180,250,0.15)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <Mail size={14} />
                  Get in Touch
                </button>
              </MagneticButton>
            </div>

            {/* Cmd+K hint */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
              className="font-mono text-xs transition-colors cursor-none"
              style={{ color: '#6c7086' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#cba6f7' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#6c7086' }}
              aria-label="Open command palette"
            >
              press{' '}
              <kbd
                className="px-1.5 py-0.5 rounded text-[10px] bg-white/5 border border-white/10"
                style={{ color: '#cba6f7' }}
              >
                cmd+k
              </kbd>{' '}
              to explore
            </button>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      {revealed && (
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10"
          style={{ color: '#6c7086' }}
          aria-hidden="true"
        >
          <span className="font-mono text-[10px] tracking-widest uppercase">scroll</span>
          <div className="w-px h-8" style={{ background: 'linear-gradient(to bottom, #6c7086, transparent)' }} />
        </div>
      )}
    </section>
  )
}
