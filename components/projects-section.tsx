'use client'

import { useRef, useState } from 'react'
import { Github, ExternalLink, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { Reveal } from '@/components/motion-wrapper'
import { PROJECTS, Project } from '@/lib/projects'

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    
    // Max 8 degrees tilt angle
    const rotX = -(y / (rect.height / 2)) * 6
    const rotY = (x / (rect.width / 2)) * 6
    setTilt({ x: rotX, y: rotY })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
    setHovered(false)
  }

  const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-xl overflow-hidden flex flex-col transition-all duration-300 cursor-none select-none ${
        project.featured ? 'md:col-span-2 lg:col-span-2' : 'col-span-1'
      }`}
      style={{
        backgroundColor: '#181825',
        border: `1px solid ${hovered ? project.accentColor : '#313244'}`,
        transform: hovered && !isReducedMotion
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-4px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)',
        boxShadow: hovered
          ? `0 12px 30px color-mix(in srgb, ${project.accentColor} 12%, transparent)`
          : '0 4px 12px rgba(0,0,0,0.2)',
      }}
    >
      {/* ── Decorative Cyber Header ────────────────────────────────────────── */}
      <div 
        className="h-28 w-full relative overflow-hidden transition-all duration-300 flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, color-mix(in srgb, ${project.accentColor} 14%, #181825) 0%, color-mix(in srgb, ${project.accentColor} 3%, #11111b) 100%)`
        }}
      >
        <div className="absolute inset-0 opacity-15 flex items-center justify-center font-mono text-[76px] font-extrabold tracking-widest text-[#45475a]">
          {project.name.slice(0, 4).toUpperCase()}
        </div>
        <div className="absolute bottom-3 left-4 flex gap-1.5">
          {project.stack.slice(0, 2).map((s) => (
            <span 
              key={s.label} 
              className="text-[9px] font-mono px-2 py-0.5 rounded border border-[#313244] shadow-sm" 
              style={{ color: s.color ?? '#a6adc8', backgroundColor: 'rgba(24, 24, 37, 0.85)' }}
            >
              {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* Terminal traffic light bar */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b border-[#313244]"
        style={{ 
          backgroundColor: '#11111b',
          borderBottomColor: hovered ? `color-mix(in srgb, ${project.accentColor} 30%, #313244)` : '#313244' 
        }}
      >
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#f38ba8' }} aria-hidden="true" />
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#f9e2af' }} aria-hidden="true" />
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#a6e3a1' }} aria-hidden="true" />
        </div>

        <div className="flex items-center gap-2">
          {project.featured && (
            <span
              className="font-mono text-[8px] tracking-wide uppercase px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: 'rgba(249, 226, 175, 0.08)',
                color: '#f9e2af',
                border: '1px solid rgba(249, 226, 175, 0.25)',
              }}
            >
              featured
            </span>
          )}
          <span className="font-mono text-[9px] text-[#45475a]">
            ~/{project.id}
          </span>
        </div>
      </div>

      {/* Card content */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <h3
            className="font-mono text-base font-bold transition-colors duration-200 mb-2"
            style={{ color: hovered ? project.accentColor : '#cdd6f4' }}
          >
            <Link href={`/projects/${project.slug}`} className="hover:underline flex items-center gap-1 cursor-none">
              {project.name}
              <ArrowRight size={13} className={`transform transition-transform ${hovered ? 'translate-x-1' : ''}`} />
            </Link>
          </h3>

          <p className="text-xs leading-relaxed text-[#a6adc8] mb-4" style={{ lineHeight: 1.65 }}>
            {project.description}
          </p>

          {project.fieldNote && (
            <div 
              className="mb-5 rounded-md border border-[#313244] bg-[#11111b] p-3 font-mono text-[9px] text-[#6c7086] transition-opacity duration-300 flex flex-col gap-1.5"
              style={{ opacity: hovered ? 1 : 0.7 }}
            >
              <div className="flex"><span className="w-12 shrink-0" style={{ color: project.accentColor }}>terrain</span> <span className="text-[#a6adc8]">{project.fieldNote.terrain}</span></div>
              <div className="flex"><span className="w-12 shrink-0" style={{ color: project.accentColor }}>route</span> <span className="text-[#a6adc8]">{project.fieldNote.route}</span></div>
              <div className="flex"><span className="w-12 shrink-0" style={{ color: project.accentColor }}>signal</span> <span className="text-[#a6adc8]">{project.fieldNote.signal}</span></div>
            </div>
          )}
        </div>

        <div>
          {/* Stack tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.stack.map((s) => (
              <span
                key={s.label}
                className="font-mono text-[9px] px-2 py-0.5 rounded border border-[#313244]"
                style={{
                  backgroundColor: '#11111b',
                  color: s.color ?? '#a6adc8',
                }}
              >
                {s.label}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex items-center gap-4 pt-3.5 border-t border-[#313244]">
            <Link
              href={`/projects/${project.slug}`}
              className="flex items-center gap-1.5 font-mono text-[10px] text-[#cba6f7] transition-all duration-150 cursor-none"
              onMouseEnter={(e) => { e.currentTarget.style.color = '#d4b5f8'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#cba6f7'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              case study
            </Link>

            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-mono text-[10px] text-[#6c7086] transition-colors duration-150 cursor-none"
                onMouseEnter={(e) => { e.currentTarget.style.color = '#cdd6f4' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#6c7086' }}
                aria-label={`View ${project.name} on GitHub`}
              >
                <Github size={12} />
                code
              </a>
            )}

            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-mono text-[10px] transition-opacity duration-150 cursor-none"
                style={{ color: project.accentColor }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.75' }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
                aria-label={`View ${project.name} live demo`}
              >
                <ExternalLink size={12} />
                live demo
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProjectsSection() {
  const { ref } = useIntersectionObserver<HTMLElement>(0.05)

  return (
    <section
      id="projects"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative py-24 px-6"
      aria-label="Projects"
    >
      <div className="max-w-5xl mx-auto">
        <Reveal delay={0.05} direction="up">
          {/* Section label */}
          <div className="flex items-center gap-3 mb-4">
            <span className="section-label">// projects</span>
            <div className="flex-1 h-px" style={{ backgroundColor: '#313244' }} />
          </div>

          <p className="font-mono text-xs mb-10 text-[#6c7086]">
            field notes from things I&apos;ve built, tested, broken, and refined
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
              className="flex items-center gap-2 font-mono text-xs text-[#6c7086] transition-colors duration-150 cursor-none"
              onMouseEnter={(e) => { e.currentTarget.style.color = '#cba6f7' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#6c7086' }}
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
