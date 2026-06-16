import Link from 'next/link'
import { HeroSection } from '@/components/hero-section'
import { BentoSection } from '@/components/bento-section'
import { ExperienceSection } from '@/components/experience-section'
import { ProjectsSection } from '@/components/projects-section'
import { ContactSection } from '@/components/contact-section'
import { ClientShell } from '@/components/client-shell'
import { SectionDivider } from '@/components/section-divider'
import { TuiWindow } from '@/components/ui/TuiWindow'

export default function Portfolio() {
  return (
    <ClientShell>
      <div className="bg-[url('/bg-linux.jpg')] bg-cover bg-center bg-no-repeat bg-fixed relative min-h-screen">
        {/* Deep dark overlay to ensure readability of text and terminal */}
        <div className="absolute inset-0 bg-[#0a0a0a]/85 pointer-events-none z-0" />

        <main className="relative z-10 space-y-16 py-12">
          
          {/* Hero Window */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <TuiWindow tabName="zainul@endeavouros:~" mode="EXECUTE">
              <HeroSection />
            </TuiWindow>
          </div>

          {/* About Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <SectionDivider label="// 01. about" accentColor="var(--ctp-mauve)" />
            <TuiWindow tabName="~/dotfiles/about.lua" mode="READ" className="mt-6">
              <BentoSection />
            </TuiWindow>
          </div>

          {/* Experience Section (Unwrapped as requested, only Hero, Bento, Projects wrapped) */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <SectionDivider label="// 02. experience" accentColor="var(--ctp-blue)" />
            <div className="mt-6">
              <ExperienceSection />
            </div>
          </div>

          {/* Projects Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <SectionDivider label="// 03. projects" accentColor="var(--ctp-green)" />
            <TuiWindow tabName="~/projects/fieldwork.json" mode="SOURCE" className="mt-6">
              <ProjectsSection />
            </TuiWindow>
          </div>

          {/* Archive CTA */}
          <div className="flex justify-center py-6">
            <Link
              href="/archive"
              className="font-mono text-xs text-neutral-400 hover:text-neutral-200 transition-colors duration-150 tracking-wide"
            >
              [ view full digital archive -&gt; ]
            </Link>
          </div>

          {/* Contact Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <SectionDivider label="// 04. contact" accentColor="var(--ctp-teal)" />
            <div className="mt-6">
              <ContactSection />
            </div>
          </div>
        </main>
      </div>
    </ClientShell>
  )
}
