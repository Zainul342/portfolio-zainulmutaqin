'use client'

import { useEffect, useState } from 'react'
import { MapPin, Coffee, Cpu, Clock, Compass } from 'lucide-react'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { Reveal } from '@/components/motion-wrapper'

interface Skill {
  label: string
}

interface SkillGroup {
  category: string
  skills: Skill[]
}

const SKILL_GROUPS: SkillGroup[] = [
  {
    category: 'web',
    skills: [
      { label: 'TypeScript' },
      { label: 'JavaScript' },
      { label: 'React' },
      { label: 'Next.js' },
      { label: 'Svelte' },
      { label: 'PHP' },
      { label: 'Node.js' },
      { label: 'Tailwind CSS' },
    ],
  },
  {
    category: 'tools',
    skills: [
      { label: 'Git' },
      { label: 'Linux' },
      { label: 'Vercel' },
      { label: 'Firebase' },
    ],
  },
  {
    category: 'learning',
    skills: [
      { label: 'Python' },
      { label: 'AI/ML' },
      { label: 'Go' },
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

// ─── Reusable Neovim Editor Buffer Wrapper ───────────────────────────────────
interface NeovimBufferProps {
  filename: string
  linesCount?: number
  accentColor?: string
  hoverMode?: 'INSERT' | 'VISUAL'
  children: React.ReactNode
  className?: string
}

function NeovimBuffer({
  filename,
  linesCount = 8,
  accentColor = '#cba6f7',
  hoverMode = 'INSERT',
  children,
  className = '',
}: NeovimBufferProps) {
  const [hovered, setHovered] = useState(false)
  const lineNumbers = Array.from({ length: linesCount }, (_, i) => i + 1)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative rounded-[3px] border overflow-hidden flex flex-col transition-all duration-200 select-none bg-black/45 backdrop-blur-md min-h-[170px] ${className}`}
      style={{
        borderColor: hovered ? accentColor : '#313244',
        boxShadow: hovered ? '0 4px 20px rgba(0, 0, 0, 0.4)' : 'none',
      }}
    >
      {/* Tabline / Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#0a0a0c]/80 border-b border-white/5 font-mono text-[9px] text-[#585b70]">
        <div className="flex items-center gap-1.5">
          <span style={{ color: hovered ? accentColor : '#585b70' }}></span>
          <span>{filename}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>[unix]</span>
          <span>utf-8</span>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="flex flex-grow relative">
        {/* Line Gutter */}
        <div className="flex flex-col items-end pr-2.5 pl-2 py-4 select-none font-mono text-[10px] text-[#313244] border-r border-white/5 bg-[#0a0a0c]/20 w-8">
          {lineNumbers.map((num) => (
            <span key={num} className="leading-6">{num}</span>
          ))}
        </div>

        {/* Content Pane */}
        <div className="flex-grow p-4 pl-3 flex flex-col justify-between text-left">
          {children}
        </div>
      </div>

      {/* Lualine Status Bar */}
      <div className="flex items-center justify-between font-mono text-[9px] bg-[#0f0f14] text-[#a6adc8] border-t border-white/5 h-5 select-none">
        <div className="flex items-center h-full">
          {/* Mode indicator */}
          <div
            className="px-2 h-full flex items-center font-bold text-[#1e1e2e] transition-colors duration-150"
            style={{
              backgroundColor: hovered
                ? hoverMode === 'INSERT' ? '#89b4fa' : '#fab387'
                : '#a6e3a1',
            }}
          >
            {hovered ? hoverMode : 'NORMAL'}
          </div>
          {/* Git status */}
          <div className="px-2 bg-white/5 h-full flex items-center gap-1 text-[#cdd6f4]">
            <span></span>
            <span>main</span>
          </div>
          {/* Filename status */}
          <div className="px-2 text-[#585b70] hidden sm:block max-w-[80px] truncate">
            {filename}
          </div>
        </div>

        <div className="flex items-center h-full">
          {/* File format */}
          <div className="px-2 text-[#585b70] hidden xs:block">
            utf-8
          </div>
          {/* Position indicator */}
          <div
            className="px-2 h-full flex items-center font-bold text-[#1e1e2e]"
            style={{
              backgroundColor: hovered ? accentColor : '#585b70',
            }}
          >
            {hovered ? 'INSERT' : '100%'}
          </div>
        </div>
      </div>
    </div>
  )
}

export function BentoSection() {
  const { ref } = useIntersectionObserver<HTMLElement>(0.1)
  const [time, setTime] = useState('')

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
      className="relative py-28 md:py-36 px-6 overflow-hidden"
      aria-label="About and Skills Mosaic"
    >
      <div className="relative max-w-5xl mx-auto">
        <Reveal delay={0.05} direction="up">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[minmax(150px,auto)]">
            
            {/* ── 👋 BIO CARD (Spans 2 columns, 2 rows) ────────────────────────── */}
            <NeovimBuffer
              filename="bio.lua"
              linesCount={13}
              accentColor="#cba6f7"
              hoverMode="INSERT"
              className="md:col-span-2 md:row-span-2"
            >
              <div className="flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin size={13} style={{ color: '#cba6f7' }} />
                    <span className="font-mono text-xs text-[#585b70]">Jakarta, Indonesia</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[#cdd6f4]">
                    Hey, I&rsquo;m <span style={{ color: '#cba6f7' }}>Zainul Mutaqin</span>.
                  </h3>
                  <p className="text-xs leading-relaxed text-[#a6adc8] mb-3" style={{ lineHeight: 1.6 }}>
                    I&rsquo;m a full-stack web developer based in Jakarta, Indonesia. I build things for the web,
                    tinker with Linux, and fall deeply into the rabbit hole of AI/ML. I care about
                    clean code and interfaces that feel clean, premium, and highly intentional.
                  </p>
                  <p className="text-xs leading-relaxed text-[#a6adc8]" style={{ lineHeight: 1.6 }}>
                    When I&rsquo;m not writing TypeScript or configuring my terminal, I&rsquo;m probably
                    reading about neural networks or figuring out why my bash script ate my config.
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/5 font-mono text-[10px] text-[#585b70]">
                  <Coffee size={12} style={{ color: '#f9e2af' }} />
                  <span>fueled by coffee and curiosity</span>
                </div>
              </div>
            </NeovimBuffer>

            {/* ── 🖥️ TERMINAL LEARNING CARD (Spans 1 column, 2 rows) ────────────── */}
            <NeovimBuffer
              filename="learning.lua"
              linesCount={13}
              accentColor="#fab387"
              hoverMode="VISUAL"
              className="md:col-span-1 md:row-span-2"
            >
              <div className="font-mono text-[11px] flex-grow flex flex-col justify-between h-full">
                <div>
                  <div className="mb-3 text-[#cba6f7] select-none">~/learning</div>
                  {LEARNING_ITEMS.map((item, i) => (
                    <div key={item.label} className="flex items-start gap-1.5 mb-2.5 text-[#a6adc8]">
                      <span className="text-[#313244] select-none">
                        {i === LEARNING_ITEMS.length - 1 ? '└──' : '├──'}
                      </span>
                      <span style={{ color: item.color }}>{item.label}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 select-none">
                  <div className="mb-2 text-[9px] text-[#585b70]">$ cat currently_learning</div>
                  <div className="flex flex-wrap gap-1">
                    {LEARNING_BADGES.map((badge) => (
                      <span
                        key={badge.label}
                        className="px-1.5 py-0.5 rounded-[2px] text-[9px] font-mono font-medium bg-white/[0.02] border border-white/5"
                        style={{ color: badge.color }}
                      >
                        {badge.label}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-1">
                    <span className="text-[#a6e3a1]">$</span>
                    <span className="inline-block w-[6px] h-[10px] bg-[#a6e3a1]" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </NeovimBuffer>

            {/* ── 📍 LOCATION & TIME CARD (Spans 1 column, 1 row) ──────────────── */}
            <NeovimBuffer
              filename="location.json"
              linesCount={6}
              accentColor="#89b4fa"
              hoverMode="INSERT"
            >
              <div className="flex flex-col justify-between h-full font-mono">
                <div className="text-[10px] text-[#585b70] uppercase tracking-wider">GMT+7 TIME</div>
                <div>
                  <div className="text-lg font-bold text-[#cdd6f4] tracking-tight">{time || '12:00:00'}</div>
                  <div className="text-[10px] text-[#a6adc8] mt-0.5">Jakarta, ID</div>
                </div>
                <div className="text-[9px] text-[#585b70] border-t border-white/5 pt-2">
                  6.2088° S, 106.8456° E
                </div>
              </div>
            </NeovimBuffer>

            {/* ── 💻 SETUP SPEC CARD (Spans 1 column, 1 row) ───────────────────── */}
            <NeovimBuffer
              filename="setup.json"
              linesCount={6}
              accentColor="#f9e2af"
              hoverMode="VISUAL"
            >
              <div className="flex flex-col justify-between h-full">
                <div className="flex items-center justify-between font-mono text-[9px] text-[#585b70]">
                  <span>SYSTEM SPEC</span>
                  <Cpu size={12} style={{ color: '#f9e2af' }} />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#cdd6f4]">ThinkPad T490s</div>
                  <div className="text-[10px] text-[#a6adc8] font-mono mt-0.5">EndeavourOS (bspwm)</div>
                </div>
                <div className="font-mono text-[9px] text-[#585b70] border-t border-white/5 pt-2">
                  Ghostty + Neovim Zen
                </div>
              </div>
            </NeovimBuffer>

            {/* ── 🌐 WEB SKILLS CARD (Spans 1 column, 1 row) ───────────────────── */}
            <NeovimBuffer
              filename="web_dev.json"
              linesCount={6}
              accentColor="#89dceb"
              hoverMode="INSERT"
            >
              <div className="flex flex-col justify-between h-full">
                <div className="font-mono text-[9px] text-[#585b70] uppercase tracking-wider mb-2">
                  web <span className="text-[#89dceb]">// dev</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {SKILL_GROUPS[0].skills.map((skill) => (
                    <span
                      key={skill.label}
                      className="px-1.5 py-0.5 rounded-[2px] text-[9px] font-mono text-[#a6adc8] border border-white/5 bg-white/[0.01]"
                    >
                      {skill.label}
                    </span>
                  ))}
                </div>
              </div>
            </NeovimBuffer>

            {/* ── 🛠️ TOOLS SKILLS CARD (Spans 1 column, 1 row) ──────────────────── */}
            <NeovimBuffer
              filename="workflow.json"
              linesCount={6}
              accentColor="#f38ba8"
              hoverMode="INSERT"
            >
              <div className="flex flex-col justify-between h-full">
                <div className="font-mono text-[9px] text-[#585b70] uppercase tracking-wider mb-2">
                  tools <span className="text-[#f38ba8]">// flow</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {SKILL_GROUPS[1].skills.map((skill) => (
                    <span
                      key={skill.label}
                      className="px-1.5 py-0.5 rounded-[2px] text-[9px] font-mono text-[#a6adc8] border border-white/5 bg-white/[0.01]"
                    >
                      {skill.label}
                    </span>
                  ))}
                </div>
              </div>
            </NeovimBuffer>

            {/* ── 📚 LEARNING SKILLS CARD (Spans 1 column, 1 row) ───────────────── */}
            <NeovimBuffer
              filename="future.json"
              linesCount={6}
              accentColor="#cba6f7"
              hoverMode="VISUAL"
            >
              <div className="flex flex-col justify-between h-full">
                <div className="font-mono text-[9px] text-[#585b70] uppercase tracking-wider mb-2">
                  studying <span className="text-[#cba6f7]">// next</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {SKILL_GROUPS[2].skills.map((skill) => (
                    <span
                      key={skill.label}
                      className="px-1.5 py-0.5 rounded-[2px] text-[9px] font-mono text-[#a6adc8] border border-white/5 bg-white/[0.01]"
                    >
                      {skill.label}
                    </span>
                  ))}
                </div>
              </div>
            </NeovimBuffer>

            {/* ── 🎯 PERSONAL ATLAS CARD (Spans 1 column, 1 row) ───────────────────── */}
            <NeovimBuffer
              filename="index_tree.txt"
              linesCount={6}
              accentColor="#94e2d5"
              hoverMode="INSERT"
            >
              <div className="flex flex-col justify-between h-full">
                <div className="flex items-center justify-between font-mono text-[9px] text-[#585b70]">
                  <span>PORTFOLIO TREE</span>
                  <Compass size={12} style={{ color: '#94e2d5' }} />
                </div>
                <div className="font-mono text-[9px] my-1 leading-tight space-y-0.5" style={{ color: '#cdd6f4' }}>
                  <div>.</div>
                  <div>├── <span className="text-[#cba6f7]">profile</span>/</div>
                  <div>├── <span className="text-[#89b4fa]">experience</span>/</div>
                  <div>├── <span className="text-[#a6e3a1]">projects</span>/</div>
                  <div>└── <span className="text-[#74c7ec]">status</span>.json</div>
                </div>
                <div className="font-mono text-[9px] text-[#585b70] border-t border-white/5 pt-2">
                  Flat index layout
                </div>
              </div>
            </NeovimBuffer>

          </div>
        </Reveal>
      </div>
    </section>
  )
}
