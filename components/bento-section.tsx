'use client'

import { useEffect, useState } from 'react'
import { MapPin, Coffee, Terminal, Cpu, Clock, Heart, Award } from 'lucide-react'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { Reveal } from '@/components/motion-wrapper'

interface Skill {
  label: string
  color?: string
}

interface SkillGroup {
  category: string
  skills: Skill[]
}

const SKILL_GROUPS: SkillGroup[] = [
  {
    category: 'web',
    skills: [
      { label: 'TypeScript', color: '#89b4fa' },
      { label: 'JavaScript', color: '#f9e2af' },
      { label: 'React', color: '#89dceb' },
      { label: 'Next.js', color: '#a6e3a1' },
      { label: 'Svelte', color: '#f38ba8' },
      { label: 'PHP', color: '#89b4fa' },
      { label: 'Node.js', color: '#a6e3a1' },
      { label: 'Tailwind CSS', color: '#89b4fa' },
    ],
  },
  {
    category: 'tools',
    skills: [
      { label: 'Git', color: '#f38ba8' },
      { label: 'Linux', color: '#a6e3a1' },
      { label: 'Vercel', color: '#cdd6f4' },
      { label: 'Firebase', color: '#f9e2af' },
    ],
  },
  {
    category: 'learning',
    skills: [
      { label: 'Python', color: '#89b4fa' },
      { label: 'AI/ML', color: '#cba6f7' },
      { label: 'Go', color: '#94e2d5' },
    ],
  },
]

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

