'use client'

import { useEffect, useRef, useState } from 'react'
import { Github, ExternalLink } from 'lucide-react'

interface Project {
  id: string
  name: string
  description: string
  stack: { label: string; color?: string }[]
  github?: string
  demo?: string
  featured?: boolean
  accentColor: string
}

const PROJECTS: Project[] = [
  {
    id: 'domcy-coffee',
    name: 'domcy-coffee',
    description: 'A full-stack coffee shop website with modern UI and seamless user experience.',
    stack: [
      { label: 'TypeScript', color: '#89b4fa' },
      { label: 'Next.js' },
      { label: 'Tailwind', color: '#89dceb' },
    ],
    github: 'https://github.com/Zainul342',
    demo: 'https://domcy-coffee.vercel.app',
    featured: true,
    accentColor: '#f9e2af',
  },
  {
    id: 'cinevault',
    name: 'CineVault',
    description: 'Premium movie streaming dashboard with PHP backend, rich catalog and smooth DX.',
    stack: [
      { label: 'PHP', color: '#cba6f7' },
      { label: 'JavaScript', color: '#f9e2af' },
      { label: 'CSS' },
    ],
    github: 'https://github.com/Zainul342',
    accentColor: '#cba6f7',
  },
  {
    id: 'weather-dashboard',
    name: 'Weather Dashboard',
    description: 'Real-time weather application with clean API integration and responsive interface.',
    stack: [
      { label: 'JavaScript', color: '#f9e2af' },
      { label: 'REST API', color: '#89b4fa' },
    ],
    github: 'https://github.com/Zainul342',
    accentColor: '#89b4fa',
  },
  {
    id: 'studyflow',
    name: 'StudyFlow SNBT Tracker',
    description: 'Study progress tracker for Indonesian university entrance exam. Built with care for students.',
    stack: [
      { label: 'TypeScript', color: '#89b4fa' },
      { label: 'React', color: '#89dceb' },
    ],
    github: 'https://github.com/Zainul342',
    demo: 'https://snbtflow.vercel.app',
    accentColor: '#a6e3a1',
  },
  {
    id: 'ai-context-pro',
    name: 'AI Context Pro',
    description: 'AI context management tool for more effective prompting and session handling.',
    stack: [
      { label: 'TypeScript', color: '#89b4fa' },
      { label: 'AI', color: '#cba6f7' },
    ],
    github: 'https://github.com/Zainul342',
    accentColor: '#cba6f7',
  },
  {
    id: 'diskdiet',
    name: 'DiskDiet',
    description: 'Lightweight disk cleanup utility for Linux. Terminal-first, minimal footprint.',
    stack: [
      { label: 'Svelte', color: '#f38ba8' },
      { label: 'Linux', color: '#a6e3a1' },
    ],
    github: 'https://github.com/Zainul342',
    accentColor: '#a6e3a1',
  },
]

function ProjectCard({ project, index, visible }: { project: Project; index: number; visible: boolean }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="relative rounded-lg overflow-hidden flex flex-col transition-all duration-300 cursor-none"
      style={{
        backgroundColor: '#181825',
        border: `1px solid ${hovered ? project.accentColor : '#313244'}`,
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered
          ? `0 8px 32px color-mix(in srgb, ${project.accentColor} 20%, transparent)`
          : '0 2px 8px rgba(0,0,0,0.3)',
        opacity: visible ? 1 : 0,
        transitionProperty: 'border-color, transform, box-shadow, opacity',
        transitionDelay: `${index * 80}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Terminal header bar */}
      <div
        className="traffic-lights justify-between"
        style={{ borderBottomColor: hovered ? `color-mix(in srgb, ${project.accentColor} 40%, #313244)` : '#313244' }}
      >
        <div className="flex items-center gap-1.5">
          <span className="traffic-light" style={{ backgroundColor: '#f38ba8' }} aria-hidden="true" />
          <span className="traffic-light" style={{ backgroundColor: '#f9e2af' }} aria-hidden="true" />
          <span className="traffic-light" style={{ backgroundColor: '#a6e3a1' }} aria-hidden="true" />
        </div>

        <div className="flex items-center gap-2">
          {project.featured && (
            <span
              className="font-mono text-[10px] px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: `color-mix(in srgb, ${project.accentColor} 15%, transparent)`,
                color: project.accentColor,
                border: `1px solid color-mix(in srgb, ${project.accentColor} 30%, transparent)`,
              }}
            >
              featured
            </span>
          )}
          <span className="font-mono text-[10px]" style={{ color: '#45475a' }}>
            ~/{project.id}
          </span>
        </div>
      </div>

      {/* Card content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-3">
          <h3
            className="font-mono text-base font-semibold transition-colors duration-200"
            style={{ color: hovered ? project.accentColor : '#cdd6f4' }}
          >
            {project.name}
          </h3>
        </div>

        <p
          className="text-sm leading-relaxed mb-5 flex-1 text-pretty"
          style={{ color: '#a6adc8', lineHeight: 1.6 }}
        >
          {project.description}
        </p>

        {/* Stack tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.stack.map((s) => (
            <span
              key={s.label}
              className="font-mono text-[11px] px-2 py-0.5 rounded"
              style={{
                backgroundColor: s.color
                  ? `color-mix(in srgb, ${s.color} 12%, #313244)`
                  : '#313244',
                color: s.color ?? '#a6adc8',
              }}
            >
              {s.label}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid #313244' }}>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-mono text-xs transition-colors duration-150 cursor-none"
              style={{ color: '#6c7086' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#cdd6f4' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#6c7086' }}
              aria-label={`View ${project.name} on GitHub`}
            >
              <Github size={13} />
              code
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-mono text-xs transition-colors duration-150 cursor-none"
              style={{ color: project.accentColor }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.75' }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
              aria-label={`View ${project.name} live demo`}
            >
              <ExternalLink size={13} />
              live demo
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

function useIntersectionObserver(threshold = 0.1) {
  const ref = useRef<HTMLElement>(null)
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

export function ProjectsSection() {
  const { ref, visible } = useIntersectionObserver()

  return (
    <section
      id="projects"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative py-24 px-6"
      aria-label="Projects"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-4">
          <span className="section-label">// projects</span>
          <div className="flex-1 h-px" style={{ backgroundColor: '#313244' }} />
        </div>

        <p className="font-mono text-xs mb-10" style={{ color: '#6c7086' }}>
          things I&apos;ve built — some shipped, some experiments, all intentional
        </p>

        {/* Project grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} visible={visible} />
          ))}
        </div>

        {/* GitHub CTA */}
        <div
          className="mt-10 flex justify-center transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transitionDelay: '500ms' }}
        >
          <a
            href="https://github.com/Zainul342"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-mono text-xs transition-colors duration-150 cursor-none"
            style={{ color: '#6c7086' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#cba6f7' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#6c7086' }}
          >
            <Github size={14} />
            more on github.com/Zainul342
          </a>
        </div>
      </div>
    </section>
  )
}
