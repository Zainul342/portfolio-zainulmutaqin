'use client'

import { useState } from 'react'
import { Github, ExternalLink, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { Reveal } from '@/components/motion-wrapper'
import { PROJECTS, Project } from '@/lib/projects'

// ─── Reusable Neovim Editor Buffer Wrapper ───────────────────────────────────
interface NeovimBufferProps {
  filename: string
  linesCount?: number
  accentColor?: string
  hoverMode?: 'INSERT' | 'VISUAL'
  children: React.ReactNode
  className?: string
  hovered: boolean
  setHovered: (h: boolean) => void
}

function NeovimBuffer({
  filename,
  linesCount = 10,
  accentColor = '#a6e3a1',
  hoverMode = 'INSERT',
  children,
  className = '',
  hovered,
  setHovered,
}: NeovimBufferProps) {
  const lineNumbers = Array.from({ length: linesCount }, (_, i) => i + 1)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative rounded-[3px] border overflow-hidden flex flex-col transition-all duration-200 select-none bg-black/45 backdrop-blur-md min-h-[300px] ${className}`}
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
          {/* Git branch */}
          <div className="px-2 bg-white/5 h-full flex items-center gap-1 text-[#cdd6f4]">
            <span></span>
            <span>main</span>
          </div>
          {/* Filename status */}
          <div className="px-2 text-[#585b70] hidden sm:block max-w-[120px] truncate">
            {filename}
          </div>
        </div>

        <div className="flex items-center h-full">
          <div className="px-2 text-[#585b70] hidden xs:block">
            utf-8
          </div>
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

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <NeovimBuffer
      filename={`~/projects/${project.id}.json`}
      linesCount={project.featured ? 15 : 12}
      accentColor={project.accentColor || '#a6e3a1'}
      hoverMode="INSERT"
      hovered={hovered}
      setHovered={setHovered}
      className={project.featured ? 'md:col-span-2 lg:col-span-2' : 'col-span-1'}
    >
      <div className="flex flex-col flex-grow justify-between h-full">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
            <span className="font-mono text-[9px] text-[#585b70]">
              ~/{project.id}
            </span>
            {project.featured && (
              <span
                className="font-mono text-[8px] tracking-wide uppercase px-2 py-0.5 rounded-[2px]"
                style={{
                  backgroundColor: 'rgba(249, 226, 175, 0.08)',
                  color: '#f9e2af',
                  border: '1px solid rgba(249, 226, 175, 0.25)',
                }}
              >
                featured
              </span>
            )}
          </div>

          <h3
            className="font-mono text-base font-bold transition-colors duration-200 mb-2"
            style={{ color: hovered ? '#ffffff' : '#cdd6f4' }}
          >
            <Link href={`/projects/${project.slug}`} className="hover:underline flex items-center gap-1 cursor-none">
              {project.name}
              <ArrowRight size={13} className={`transform transition-transform ${hovered ? 'translate-x-1' : ''}`} />
            </Link>
          </h3>

          <p className="text-xs leading-relaxed text-[#a6adc8] mb-4" style={{ lineHeight: 1.6 }}>
            {project.description}
          </p>

          {/* Field Note HUD block (expanded on hover) */}
          {project.fieldNote && (
            <div 
              className={`font-mono text-[9px] border border-dashed rounded-[2px] p-2.5 mb-4 bg-white/[0.01] overflow-hidden transition-all duration-300 ${
                hovered ? 'max-h-24 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-1 pointer-events-none'
              }`}
              style={{ 
                borderColor: hovered ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                color: '#a6adc8'
              }}
            >
              <div className="flex justify-between border-b border-white/5 pb-1 mb-1 font-bold" style={{ color: project.accentColor }}>
                <span>PROJECT INFO // TRACER</span>
                <span>STATUS: ACTIVE</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex justify-between">
                  <span style={{ color: '#585b70' }}>CORE ARCH:</span>
                  <span style={{ color: '#cdd6f4' }}>{project.fieldNote.terrain}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#585b70' }}>PRIMARY DEPLOY:</span>
                  <span style={{ color: '#cdd6f4' }}>{project.fieldNote.route}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#585b70' }}>SYSTEM STATUS:</span>
                  <span style={{ color: project.accentColor }}>{project.fieldNote.signal}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          {/* Stack tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.stack.map((s) => (
              <span
                key={s.label}
                className="font-mono text-[9px] px-1.5 py-0.5 rounded-[2px] border border-white/5 bg-white/[0.01]"
                style={{ color: s.color ?? '#a6adc8' }}
              >
                {s.label}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex items-center gap-4 pt-3 border-t border-white/5 font-mono text-[10px]">
            <Link
              href={`/projects/${project.slug}`}
              className="flex items-center gap-1.5 text-[#cba6f7] transition-all duration-150 cursor-none"
              onMouseEnter={(e) => { e.currentTarget.style.color = '#d4b5f8'; e.currentTarget.style.transform = 'translateY(-0.5px)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#cba6f7'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              case study
            </Link>

            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[#585b70] transition-colors duration-150 cursor-none"
                onMouseEnter={(e) => { e.currentTarget.style.color = '#cdd6f4' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#585b70' }}
                aria-label={`View ${project.name} on GitHub`}
              >
                <Github size={11} />
                code
              </a>
            )}

            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 transition-opacity duration-150 cursor-none"
                style={{ color: project.accentColor }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.75' }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
                aria-label={`View ${project.name} live demo`}
              >
                <ExternalLink size={11} />
                live demo
              </a>
            )}
          </div>
        </div>
      </div>
    </NeovimBuffer>
  )
}

export function ProjectsSection() {
  const { ref } = useIntersectionObserver<HTMLElement>(0.05)

  return (
    <section
      id="projects"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative py-28 md:py-36 px-6"
      aria-label="Projects"
    >
      <div className="max-w-5xl mx-auto">
        <Reveal delay={0.05} direction="up">
          {/* Section label */}
          <div className="flex items-center gap-3 mb-4">
            <span className="section-label">// fieldwork</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <p className="font-mono text-xs mb-10 text-[#585b70]">
            field notes from systems and applications I&apos;ve mapped, built, and refined
          </p>

          {/* Project grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PROJECTS.map((project, i) => (
              <Reveal key={project.id} delay={0.05 * i} direction="up" width="100%">
                <ProjectCard project={project} index={i} />
              </Reveal>
            ))}
          </div>

          {/* GitHub CTA */}
          <div className="mt-12 flex justify-center">
            <a
              href="https://github.com/Zainul342"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-mono text-xs text-[#585b70] transition-colors duration-150 cursor-none"
              onMouseEnter={(e) => { e.currentTarget.style.color = '#cba6f7' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#585b70' }}
            >
              <Github size={13} />
              more on github.com/Zainul342
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
