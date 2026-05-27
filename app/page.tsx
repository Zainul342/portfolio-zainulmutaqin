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
        <SectionDivider label="// about" />
        <BentoSection />

        <SectionDivider label="// experience" />
        <ExperienceSection />

        <SectionDivider label="// projects" />
        <ProjectsSection />

        <SectionDivider label="// contact" />
        <ContactSection />
      </main>
    </ClientShell>
  )
}
