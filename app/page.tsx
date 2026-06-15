import Link from 'next/link'
import { HeroSection } from '@/components/hero-section'
import { BentoSection } from '@/components/bento-section'
import { ExperienceSection } from '@/components/experience-section'
import { ProjectsSection } from '@/components/projects-section'
import { ContactSection } from '@/components/contact-section'
import { ClientShell } from '@/components/client-shell'
import { SectionDivider } from '@/components/section-divider'

export default function Portfolio() {
  return (
    <ClientShell>
      {/*
       * ── Page-level ambient background ──────────────────────────────────────
       * Three static radial-gradient "orbs" at very low opacity give the dark
       * page enough chromatic depth that the terminal's backdrop-blur-xl has
       * something to blur against — making the glassmorphism effect visible.
       * All colours are Catppuccin Mocha accents pulled way down in opacity.
       */}
      <div className="fixed inset-0 pointer-events-none select-none z-0" aria-hidden="true">
        {/* Top-left — mauve/purple */}
        <div
          className="absolute -top-[20%] -left-[15%] w-[60vw] h-[60vw] rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(203,166,247,0.065) 0%, transparent 70%)' }}
        />
        {/* Bottom-right — blue */}
        <div
          className="absolute -bottom-[15%] -right-[10%] w-[55vw] h-[55vw] rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(137,180,250,0.055) 0%, transparent 70%)' }}
        />
        {/* Centre — teal, very faint */}
        <div
          className="absolute top-[40%] left-[35%] w-[40vw] h-[40vw] rounded-full blur-[100px]"
          style={{ background: 'radial-gradient(circle, rgba(148,226,213,0.03) 0%, transparent 70%)' }}
        />
      </div>

      <main className="relative z-10">
        <HeroSection />

        {/* Divider */}
        <SectionDivider label="// 01. about" accentColor="var(--ctp-mauve)" />
        <BentoSection />

        <SectionDivider label="// 02. experience" accentColor="var(--ctp-blue)" />
        <ExperienceSection />

        <SectionDivider label="// 03. projects" accentColor="var(--ctp-green)" />
        <ProjectsSection />

        {/* Archive CTA */}
        <div className="flex justify-center py-6">
          <Link
            href="/archive"
            className="font-mono text-xs text-neutral-600 hover:text-neutral-300 transition-colors duration-150 tracking-wide"
          >
            [ view full digital archive -&gt; ]
          </Link>
        </div>

        <SectionDivider label="// 04. contact" accentColor="var(--ctp-teal)" />
        <ContactSection />
      </main>
    </ClientShell>
  )
}
