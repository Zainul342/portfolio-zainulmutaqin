'use client'

import { useEffect, useRef, useState } from 'react'

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
      { label: 'Next.js' },
      { label: 'Svelte', color: '#f38ba8' },
      { label: 'PHP' },
      { label: 'Node.js', color: '#a6e3a1' },
      { label: 'Tailwind CSS', color: '#89b4fa' },
    ],
  },
  {
    category: 'tools',
    skills: [
      { label: 'Git', color: '#f38ba8' },
      { label: 'Linux', color: '#a6e3a1' },
      { label: 'Vercel' },
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

function SkillTag({ label, color, index }: { label: string; color?: string; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <span
      className="inline-flex items-center px-3 py-1.5 rounded-md font-mono text-xs font-medium transition-all duration-200 cursor-none"
      style={{
        backgroundColor: hovered
          ? color
            ? `color-mix(in srgb, ${color} 20%, #313244)`
            : '#45475a'
          : '#313244',
        color: hovered ? (color ?? '#cdd6f4') : '#a6adc8',
        border: `1px solid ${hovered ? (color ?? '#45475a') : '#45475a'}`,
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovered && color ? `0 4px 12px color-mix(in srgb, ${color} 20%, transparent)` : 'none',
        transitionDelay: `${index * 20}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
    </span>
  )
}

function useIntersectionObserver(threshold = 0.15) {
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

export function SkillsSection() {
  const { ref, visible } = useIntersectionObserver()

  return (
    <section
      id="skills"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative py-24 px-6"
      aria-label="Skills"
    >
      {/* Subtle surface background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(49,50,68,0.2), transparent)',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-5xl mx-auto">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-12">
          <span className="section-label">// skills</span>
          <div className="flex-1 h-px" style={{ backgroundColor: '#313244' }} />
        </div>

        <div className="space-y-10">
          {SKILL_GROUPS.map((group, groupIndex) => (
            <div
              key={group.category}
              className="transition-all duration-700 min-w-0"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(20px)',
                transitionDelay: `${groupIndex * 120}ms`,
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="font-mono text-xs uppercase tracking-wider"
                  style={{ color: '#6c7086' }}
                >
                  {group.category === 'learning' ? (
                    <>
                      <span style={{ color: '#a6e3a1' }}>learning</span>{' '}
                      <span style={{ color: '#6c7086' }}>// currently</span>
                    </>
                  ) : (
                    group.category
                  )}
                </span>
                <div className="h-px w-8" style={{ backgroundColor: '#313244' }} />
              </div>

              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill, skillIndex) => (
                  <SkillTag
                    key={skill.label}
                    label={skill.label}
                    color={group.category === 'learning' ? skill.color : skill.color}
                    index={skillIndex}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
