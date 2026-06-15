'use client'

import { useEffect, useState, useRef } from 'react'
import { ArrowRight, Mail, MapPin } from 'lucide-react'
import dynamic from 'next/dynamic'
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
  { text: '> loading system modules...', delay: 0 },
  { text: '> initializing zainul.mutaqin...', delay: 600 },
  { text: '> status: full-stack developer | systems explorer', delay: 1400 },
  { text: '> session active. ready.', delay: 2400 },
]

const MOBILE_TYPING_SPEED = 30
const DESKTOP_TYPING_SPEED = 40
const REVEAL_DELAY = 3200

function useTypewriter(lines: typeof BOOT_LINES) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([])
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [done, setDone] = useState(false)
  const [typingSpeed, setTypingSpeed] = useState(DESKTOP_TYPING_SPEED)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches) {
      setDisplayedLines(lines.map((l) => l.text))
      setDone(true)
      return
    }

    const updateTypingSpeed = () => {
      setTypingSpeed(window.innerWidth < 768 ? MOBILE_TYPING_SPEED : DESKTOP_TYPING_SPEED)
    }

    updateTypingSpeed()
    window.addEventListener('resize', updateTypingSpeed)
    return () => window.removeEventListener('resize', updateTypingSpeed)
  }, [lines])

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }
    if (currentLineIndex >= lines.length) {
      setDone(true)
      // Pause for 5.5s at the end of the sequence, then reset (Total cycle ~8 seconds)
      const loopTimer = setTimeout(() => {
        setDisplayedLines([])
        setCurrentLineIndex(0)
        setCurrentCharIndex(0)
        setDone(false)
      }, 5500)
      return () => clearTimeout(loopTimer)
    }

    const line = lines[currentLineIndex]
    const startDelay =
      currentLineIndex === 0
        ? line.delay
        : line.delay - lines[currentLineIndex - 1].delay

    const lineTimer = setTimeout(() => {
      const charTimer = setInterval(() => {
        setCurrentCharIndex((prev) => {
          const next = prev + 1
          setDisplayedLines((prevLines) => {
            const updated = [...prevLines]
            updated[currentLineIndex] = line.text.slice(0, next)
            return updated
          })
          if (next >= line.text.length) {
            clearInterval(charTimer)
            setCurrentLineIndex((i) => i + 1)
            setCurrentCharIndex(0)
          }
          return next
        })
      }, typingSpeed)
      return () => clearInterval(charTimer)
    }, currentLineIndex === 0 ? 400 : startDelay)

    return () => clearTimeout(lineTimer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLineIndex, typingSpeed, done])

  return { displayedLines, done }
}

export function HeroSection() {
  const { displayedLines, done } = useTypewriter(BOOT_LINES)
  const [revealed, setRevealed] = useState(false)
  const [hasRevealed, setHasRevealed] = useState(false)
  const [glitching, setGlitching] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (done && !hasRevealed) {
      setHasRevealed(true)
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setRevealed(true)
        setGlitching(false)
        return
      }
      const t = setTimeout(() => {
        setRevealed(true)
        setTimeout(() => {
          setGlitching(true)
          setTimeout(() => setGlitching(false), 700)
        }, 100)
      }, REVEAL_DELAY - 2400)
      return () => clearTimeout(t)
    }
  }, [done, hasRevealed])

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
      {/* Subtle mouse-reactive radial background glow */}
      <div className="hero-radial-glow" aria-hidden="true" />

      {/* Subtle radial vignette centered */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, transparent 20%, var(--ctp-base) 85%)',
        }}
        aria-hidden="true"
      />

      {/* Floating Background Orbs for atmospheric depth */}
      <div className="gradient-orb bg-ctp-mauve/10 w-[280px] h-[280px] top-[10%] left-[15%]" aria-hidden="true" />
      <div className="gradient-orb bg-ctp-blue/10 w-[320px] h-[320px] bottom-[20%] right-[10%] [animation-delay:-6s]" aria-hidden="true" />

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
              className="p-5 font-mono text-sm leading-relaxed min-h-[128px] text-left w-full"
              aria-live="polite"
              aria-label="Terminal boot sequence"
            >
              {BOOT_LINES.map((line, i) => (
                <div key={i} className="mb-1">
                  {displayedLines[i] !== undefined ? (
                    <span
                      style={{
                        color: line.text.includes('ready')
                          ? '#a6e3a1'
                          : line.text.includes('status')
                          ? '#89b4fa'
                          : '#cba6f7',
                      }}
                    >
                      {displayedLines[i]}
                      {i === BOOT_LINES.findIndex((_, idx) => displayedLines[idx] === undefined) - 1 &&
                        displayedLines[i].length < line.text.length && (
                          <span className="terminal-cursor" aria-hidden="true" />
                        )}
                    </span>
                  ) : null}
                </div>
              ))}
              {done && <span className="terminal-cursor" aria-hidden="true" />}
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
