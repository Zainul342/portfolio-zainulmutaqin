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

const systemInfo = [
  { key: "os", value: "EndeavourOS x86_64" },
  { key: "host", value: "Lenovo ThinkPad T490s" },
  { key: "ker", value: "Linux 6.8.9-arch1-1" },
  { key: "wm", value: "bspwm" },
  { key: "term", value: "kitty" },
  { key: "sh", value: "fish" },
  { key: "up", value: "15 hours, 39 mins" },
]

export function HeroSection() {
  const [mounted, setMounted] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [glitching, setGlitching] = useState(false)
  
  const heroRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (revealed) {
      setGlitching(true)
      const t = setTimeout(() => setGlitching(false), 700)
      return () => clearTimeout(t)
    }
  }, [revealed])

  // SSR Skeleton to prevent hydration mismatch and ensure animations run cleanly on client
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="w-full max-w-xl mx-auto bg-[#0a0a0a]/60 backdrop-blur-md border border-white/10 rounded-md h-[210px] animate-pulse" />
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
            className="w-full max-w-xl rounded-md overflow-hidden mb-10 border border-white/10 bg-[#0a0a0a]/60 backdrop-blur-md"
          >
            {/* Minimal Tiling Window Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#121212]/40 border-b border-white/10 select-none font-mono text-[11px] text-[#89b4fa]">
              <div className="w-12 text-left text-[#585b70]">kitty</div>
              <div className="flex-1 text-center text-[#a6adc8]">zainul@thinkpad:~</div>
              <div className="w-12 text-right text-[#585b70]">80x24</div>
            </div>

            {/* Terminal body */}
            <div
              className="p-6 font-mono text-[13px] leading-relaxed min-h-[160px] text-left w-full grid grid-cols-12 gap-6"
              aria-live="polite"
              aria-label="Terminal fetch info"
            >
              {/* Left Column: ASCII Art */}
              <div className="col-span-4 flex flex-col justify-start items-center select-none pt-1">
                <motion.pre
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="font-mono text-xs leading-normal text-[#cba6f7]"
                >
{` (\\_/)
 (o.o)
 (> <)`}
                </motion.pre>
              </div>

              {/* Right Column: System specs */}
              <div className="col-span-8 flex flex-col justify-center space-y-1.5">
                {systemInfo.map((info, idx) => {
                  const delayTime = 0.2 + idx * 0.08
                  const isLastLine = idx === systemInfo.length - 1

                  return (
                    <motion.div
                      key={info.key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: delayTime, ease: "easeOut" }}
                      onAnimationComplete={() => {
                        if (isLastLine) {
                          setRevealed(true)
                        }
                      }}
                      className="flex font-mono text-[12px] leading-tight"
                    >
                      <span className="text-[#cba6f7] min-w-[42px] select-none">{info.key}</span>
                      <span className="text-[#585b70] mr-2 select-none">:</span>
                      <span className="text-[#cdd6f4]">{info.value}</span>
                    </motion.div>
                  )
                })}

                {/* Color blocks fetch visual */}
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + systemInfo.length * 0.08, ease: "easeOut" }}
                  className="flex gap-1 pt-2 select-none"
                >
                  <span className="w-5 h-2.5 bg-[#45475a]" />
                  <span className="w-5 h-2.5 bg-[#f38ba8]" />
                  <span className="w-5 h-2.5 bg-[#a6e3a1]" />
                  <span className="w-5 h-2.5 bg-[#f9e2af]" />
                  <span className="w-5 h-2.5 bg-[#89b4fa]" />
                  <span className="w-5 h-2.5 bg-[#cba6f7]" />
                  <span className="w-5 h-2.5 bg-[#89dceb]" />
                  <span className="w-5 h-2.5 bg-[#cdd6f4]" />
                </motion.div>
              </div>
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
