'use client'

import { useEffect, useState } from 'react'
import { HeroSection } from '@/components/hero-section'
import { AboutSection } from '@/components/about-section'
import { SkillsSection } from '@/components/skills-section'
import { ProjectsSection } from '@/components/projects-section'
import { ContactSection, Footer } from '@/components/contact-section'
import { CommandPalette } from '@/components/command-palette'
import { NavBar } from '@/components/nav-bar'
import { CustomCursor } from '@/components/custom-cursor'
import { ScrollProgress } from '@/components/scroll-progress'

export default function Portfolio() {
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [fabVisible, setFabVisible] = useState(false)

  // Global Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setPaletteOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setFabVisible(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {/* Custom cursor — desktop only */}
      <div className="hidden md:block">
        <CustomCursor />
      </div>

      {/* Scroll progress indicator */}
      <ScrollProgress />

      {/* Navigation */}
      <NavBar onOpenPalette={() => setPaletteOpen(true)} />

      {/* Main content */}
      <main>
        <HeroSection onOpenPalette={() => setPaletteOpen(true)} />

        {/* Divider */}
        <SectionDivider label="// about" />
        <AboutSection />

        <SectionDivider label="// skills" />
        <SkillsSection />

        <SectionDivider label="// projects" />
        <ProjectsSection />

        <SectionDivider label="// contact" />
        <ContactSection />
      </main>

      <Footer />

      {/* Mobile command palette FAB */}
      <button
        type="button"
        onClick={() => setPaletteOpen(true)}
        aria-label="Open command palette"
        className="md:hidden fixed bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500"
        style={{
          backgroundColor: '#313244',
          border: '1px solid #6c7086',
          zIndex: 40,
          opacity: fabVisible ? 1 : 0,
          transform: fabVisible ? 'translateY(0)' : 'translateY(8px)',
        }}
      >
        <span className="font-mono text-lg" style={{ color: '#cba6f7' }}>
          ⌘
        </span>
      </button>

      {/* Command Palette */}
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
      />
    </>
  )
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div
      className="max-w-5xl mx-auto px-6"
      aria-hidden="true"
    >
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px" style={{ backgroundColor: '#313244' }} />
        <span
          className="font-mono text-[10px] tracking-widest uppercase"
          style={{ color: '#45475a' }}
        >
          {label}
        </span>
        <div className="flex-1 h-px" style={{ backgroundColor: '#313244' }} />
      </div>
    </div>
  )
}
