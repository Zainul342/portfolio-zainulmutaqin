import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Github, ExternalLink, Terminal, Shield, Hammer, Award } from 'lucide-react'
import { getProjectBySlug, PROJECTS } from '@/lib/projects'
import { ClientShell } from '@/components/client-shell'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return PROJECTS.map((project) => ({
    slug: project.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) return {}

  return {
    title: `${project.name} Case Study — Zainul Mutaqin`,
    description: project.description,
    openGraph: {
      title: `${project.name} Case Study — Zainul Mutaqin`,
      description: project.description,
      url: `https://zainulmutaqin.com/projects/${project.slug}`,
      images: '/opengraph-image',
    },
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  return (
    <ClientShell>
      <main className="min-h-screen py-24 px-6 relative overflow-hidden">
        {/* Decorative background visual elements */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 80% 20%, color-mix(in srgb, ${project.accentColor} 3%, transparent) 0%, transparent 60%)`,
          }}
          aria-hidden="true"
        />

        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <div className="mb-10">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 font-mono text-xs text-[#6c7086] hover:text-[#cba6f7] transition-colors cursor-none group"
            >
              <ArrowLeft size={13} className="transform group-hover:-translate-x-0.5 transition-transform" />
              back to all projects
            </Link>
          </div>

          {/* ── CASE STUDY PANEL (Terminal Frame) ────────────────────────────── */}
          <div
            className="rounded-xl overflow-hidden border mb-12 shadow-2xl"
            style={{
              backgroundColor: '#181825',
              borderColor: '#313244',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#313244]" style={{ backgroundColor: '#11111b' }}>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#f38ba8' }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#f9e2af' }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#a6e3a1' }} />
                <span className="font-mono text-xs text-[#6c7086] ml-2">projects/{project.slug}.md</span>
              </div>
              <div className="flex items-center gap-2">
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs transition-colors hover:text-[#cba6f7] flex items-center gap-1 text-[#6c7086] cursor-none"
                  >
                    <ExternalLink size={12} />
                    demo
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs transition-colors hover:text-[#cba6f7] flex items-center gap-1 text-[#6c7086] cursor-none"
                  >
                    <Github size={12} />
                    code
                  </a>
                )}
              </div>
            </div>

            {/* Case study banner */}
            <div
              className="py-16 px-8 text-center relative overflow-hidden flex flex-col items-center justify-center border-b border-[#313244]"
              style={{
                background: `linear-gradient(135deg, color-mix(in srgb, ${project.accentColor} 10%, #181825) 0%, color-mix(in srgb, ${project.accentColor} 2%, #11111b) 100%)`,
              }}
            >
              <div className="font-mono text-xs text-[#6c7086] tracking-widest uppercase mb-2">case study // {project.id}</div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-[#cdd6f4]">
                {project.name}
              </h1>
              <p className="text-sm max-w-xl text-[#a6adc8] leading-relaxed">
                {project.description}
              </p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-2 justify-center mt-6">
                {project.stack.map((s) => (
                  <span
                    key={s.label}
                    className="px-3 py-1 rounded text-xs font-mono border border-[#313244] shadow-sm"
                    style={{ backgroundColor: 'rgba(24, 24, 37, 0.85)', color: s.color ?? '#cdd6f4' }}
                  >
                    {s.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Narrative Body */}
            <div className="p-8 space-y-10 font-sans">
              
              {/* Overview */}
              <div>
                <h2 className="text-xl font-bold text-[#cdd6f4] mb-3 flex items-center gap-2">
                  <Terminal size={16} className="text-[#cba6f7]" />
                  Project Overview
                </h2>
                <p className="text-sm leading-relaxed text-[#a6adc8]" style={{ lineHeight: 1.7 }}>
                  {project.longDescription}
                </p>
              </div>

              {/* Problem & Approach */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-[#313244]">
                <div>
                  <h3 className="text-sm font-bold font-mono text-[#f38ba8] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Shield size={13} />
                    01 // The Problem
                  </h3>
                  <p className="text-xs leading-relaxed text-[#a6adc8]" style={{ lineHeight: 1.75 }}>
                    {project.problem}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-bold font-mono text-[#89b4fa] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Hammer size={13} />
                    02 // The Approach
                  </h3>
                  <p className="text-xs leading-relaxed text-[#a6adc8]" style={{ lineHeight: 1.75 }}>
                    {project.approach}
                  </p>
                </div>
              </div>

              {/* Challenge & Result */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-[#313244]">
                <div>
                  <h3 className="text-sm font-bold font-mono text-[#f9e2af] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Terminal size={13} />
                    03 // Crucial Challenge
                  </h3>
                  <p className="text-xs leading-relaxed text-[#a6adc8]" style={{ lineHeight: 1.75 }}>
                    {project.challenges}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-bold font-mono text-[#a6e3a1] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Award size={13} />
                    04 // The Outcome
                  </h3>
                  <p className="text-xs leading-relaxed text-[#a6adc8]" style={{ lineHeight: 1.75 }}>
                    {project.result}
                  </p>
                </div>
              </div>

              {/* Technical Rationale */}
              <div className="pt-6 border-t border-[#313244]">
                <h2 className="text-base font-bold text-[#cdd6f4] mb-4">Technical Rationale & Architecture</h2>
                <div className="space-y-4">
                  {project.techDetails.map((tech, i) => (
                    <div key={i} className="p-4 rounded-lg bg-[#11111b] border border-[#313244] font-mono text-xs">
                      <div className="font-bold mb-1" style={{ color: project.accentColor }}>{tech.title}</div>
                      <div className="text-[#a6adc8] leading-relaxed">{tech.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-[#313244]">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 font-mono text-xs text-[#6c7086] hover:text-[#cba6f7] transition-colors cursor-none group"
            >
              <ArrowLeft size={13} className="transform group-hover:-translate-x-0.5 transition-transform" />
              back to all projects
            </Link>

            <div className="flex gap-4">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-md font-mono text-xs transition-all duration-200 cursor-none border border-[#313244] hover:border-[#cba6f7] hover:text-[#cdd6f4] text-[#a6adc8] bg-[#181825]"
                >
                  <Github size={13} />
                  view source code
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-md font-mono text-xs transition-all duration-200 hover:opacity-80 transition-opacity cursor-none text-[#1e1e2e]"
                  style={{ backgroundColor: project.accentColor }}
                >
                  <ExternalLink size={13} />
                  launch live demo
                </a>
              )}
            </div>
          </div>

        </div>
      </main>
    </ClientShell>
  )
}
