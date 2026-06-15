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
    "zainul@portfolio:~$ init_system --start",
    "> loading core modules...",
    "> fetching projects data...",
    "> system ready. welcome."
  ]

  useEffect(() => {
    if (revealed) {
      setGlitching(true)
      const t = setTimeout(() => setGlitching(false), 700)
      return () => clearTimeout(t)
    }
  }, [revealed])

  // SSR Skeleton to prevent hydration mismatch and ensure animations run cleanly on client
  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="w-full max-w-2xl mx-auto bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 rounded-sm h-64" />
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
          <div className="w-full max-w-2xl mx-auto bg-[#0a0a0a]/70 backdrop-blur-lg border border-white/10 rounded-sm overflow-hidden shadow-2xl mb-10">
            {/* Minimal Tiling Window Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10 font-mono text-[10px] text-neutral-400 tracking-wider">
              <div className="flex space-x-3 select-none">
                <span className="text-white/30">1</span>
                <span className="text-white/80">2</span>
                <span className="text-white/30">3</span>
              </div>
              <div className="text-neutral-300 font-mono">zainul@archlinux:~</div>
              <div className="flex space-x-2 text-white/30 select-none">
                <span>_</span>
                <span>□</span>
                <span>x</span>
              </div>
            </div>

            {/* Terminal body */}
            <div
              className="p-6 font-mono text-sm text-neutral-300 text-left"
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
                    transition={{ duration: 0.4, delay: index * 0.3, ease: "easeOut" }}
                    onAnimationComplete={() => {
                      if (isLastLine) {
                        setRevealed(true)
                      }
                    }}
                    className="mb-2 font-mono"
                  >
                    {line}
                  </motion.div>
                )
              })}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ repeat: Infinity, duration: 0.8, repeatType: "reverse" }}
                className="inline-block w-2 h-4 bg-neutral-400 mt-1 align-middle"
              />
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
