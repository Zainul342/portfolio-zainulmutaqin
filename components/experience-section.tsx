'use client'

import { useState } from 'react'
import { GitCommit, Calendar, Hash } from 'lucide-react'
import { Reveal } from '@/components/motion-wrapper'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'

interface TimelineEvent {
  commit: string
  date: string
  title: string
  subtitle: string
  details: string[]
}

const EVENTS: TimelineEvent[] = [
  {
    commit: 'a3f7b2e',
    date: '2024 — Present',
    title: 'Full-Stack Developer & Tech Craftsman',
    subtitle: 'Self-Directed / Open-Source',
    details: [
      'Building advanced web applications focusing on clean code, premium DX, and highly intentional UX using React, Next.js, and TypeScript.',
      'Tinkering with Linux kernel setups, shell automation scripts, and custom bspwm/Ghostty configurations.',
      'Venturing into neural networks, AI/ML exploration, and advanced LLM prompt tooling engineering.',
    ],
  },
  {
    commit: '5c9e2b1',
    date: '2023',
    title: 'First Major Launches & Community DX',
    subtitle: 'Indonesian EdTech & Web platforms',
    details: [
      'Launched StudyFlow SNBT Tracker, an Indonesian university entrance exam tracker, helping high schoolers organize and chart prep benchmarks.',
      'Developed CineVault, a highly polished movie tracking library using PHP backends and responsive modular grids.',
      'Contributed custom automation setups and environment helper scripts to Linux dotfile developer communities.',
    ],
  },
  {
    commit: '2d8a4f9',
    date: '2022',
    title: 'The Ignition (First Boot)',
    subtitle: 'Self-Taught Engineering',
    details: [
      'Began self-learning logic, data structures, and standard web technologies (JavaScript, Semantic HTML, CSS).',
      'Configured first bare-metal Linux distribution, triggering a deep fascination with command line workflows, modular setups, and developer efficiency.',
    ],
  },
]

export function ExperienceSection() {
  const { ref } = useIntersectionObserver<HTMLElement>(0.05)
  const [activeCommit, setActiveCommit] = useState<string | null>(null)

  return (
    <section
      id="experience"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative py-24 px-6"
      aria-label="Experience Timeline"
    >
      {/* Background visual grid accents */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(203,166,247,0.015), transparent)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-3xl mx-auto">
        <Reveal delay={0.05} direction="up">
          {/* Section label */}
          <div className="flex items-center gap-3 mb-12">
            <span className="section-label">// experience</span>
            <div className="flex-1 h-px" style={{ backgroundColor: '#313244' }} />
          </div>

          {/* Git Log List */}
          <div className="relative border-l border-[#313244] pl-6 ml-3 space-y-12">
            {EVENTS.map((event, i) => {
              const isHovered = activeCommit === event.commit

              return (
                <div
                  key={event.commit}
                  className="relative group transition-all duration-300"
                  onMouseEnter={() => setActiveCommit(event.commit)}
                  onMouseLeave={() => setActiveCommit(null)}
                >
                  {/* Glowing Git node */}
                  <div
                    className="absolute -left-[35px] top-1.5 w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300"
                    style={{
                      backgroundColor: isHovered ? '#1e1e2e' : '#11111b',
                      borderColor: isHovered ? '#cba6f7' : '#313244',
                      boxShadow: isHovered ? '0 0 12px rgba(203,166,247,0.4)' : 'none',
                    }}
                  >
                    <GitCommit
                      size={12}
                      style={{
                        color: isHovered ? '#cba6f7' : '#6c7086',
                      }}
                    />
                  </div>

                  <Reveal delay={0.1 * i} direction="up">
                    <div
                      className="p-6 rounded-xl border transition-all duration-300"
                      style={{
                        backgroundColor: '#181825',
                        borderColor: isHovered ? '#cba6f7' : '#313244',
                        boxShadow: isHovered ? '0 8px 30px rgba(203,166,247,0.03)' : 'none',
                        transform: isHovered ? 'translateX(4px)' : 'none',
                      }}
                    >
                      {/* Git log format lines */}
                      <div className="font-mono text-xs space-y-1 mb-4 border-b border-[#313244] pb-3 text-[#6c7086]">
                        <div className="flex items-center gap-2">
                          <span style={{ color: '#f38ba8' }}>commit</span>
                          <span style={{ color: '#cba6f7' }} className="font-bold">
                            {event.commit}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>Author:</span>
                          <span style={{ color: '#cdd6f4' }}>Zainul Mutaqin &lt;akuzainul176@gmail.com&gt;</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={11} />
                          <span>Date:</span>
                          <span style={{ color: '#a6e3a1' }}>{event.date}</span>
                        </div>
                      </div>

                      {/* Commit Message details */}
                      <div>
                        <h4 className="text-base font-bold text-[#cdd6f4] mb-1">
                          {event.title}
                        </h4>
                        <div className="font-mono text-xs text-[#89b4fa] mb-4">
                          {event.subtitle}
                        </div>

                        <ul className="space-y-2.5">
                          {event.details.map((detail, idx) => (
                            <li key={idx} className="text-xs leading-relaxed text-[#a6adc8] flex items-start gap-2">
                              <span style={{ color: '#45475a' }} className="font-mono mt-0.5 select-none">
                                {idx + 1}.
                              </span>
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Reveal>
                </div>
              )
            })}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
