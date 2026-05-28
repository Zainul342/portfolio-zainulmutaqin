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
      <main>
        <HeroSection />

        {/* Divider */}
        <SectionDivider label="// 01. about" accentColor="var(--ctp-mauve)" />
        <BentoSection />

        <SectionDivider label="// 02. experience" accentColor="var(--ctp-blue)" />
        <ExperienceSection />

        <SectionDivider label="// 03. projects" accentColor="var(--ctp-green)" />
        <ProjectsSection />

        <SectionDivider label="// 04. contact" accentColor="var(--ctp-teal)" />
        <ContactSection />
      </main>
    </ClientShell>
  )
}
