import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Digital Archive — Zainul Mutaqin',
  description:
    'A complete log of projects, certificates, awards, organizations, work, and education — Zainul Mutaqin.',
  alternates: {
    canonical: 'https://zainulmutaqin.com/archive',
  },
}

export default function ArchiveLayout({ children }: { children: React.ReactNode }) {
  return children
}
