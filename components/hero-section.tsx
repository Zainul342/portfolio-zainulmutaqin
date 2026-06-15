'use client'

import { useEffect, useState, useRef } from 'react'
import { ArrowRight, Mail, MapPin } from 'lucide-react'
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

const BOOT_LINES = [
  { text: '> loading system modules...', color: '#cba6f7' },
  { text: '> initializing zainul.mutaqin...', color: '#cba6f7' },
  { text: '> status: full-stack developer | systems explorer', color: '#89b4fa' },
  { text: '> session active. ready.', color: '#a6e3a1' },
]

export function HeroSection() {
  const [mounted, setMounted] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [glitching, setGlitching] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  
  const heroRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setPrefersReducedMotion(mediaQuery.matches)
      if (mediaQuery.matches) {
        setRevealed(true)
      }
    }
  }, [])

  useEffect(() => {
    if (revealed && !prefersReducedMotion) {
      setGlitching(true)
      const t = setTimeout(() => setGlitching(false), 700)
      return () => clearTimeout(t)
    }
  }, [revealed, prefersReducedMotion])

  // SSR Skeleton to prevent hydration mismatch and ensure animations run cleanly on client
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="w-full max-w-xl mx-auto bg-[#0a0a0a] border border-white/5 rounded-lg h-48 animate-pulse" />
      </div>
    )
  }


  const handleMouseMove = (e: React.MouseEvent) => {
    const hero = heroRef.current
    if (!hero) return
    const rect = hero.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    hero.style.setProperty('--mouse-x', `${x}px`)
    hero.style.setProperty('--mouse-y', `${y}px`)
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
      {/* Ambient Topographic background at low opacity */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.12] z-0"
        aria-hidden="true"
      >
        <TopographicCanvas />
      </div>

      {/* ── Centered layout container ────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-3xl mx-auto px-6 py-20 flex flex-col items-center text-center">

        {/* ── CENTERED CONTENT COLUMN ── */}
        <div className="flex flex-col items-center w-full">
          {/* Terminal window */}
          <div
            className="w-full max-w-xl rounded-lg overflow-hidden mb-10 glow-card border border-white/5"
          >
            {/* Traffic lights bar */}
            <div className="traffic-lights border-b border-white/5">
              <span className="traffic-light" style={{ backgroundColor: '#f38ba8' }} aria-hidden="true" />
              <span className="traffic-light" style={{ backgroundColor: '#f9e2af' }} aria-hidden="true" />
              <span className="traffic-light" style={{ backgroundColor: '#a6e3a1' }} aria-hidden="true" />
              <span className="font-mono text-xs ml-2" style={{ color: '#6c7086' }}>
                zainul@portfolio ~ terminal
              </span>
            </div>

            {/* Terminal body */}
            <div
              className="p-5 font-mono text-sm leading-relaxed min-h-[128px] text-left w-full space-y-1"
              aria-live="polite"
              aria-label="Terminal boot sequence"
            >
              {BOOT_LINES.map((line, idx) => {
                const delayTime = idx * 0.4
                const isLastLine = idx === BOOT_LINES.length - 1

                return (
                  <div key={idx} className="min-h-[20px] mb-1">
                    {prefersReducedMotion ? (
                      <div style={{ color: line.color }}>
                        {line.text}
                        {isLastLine && (
                          <span className="terminal-cursor text-[#a6e3a1] font-bold">_</span>
                        )}
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: delayTime, ease: "easeOut" }}
                        onAnimationComplete={() => {
                          if (isLastLine) {
                            setRevealed(true)
                          }
                        }}
                        style={{ color: line.color }}
                      >
                        {line.text}
                        {isLastLine && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{
                              opacity: {
                                repeat: Infinity,
                                duration: 0.8,
                                ease: "linear",
                              },
                              delay: delayTime + 0.5,
                            }}
                            className="text-[#a6e3a1] font-bold inline-block ml-1"
                          >
                            _
                          </motion.span>
                        )}
                      </motion.div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Name + Tagline — revealed after boot */}
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

            {/* Coordinates — system metadata aesthetic */}
            <div
              className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 mt-3 mb-8 font-mono text-[10px]"
              style={{ color: '#a6adc8' }}
            >
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-ctp-mauve animate-pulse" />
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
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(203, 166, 247, 0.3)'
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
                    e.currentTarget.style.backgroundColor = 'rgba(137, 180, 250, 0.1)'
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(137, 180, 250, 0.15)'
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
