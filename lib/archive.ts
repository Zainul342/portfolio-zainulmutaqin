export type ArchiveCategory = 'Project' | 'Certificate' | 'Award' | 'Education'

export interface ArchiveEntry {
  year: string
  category: ArchiveCategory
  title: string
  issuer: string // publisher, institution, or tech stack
  url?: string
  urlLabel?: 'Link' | 'Code' | 'Cert' | 'Repo'
}

export const archiveEntries: ArchiveEntry[] = [
  // ─── Education ───────────────────────────────────────────────────────────────
  {
    year: '2023',
    category: 'Education',
    title: 'SNBT — Seleksi Nasional Berdasarkan Tes',
    issuer: 'LTMPT / SNPMB',
    url: undefined,
  },
  {
    year: '2022',
    category: 'Award',
    title: 'Penerima Beasiswa KIP Kuliah',
    issuer: 'Kemdikbud RI',
    url: undefined,
  },

  // ─── Certificates ────────────────────────────────────────────────────────────
  {
    year: '2024',
    category: 'Certificate',
    title: 'Excel Fundamentals for Data Analysis',
    issuer: 'Coursera — Macquarie University',
    url: 'https://coursera.org',
    urlLabel: 'Cert',
  },
  {
    year: '2024',
    category: 'Certificate',
    title: 'Data Analysis with Python',
    issuer: 'IBM / Cognitive Class',
    url: 'https://courses.cognitiveclass.ai',
    urlLabel: 'Cert',
  },
  {
    year: '2023',
    category: 'Certificate',
    title: 'Responsive Web Design',
    issuer: 'freeCodeCamp',
    url: 'https://freecodecamp.org',
    urlLabel: 'Cert',
  },

  // ─── Projects ────────────────────────────────────────────────────────────────
  {
    year: '2024',
    category: 'Project',
    title: 'CineVault — Film Discovery App',
    issuer: 'Next.js · TMDB API · TypeScript',
    url: 'https://github.com/Zainul342',
    urlLabel: 'Code',
  },
  {
    year: '2024',
    category: 'Project',
    title: 'StudyFlow — Productivity Dashboard',
    issuer: 'React · Tailwind · Supabase',
    url: 'https://github.com/Zainul342',
    urlLabel: 'Code',
  },
  {
    year: '2023',
    category: 'Project',
    title: 'Domcy Coffee — Cafe Landing Page',
    issuer: 'HTML · CSS · Vanilla JS',
    url: 'https://github.com/Zainul342',
    urlLabel: 'Code',
  },

  // ─── Awards ──────────────────────────────────────────────────────────────────
  {
    year: '2023',
    category: 'Award',
    title: 'Finalis Hackathon Nasional — Track Web',
    issuer: 'Placeholder Competition Name',
    url: undefined,
  },
]

// Category color & label config — used by the badge renderer
export const categoryConfig: Record<
  ArchiveCategory,
  { label: string; color: string; bg: string }
> = {
  Project:     { label: 'proj',  color: '#89b4fa', bg: 'rgba(137,180,250,0.08)' },
  Certificate: { label: 'cert',  color: '#a6e3a1', bg: 'rgba(166,227,161,0.08)' },
  Award:       { label: 'award', color: '#f9e2af', bg: 'rgba(249,226,175,0.08)' },
  Education:   { label: 'edu',   color: '#cba6f7', bg: 'rgba(203,166,247,0.08)' },
}
