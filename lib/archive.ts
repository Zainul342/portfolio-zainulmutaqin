/**
 * lib/archive.ts
 *
 * Data statis untuk halaman /archive.
 * Tambahkan entri baru di bawah kategori yang sesuai.
 * Kolom `url` dan `urlLabel` bersifat opsional.
 */

export type ArchiveCategory =
  | 'Project'
  | 'Certificate'
  | 'Award'
  | 'Education'
  | 'Organization'
  | 'Work'

export interface ArchiveEntry {
  year: string          // "2024"
  category: ArchiveCategory
  title: string         // nama pencapaian
  issuer: string        // penerbit, institusi, atau tech stack
  note?: string         // deskripsi singkat opsional
  url?: string
  urlLabel?: 'Link' | 'Code' | 'Cert' | 'Repo' | 'PDF'
}

export const archiveEntries: ArchiveEntry[] = [
  // ─── Education ─────────────────────────────────────────────────────────────
  {
    year: '2023',
    category: 'Education',
    title: 'SNBT — Seleksi Nasional Berdasarkan Tes',
    issuer: 'LTMPT / SNPMB',
    note: 'Jalur masuk Perguruan Tinggi Negeri.',
  },
  {
    year: '2023',
    category: 'Education',
    title: 'Mahasiswa Aktif — [Nama Prodi, Nama Universitas]',
    issuer: '[Universitas]',
    note: 'Ganti dengan nama prodi dan universitas kamu.',
  },

  // ─── Awards ────────────────────────────────────────────────────────────────
  {
    year: '2023',
    category: 'Award',
    title: 'Penerima Beasiswa KIP Kuliah',
    issuer: 'Kemdikbud RI',
    note: 'Beasiswa Kartu Indonesia Pintar jalur pemerintah.',
  },
  {
    year: '2023',
    category: 'Award',
    title: 'Finalis Hackathon Nasional — Track Web',
    issuer: 'Nama Penyelenggara',
    note: 'Ganti dengan nama hackathon yang sebenarnya.',
  },

  // ─── Certificates — Courses ───────────────────────────────────────────────
  {
    year: '2025',
    category: 'Certificate',
    title: 'Basic Excel',
    issuer: 'JobSeeker / Prakerja',
    note: 'Kursus dasar Microsoft Excel.',
    url: undefined,
    urlLabel: 'Cert',
  },
  {
    year: '2025',
    category: 'Certificate',
    title: 'Basic Data Analysis using Excel',
    issuer: 'JobSeeker / Prakerja',
    note: 'Analisis data menggunakan fitur pivot dan formula Excel.',
    url: undefined,
    urlLabel: 'Cert',
  },
  {
    year: '2025',
    category: 'Certificate',
    title: 'Basic CV and AI',
    issuer: 'JobSeeker / Prakerja',
    url: undefined,
    urlLabel: 'Cert',
  },
  {
    year: '2025',
    category: 'Certificate',
    title: 'Copilot 365',
    issuer: 'JobSeeker / Prakerja — Microsoft',
    url: undefined,
    urlLabel: 'Cert',
  },
  {
    year: '2025',
    category: 'Certificate',
    title: 'Word with Copilot',
    issuer: 'JobSeeker / Prakerja — Microsoft',
    url: undefined,
    urlLabel: 'Cert',
  },

  // ─── Certificates — Skills ────────────────────────────────────────────────
  {
    year: '2025',
    category: 'Certificate',
    title: 'Basic SQL',
    issuer: 'HackerRank',
    url: 'https://hackerrank.com',
    urlLabel: 'Cert',
  },
  {
    year: '2025',
    category: 'Certificate',
    title: 'Python',
    issuer: 'Kaggle',
    url: 'https://kaggle.com',
    urlLabel: 'Cert',
  },
  {
    year: '2024',
    category: 'Certificate',
    title: 'Responsive Web Design',
    issuer: 'freeCodeCamp',
    url: 'https://freecodecamp.org',
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

  // ─── Organization ─────────────────────────────────────────────────────────
  {
    year: '2024',
    category: 'Organization',
    title: 'Anggota IT Club / Informatika',
    issuer: '[Nama Sekolah / Kampus]',
    note: 'Ganti dengan nama organisasi yang sebenarnya.',
  },
  {
    year: '2024',
    category: 'Organization',
    title: 'Panitia / Volunteer — [Nama Acara]',
    issuer: '[Institusi]',
    note: 'Ganti dengan nama event yang sebenarnya.',
  },

  // ─── Work / Experience ─────────────────────────────────────────────────────
  {
    year: '2024',
    category: 'Work',
    title: 'IT Club Tutor — Pemrograman Dasar',
    issuer: '[Nama Sekolah / Kampus]',
    note: 'Mengajarkan dasar Python dan web development.',
    url: undefined,
    urlLabel: 'Cert',
  },

  // ─── Projects ──────────────────────────────────────────────────────────────
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
  {
    year: '2023',
    category: 'Project',
    title: 'Portfolio Website v1',
    issuer: 'Next.js · TailwindCSS · TypeScript',
    url: 'https://github.com/Zainul342',
    urlLabel: 'Repo',
  },
]

// ─── Badge config per kategori ─────────────────────────────────────────────
export const categoryConfig: Record<
  ArchiveCategory,
  { label: string; color: string; bg: string }
> = {
  Project:      { label: 'proj',  color: '#89b4fa', bg: 'rgba(137,180,250,0.08)' },
  Certificate:  { label: 'cert',  color: '#a6e3a1', bg: 'rgba(166,227,161,0.08)' },
  Award:        { label: 'award', color: '#f9e2af', bg: 'rgba(249,226,175,0.08)' },
  Education:    { label: 'edu',   color: '#cba6f7', bg: 'rgba(203,166,247,0.08)' },
  Organization: { label: 'org',   color: '#94e2d5', bg: 'rgba(148,226,213,0.08)' },
  Work:         { label: 'work',  color: '#fab387', bg: 'rgba(250,179,135,0.08)' },
}

// ─── Category display order untuk filter tabs ──────────────────────────────
export const categoryOrder: Array<'all' | ArchiveCategory> = [
  'all',
  'Project',
  'Work',
  'Certificate',
  'Award',
  'Organization',
  'Education',
]
