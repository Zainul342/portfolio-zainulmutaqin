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
      <div className="bg-[url('/bg-linux.jpg')] bg-cover bg-center bg-no-repeat bg-fixed relative min-h-screen">
        {/* Deep dark overlay to ensure readability of text and terminal */}
        <div className="absolute inset-0 bg-[#0a0a0a]/85 pointer-events-none z-0" />

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
      </div>
    </ClientShell>
  )
}
