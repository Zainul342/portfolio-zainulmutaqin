'use client'

import { useEffect, useRef, useState } from 'react'
import { MapPin, Coffee } from 'lucide-react'

const LEARNING_ITEMS = [
  { label: 'linux system administration', color: '#a6e3a1' },
  { label: 'python for machine learning', color: '#89b4fa' },
  { label: 'exploring ai/ml concepts', color: '#cba6f7' },
]

const LEARNING_BADGES = [
  { label: 'Linux', color: '#a6e3a1' },
  { label: 'Python', color: '#89b4fa' },
  { label: 'AI/ML', color: '#cba6f7' },
]

function useIntersectionObserver(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

export function AboutSection() {
  const { ref, visible } = useIntersectionObserver()

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-24 px-6"
      aria-label="About"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-12">
          <span className="section-label">// about</span>
          <div className="flex-1 h-px" style={{ backgroundColor: '#313244' }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {/* Left: Bio */}
          <div
            className="transition-all duration-700 min-w-0"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(24px)',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={14} style={{ color: '#cba6f7' }} />
              <span className="font-mono text-xs" style={{ color: '#6c7086' }}>
                Indonesia
              </span>
            </div>

            <h2
              className="text-3xl font-bold mb-6 text-balance"
              style={{ color: '#cdd6f4' }}
            >
              Hey, I&rsquo;m{' '}
              <span style={{ color: '#cba6f7' }}>Zain</span>.
            </h2>

            <p className="leading-relaxed mb-5 text-pretty" style={{ color: '#a6adc8', lineHeight: 1.75 }}>
              I&rsquo;m a full-stack web developer based in Indonesia. I build things for the web,
              tinker with Linux, and slowly falling into the rabbit hole of AI/ML. I care about
              clean code and interfaces that feel intentional.
            </p>

            <p className="leading-relaxed text-pretty" style={{ color: '#a6adc8', lineHeight: 1.75 }}>
              When I&rsquo;m not writing TypeScript or configuring my dotfiles, I&rsquo;m probably
              reading about neural networks or figuring out why my bash script ate my config.
            </p>

            {/* Fun pill */}
            <div className="flex items-center gap-2 mt-6">
              <Coffee size={13} style={{ color: '#f9e2af' }} />
              <span className="font-mono text-xs" style={{ color: '#6c7086' }}>
                fueled by coffee and curiosity
              </span>
            </div>
          </div>

          {/* Right: Currently learning terminal card */}
          <div
            className="transition-all duration-700 delay-150 min-w-0"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(24px)',
            }}
          >
            <div
              className="rounded-lg overflow-hidden h-full"
              style={{
                backgroundColor: '#181825',
                border: '1px solid #313244',
              }}
            >
              {/* Card traffic lights */}
              <div className="traffic-lights">
                <span className="traffic-light" style={{ backgroundColor: '#f38ba8' }} aria-hidden="true" />
                <span className="traffic-light" style={{ backgroundColor: '#f9e2af' }} aria-hidden="true" />
                <span className="traffic-light" style={{ backgroundColor: '#a6e3a1' }} aria-hidden="true" />
                <span className="font-mono text-xs ml-2" style={{ color: '#6c7086' }}>
                  ~/learning
                </span>
              </div>

              <div className="p-5 font-mono text-sm">
                <div className="mb-4" style={{ color: '#cba6f7' }}>
                  ~/learning
                </div>

                {LEARNING_ITEMS.map((item, i) => (
                  <div key={item.label} className="flex items-start gap-2 mb-2">
                    <span style={{ color: '#45475a' }}>
                      {i === LEARNING_ITEMS.length - 1 ? '└──' : '├──'}
                    </span>
                    <span style={{ color: item.color }}>{item.label}</span>
                  </div>
                ))}

                {/* Separator */}
                <div className="mt-6 pt-4" style={{ borderTop: '1px solid #313244' }}>
                  <div className="mb-2 font-mono text-xs" style={{ color: '#6c7086' }}>
                    $ cat currently_learning.txt
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {LEARNING_BADGES.map((badge) => (
                      <span
                        key={badge.label}
                        className="px-2.5 py-0.5 rounded-full font-mono text-xs font-medium"
                        style={{
                          backgroundColor: `color-mix(in srgb, ${badge.color} 15%, transparent)`,
                          color: badge.color,
                          border: `1px solid color-mix(in srgb, ${badge.color} 30%, transparent)`,
                        }}
                      >
                        {badge.label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Blinking cursor */}
                <div className="mt-4 flex items-center gap-1">
                  <span style={{ color: '#a6e3a1' }}>$</span>
                  <span className="terminal-cursor" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
