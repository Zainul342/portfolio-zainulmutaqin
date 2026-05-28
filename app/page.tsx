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
        <SectionDivider label="// layer 01: origin" />
        <BentoSection />

        <SectionDivider label="// layer 02: terrain" />
        <ExperienceSection />

        <SectionDivider label="// layer 03: fieldwork" />
        <ProjectsSection />

        <SectionDivider label="// layer 04: signal" />
        <ContactSection />
      </main>
    </ClientShell>
  )
}