export function BentoSection() {
  const { ref, visible } = useIntersectionObserver<HTMLElement>(0.1)
  const [time, setTime] = useState('')
  const [activeCard, setActiveCard] = useState<string | null>(null)

  // Live Jakarta clock
  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }
      setTime(new Intl.DateTimeFormat('en-US', options).format(new Date()))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section
      id="about"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative py-24 px-6 overflow-hidden"
      aria-label="About and Skills Mosaic"
    >
      {/* Background radial gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 70% 30%, rgba(203,166,247,0.03) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-5xl mx-auto">
        <Reveal delay={0.05} direction="up">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[minmax(140px,auto)]">
            
            {/* ── 👋 BIO CARD (Spans 2 columns, 2 rows) ────────────────────────── */}
            <div
              className="md:col-span-2 md:row-span-2 rounded-xl p-6 transition-all duration-300 flex flex-col justify-between"
              style={{
                backgroundColor: '#181825',
                border: `1px solid ${activeCard === 'bio' ? '#cba6f7' : '#313244'}`,
                boxShadow: activeCard === 'bio' ? '0 8px 30px rgba(203, 166, 247, 0.05)' : 'none',
                transform: activeCard === 'bio' ? 'translateY(-2px)' : 'translateY(0)',
              }}
              onMouseEnter={() => setActiveCard('bio')}
              onMouseLeave={() => setActiveCard(null)}
            >
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin size={14} style={{ color: '#cba6f7' }} />
                  <span className="font-mono text-xs text-[#6c7086]">Indonesia</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[#cdd6f4]">
                  Hey, I&rsquo;m <span style={{ color: '#cba6f7' }}>Zainul Mutaqin</span>.
                </h3>
                <p className="text-sm leading-relaxed text-[#a6adc8] mb-4" style={{ lineHeight: 1.7 }}>
                  I&rsquo;m a full-stack web developer based in Jakarta, Indonesia. I build things for the web,
                  tinker with Linux, and fall deeply into the rabbit hole of AI/ML. I care about
                  clean code and interfaces that feel clean, premium, and highly intentional.
                </p>
                <p className="text-sm leading-relaxed text-[#a6adc8]" style={{ lineHeight: 1.7 }}>
                  When I&rsquo;m not writing TypeScript or configuring my terminal, I&rsquo;m probably
                  reading about neural networks or figuring out why my bash script ate my config.
                </p>
              </div>

              <div className="flex items-center gap-2 mt-6 pt-4 border-t border-[#313244]">
                <Coffee size={13} style={{ color: '#f9e2af' }} />
                <span className="font-mono text-xs text-[#6c7086]">fueled by coffee and curiosity</span>
              </div>
            </div>

            {/* ── 🖥️ TERMINAL LEARNING CARD (Spans 1 column, 2 rows) ────────────── */}
            <div
              className="md:col-span-1 md:row-span-2 rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300"
              style={{
                backgroundColor: '#181825',
                border: `1px solid ${activeCard === 'terminal' ? '#a6e3a1' : '#313244'}`,
                boxShadow: activeCard === 'terminal' ? '0 8px 30px rgba(166, 227, 161, 0.05)' : 'none',
                transform: activeCard === 'terminal' ? 'translateY(-2px)' : 'translateY(0)',
              }}
              onMouseEnter={() => setActiveCard('terminal')}
              onMouseLeave={() => setActiveCard(null)}
            >
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#313244]" style={{ backgroundColor: '#11111b' }}>
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#f38ba8' }} />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#f9e2af' }} />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#a6e3a1' }} />
                </div>
                <span className="font-mono text-[10px] text-[#6c7086]">~/learning</span>
              </div>

              <div className="p-5 font-mono text-xs flex-grow flex flex-col justify-between">
                <div>
                  <div className="mb-3 text-[#cba6f7]">~/learning</div>
                  {LEARNING_ITEMS.map((item, i) => (
                    <div key={item.label} className="flex items-start gap-1.5 mb-2 text-[#a6adc8]">
                      <span className="text-[#45475a]">{i === LEARNING_ITEMS.length - 1 ? '└──' : '├──'}</span>
                      <span style={{ color: item.color }}>{item.label}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-[#313244]">
                  <div className="mb-2 text-[10px] text-[#6c7086]">$ cat currently_learning</div>
                  <div className="flex flex-wrap gap-1">
                    {LEARNING_BADGES.map((badge) => (
                      <span
                        key={badge.label}
                        className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium"
                        style={{
                          backgroundColor: 'rgba(203, 166, 247, 0.08)',
                          color: badge.color,
                          border: '1px solid rgba(203, 166, 247, 0.15)',
                        }}
                      >
                        {badge.label}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-1">
                    <span className="text-[#a6e3a1]">$</span>
                    <span className="terminal-cursor" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </div>

            {/* ── 📍 LOCATION & TIME CARD (Spans 1 column, 1 row) ──────────────── */}
            <div
              className="rounded-xl p-5 transition-all duration-300 flex flex-col justify-between"
              style={{
                backgroundColor: '#181825',
                border: `1px solid ${activeCard === 'location' ? '#89b4fa' : '#313244'}`,
                boxShadow: activeCard === 'location' ? '0 8px 30px rgba(137, 180, 250, 0.05)' : 'none',
                transform: activeCard === 'location' ? 'translateY(-2px)' : 'translateY(0)',
              }}
              onMouseEnter={() => setActiveCard('location')}
              onMouseLeave={() => setActiveCard(null)}
            >
              <div className="flex items-center justify-between">
                <Clock size={16} style={{ color: '#89b4fa' }} />
                <span className="font-mono text-[10px] text-[#6c7086]">GMT+7</span>
              </div>
              <div>
                <div className="text-xl font-bold font-mono text-[#cdd6f4] tracking-tight">{time || '12:00:00'}</div>
                <div className="text-[10px] font-mono text-[#a6adc8] mt-1">Jakarta, ID</div>
              </div>
              <div className="font-mono text-[9px] text-[#6c7086] border-t border-[#313244] pt-2 mt-2">
                6.2088° S, 106.8456° E
              </div>
            </div>

            {/* ── 💻 SETUP SPEC CARD (Spans 1 column, 1 row) ───────────────────── */}
            <div
              className="rounded-xl p-5 transition-all duration-300 flex flex-col justify-between"
              style={{
                backgroundColor: '#181825',
                border: `1px solid ${activeCard === 'setup' ? '#f9e2af' : '#313244'}`,
                boxShadow: activeCard === 'setup' ? '0 8px 30px rgba(249, 226, 175, 0.05)' : 'none',
                transform: activeCard === 'setup' ? 'translateY(-2px)' : 'translateY(0)',
              }}
              onMouseEnter={() => setActiveCard('setup')}
              onMouseLeave={() => setActiveCard(null)}
            >
              <div className="flex items-center justify-between">
                <Cpu size={16} style={{ color: '#f9e2af' }} />
                <span className="font-mono text-[9px] text-[#6c7086]">setup</span>
              </div>
              <div>
                <div className="text-[11px] font-bold text-[#cdd6f4]">ThinkPad T490s</div>
                <div className="text-[10px] text-[#a6adc8] font-mono mt-0.5">EndeavourOS (bspwm)</div>
              </div>
              <div className="font-mono text-[9px] text-[#6c7086] border-t border-[#313244] pt-2">
                Ghostty + Neovim Zen
              </div>
            </div>

            {/* ── 🌐 WEB SKILLS CARD (Spans 1 column, 1 row) ───────────────────── */}
            <div
              className="md:col-span-1 rounded-xl p-5 transition-all duration-300 flex flex-col justify-between"
              style={{
                backgroundColor: '#181825',
                border: `1px solid ${activeCard === 'web-skills' ? '#89dceb' : '#313244'}`,
                boxShadow: activeCard === 'web-skills' ? '0 8px 30px rgba(137, 220, 235, 0.05)' : 'none',
                transform: activeCard === 'web-skills' ? 'translateY(-2px)' : 'translateY(0)',
              }}
              onMouseEnter={() => setActiveCard('web-skills')}
              onMouseLeave={() => setActiveCard(null)}
            >
              <div className="font-mono text-xs text-[#6c7086] uppercase tracking-wider mb-2">
                web <span className="text-[#89dceb]">// dev</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {SKILL_GROUPS[0].skills.map((skill) => (
                  <span
                    key={skill.label}
                    className="px-2 py-0.5 rounded text-[10px] font-mono text-[#a6adc8] border border-[#313244]"
                    style={{ backgroundColor: '#11111b' }}
                  >
                    {skill.label}
                  </span>
                ))}
              </div>
            </div>

            {/* ── 🛠️ TOOLS SKILLS CARD (Spans 1 column, 1 row) ──────────────────── */}
            <div
              className="md:col-span-1 rounded-xl p-5 transition-all duration-300 flex flex-col justify-between"
              style={{
                backgroundColor: '#181825',
                border: `1px solid ${activeCard === 'tool-skills' ? '#f38ba8' : '#313244'}`,
                boxShadow: activeCard === 'tool-skills' ? '0 8px 30px rgba(243, 139, 168, 0.05)' : 'none',
                transform: activeCard === 'tool-skills' ? 'translateY(-2px)' : 'translateY(0)',
              }}
              onMouseEnter={() => setActiveCard('tool-skills')}
              onMouseLeave={() => setActiveCard(null)}
            >
              <div className="font-mono text-xs text-[#6c7086] uppercase tracking-wider mb-2">
                tools <span className="text-[#f38ba8]">// workflow</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {SKILL_GROUPS[1].skills.map((skill) => (
                  <span
                    key={skill.label}
                    className="px-2 py-0.5 rounded text-[10px] font-mono text-[#a6adc8] border border-[#313244]"
                    style={{ backgroundColor: '#11111b' }}
                  >
                    {skill.label}
                  </span>
                ))}
              </div>
            </div>

            {/* ── 📚 LEARNING SKILLS CARD (Spans 1 column, 1 row) ───────────────── */}
            <div
              className="md:col-span-1 rounded-xl p-5 transition-all duration-300 flex flex-col justify-between"
              style={{
                backgroundColor: '#181825',
                border: `1px solid ${activeCard === 'learn-skills' ? '#cba6f7' : '#313244'}`,
                boxShadow: activeCard === 'learn-skills' ? '0 8px 30px rgba(203, 166, 247, 0.05)' : 'none',
                transform: activeCard === 'learn-skills' ? 'translateY(-2px)' : 'translateY(0)',
              }}
              onMouseEnter={() => setActiveCard('learn-skills')}
              onMouseLeave={() => setActiveCard(null)}
            >
              <div className="font-mono text-xs text-[#6c7086] uppercase tracking-wider mb-2">
                studying <span className="text-[#cba6f7]">// future</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {SKILL_GROUPS[2].skills.map((skill) => (
                  <span
                    key={skill.label}
                    className="px-2 py-0.5 rounded text-[10px] font-mono text-[#a6adc8] border border-[#313244]"
                    style={{ backgroundColor: '#11111b' }}
                  >
                    {skill.label}
                  </span>
                ))}
              </div>
            </div>

            {/* ── 🎯 EXTRA INFO CARD (Spans 1 column, 1 row) ───────────────────── */}
            <div
              className="rounded-xl p-5 transition-all duration-300 flex flex-col justify-between"
              style={{
                backgroundColor: '#181825',
                border: `1px solid ${activeCard === 'interests' ? '#94e2d5' : '#313244'}`,
                boxShadow: activeCard === 'interests' ? '0 8px 30px rgba(148, 226, 213, 0.05)' : 'none',
                transform: activeCard === 'interests' ? 'translateY(-2px)' : 'translateY(0)',
              }}
              onMouseEnter={() => setActiveCard('interests')}
              onMouseLeave={() => setActiveCard(null)}
            >
              <div className="flex items-center justify-between">
                <Heart size={16} style={{ color: '#94e2d5' }} />
                <span className="font-mono text-[9px] text-[#6c7086]">interests</span>
              </div>
              <div>
                <div className="text-[10px] font-bold text-[#cdd6f4]">Geography & Maps</div>
                <div className="text-[9px] text-[#a6adc8] font-mono mt-0.5">Dotfiles Optimization</div>
              </div>
              <div className="font-mono text-[9px] text-[#6c7086] border-t border-[#313244] pt-2">
                Open Source & Tech Craft
              </div>
            </div>

          </div>
        </Reveal>
      </div>
    </section>
  )
}
