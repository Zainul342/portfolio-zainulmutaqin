# Quiet Cartography OS — Implementation Blueprint

Dokumen ini adalah arahan implementasi untuk menaikkan konsep portfolio menjadi **Quiet Cartography OS** tanpa melakukan refactor besar.

Tujuannya bukan mengganti identitas portfolio yang sudah ada, tetapi memperkuat fondasi yang sudah dibuat: dark theme, terminal aesthetic, Linux/web/AI identity, command palette, bento layout, project cards, dan unsur geografi minor.

---

## 0. Keputusan Final

Konsep final:

> **Quiet Cartography OS** — sebuah portfolio yang terasa seperti sistem kartografi digital untuk memetakan origin, terrain, fieldwork, dan signal dari seorang quiet web builder.

Tagline konseptual:

> **Mapping ideas into useful digital systems.**

Versi hero yang lebih personal:

> **Building quiet web systems, exploring Linux, and mapping ideas into useful AI-assisted tools.**

Portfolio ini **bukan**:

- portfolio bertema globe
- portfolio bertema cyberpunk
- portfolio dengan dekorasi peta random
- portfolio dengan banyak icon geografi
- redesign total dari nol

Portfolio ini **adalah**:

- terminal-like portfolio
- dark, quiet, precise, low-noise
- memakai konsep kartografi sebagai cara berpikir
- section sebagai layer
- project sebagai field notes
- skill/tools sebagai instruments
- contact sebagai signal station

---

## 1. Batasan Penting

Implementasi harus menjaga struktur awal.

Jangan lakukan:

```txt
- ganti framework
- rewrite semua component
- rombak layout utama
- hapus BentoSection
- hapus ProjectsSection
- hapus Command Palette
- ubah routing besar
- ubah semua data structure sekaligus
```

Yang dilakukan:

```txt
- upgrade copywriting
- rename section labels
- ubah framing visual/narasi
- tambah komponen kecil
- ganti/opsionalisasi hero globe
- tambah metadata project secara bertahap
```

Strategi utama:

> **Concept upgrade, not full refactor.**

---

## 2. Vocabulary Sistem

Gunakan kosakata ini secara konsisten di UI.

| Term | Makna | Dipakai Untuk |
|---|---|---|
| origin | asal, identitas awal | About / Hero |
| terrain | bidang yang dijelajahi | Skills / Experience |
| fieldwork | project / eksperimen nyata | Projects |
| signal | kontak / output / arah komunikasi | Contact |
| layer | section website | Section divider |
| route | proses / alur belajar / alur membangun | Project metadata |
| waypoint | milestone / titik penting | Scroll progress / nav |
| instrument | tools / stack | Skills |
| bearing | arah masa depan | Hero / About |
| atlas | peta pribadi | Bento card |

Hindari kata yang terlalu cringe:

```txt
explore my world
coding journey around the world
digital nomad
world of code
map of dreams
```

---

## 3. Struktur Section Final

Struktur React tetap sama:

```tsx
<HeroSection />
<SectionDivider label="// layer 01: origin" />
<BentoSection />
<SectionDivider label="// layer 02: terrain" />
<ExperienceSection />
<SectionDivider label="// layer 03: fieldwork" />
<ProjectsSection />
<SectionDivider label="// layer 04: signal" />
<ContactSection />
```

Mapping konsep:

| Section | Nama Lama | Nama Konsep | Fungsi |
|---|---|---|---|
| Hero | Hero | layer 00: boot | identitas dan arah |
| Bento/About | About | layer 01: origin | personal atlas |
| Experience | Experience | layer 02: terrain | perjalanan belajar/kerja |
| Projects | Projects | layer 03: fieldwork | hasil eksplorasi |
| Contact | Contact | layer 04: signal | channel komunikasi |

---

## 4. Phase 1 — Copywriting dan Naming

Phase ini paling aman. Tidak perlu komponen baru.

### 4.1 Hero Boot Lines

File target:

```txt
components/hero-section.tsx
```

Ganti:

```ts
const BOOT_LINES = [
  { text: '> booting system...', delay: 0 },
  { text: '> loading zainul.mutaqin...', delay: 600 },
  { text: '> status: full-stack dev | linux explorer | ai/ml curious', delay: 1400 },
  { text: '> ready.', delay: 2400 },
]
```

Menjadi:

```ts
const BOOT_LINES = [
  { text: '> booting quiet.cartography...', delay: 0 },
  { text: '> origin: jakarta.id', delay: 600 },
  { text: '> terrain: web / linux / ai', delay: 1400 },
  { text: '> bearing: useful digital systems', delay: 2200 },
  { text: '> signal: ready.', delay: 3000 },
]
```

Catatan:

- Karena jumlah line bertambah dari 4 ke 5, cek tinggi terminal body.
- Jika terasa terlalu tinggi di mobile, kecilkan `min-h-[128px]` menjadi `min-h-[148px]` atau atur font.

### 4.2 Hero Tagline

Ganti:

```tsx
Building on the web. Exploring the terminal. Curious about what&rsquo;s next.
```

Menjadi:

```tsx
Building quiet web systems, exploring Linux, and mapping ideas into useful AI-assisted tools.
```

Alternatif lebih pendek:

```tsx
Mapping ideas from terminal experiments into useful web systems.
```

Rekomendasi final: gunakan versi pertama.

### 4.3 Coordinate Metadata

Saat ini koordinat ditampilkan seperti lokasi literal.

Upgrade menjadi metadata sistem:

```tsx
<div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-3 mb-8 font-mono text-xs" style={{ color: '#a6adc8' }}>
  <span style={{ color: '#cba6f7' }}>origin</span>
  <span>Jakarta.ID</span>
  <span style={{ color: '#45475a' }}>//</span>
  <span>UTC+07</span>
  <span style={{ color: '#45475a' }}>//</span>
  <span>bearing: web → ai tools</span>
  <span className="terminal-cursor" style={{ marginLeft: 2 }} aria-hidden="true" />
</div>
```

Prinsip:

- Jangan terlalu banyak icon.
- MapPin boleh dihapus atau disimpan kecil.
- Buat lokasi terasa seperti state sistem, bukan alamat.

---

## 5. Phase 2 — Section Divider Labels

File target:

```txt
app/page.tsx
```

Ganti label:

```tsx
<SectionDivider label="// about" />
<SectionDivider label="// experience" />
<SectionDivider label="// projects" />
<SectionDivider label="// contact" />
```

Menjadi:

```tsx
<SectionDivider label="// layer 01: origin" />
<SectionDivider label="// layer 02: terrain" />
<SectionDivider label="// layer 03: fieldwork" />
<SectionDivider label="// layer 04: signal" />
```

Ini perubahan kecil tapi mengubah keseluruhan rasa portfolio.

---

## 6. Phase 3 — Personal Atlas Card

File target:

```txt
components/bento-section.tsx
```

Problem saat ini:

- Interest card masih terlalu literal: `Geography & Maps`.
- Itu kurang premium karena hanya menyebut minat, bukan membuat sistem konsep.

Keputusan:

> Ganti Interest Card menjadi **Personal Atlas Card**.

### 6.1 Copy Final

```txt
~/personal-atlas
├── origin       Jakarta, Indonesia
├── terrain      Web interfaces & Linux systems
├── instruments  TypeScript, Terminal, AI
├── method       Build → observe → refine
└── bearing      Useful agentic tools
```

### 6.2 Implementasi Minimal

Cari card dengan komentar:

```tsx
{/* ── 🎯 EXTRA INFO CARD ... */}
```

Ganti kontennya menjadi:

```tsx
<div>
  <div className="font-mono text-[10px] text-[#cba6f7] mb-2">~/personal-atlas</div>
  <div className="space-y-1 font-mono text-[9px] leading-relaxed text-[#a6adc8]">
    <div><span className="text-[#45475a]">├──</span> origin <span className="text-[#6c7086]">Jakarta, Indonesia</span></div>
    <div><span className="text-[#45475a]">├──</span> terrain <span className="text-[#6c7086]">Web interfaces</span></div>
    <div><span className="text-[#45475a]">├──</span> tools <span className="text-[#6c7086]">Linux / TS / AI</span></div>
    <div><span className="text-[#45475a]">└──</span> signal <span className="text-[#6c7086]">quiet systems</span></div>
  </div>
</div>
```

Untuk mobile, pastikan font tidak terlalu kecil. Jika terlalu kecil, pakai `text-[10px]`.

---

## 7. Phase 4 — Project Field Notes

File target:

```txt
lib/projects.ts
components/projects-section.tsx
```

Keputusan:

> Project cards tidak lagi hanya “projects”. Mereka adalah **field notes** dari hal yang pernah dibangun, diuji, rusak, dan diperbaiki.

### 7.1 Update Projects Subtitle

Di `components/projects-section.tsx`, ganti:

```tsx
things I&apos;ve built — some shipped, some experiments, all crafted with care
```

Menjadi:

```tsx
field notes from things I&apos;ve built, tested, broken, and refined
```

### 7.2 Tambah Metadata Project

Di `lib/projects.ts`, extend interface `Project`:

```ts
export interface Project {
  id: string
  name: string
  slug: string
  description: string
  stack: StackItem[]
  accentColor: string
  featured?: boolean
  github?: string
  demo?: string
  fieldNote?: {
    terrain: string
    route: string
    signal: string
  }
}
```

Contoh fieldNote:

```ts
fieldNote: {
  terrain: 'portfolio identity system',
  route: 'concept → component → deploy',
  signal: 'quiet cartography interface',
}
```

### 7.3 Render Field Note Metadata

Di `ProjectCard`, setelah description dan sebelum stack tags, tambahkan:

```tsx
{project.fieldNote && (
  <div className="mb-4 rounded-md border border-[#313244] bg-[#11111b] p-3 font-mono text-[9px] text-[#6c7086]">
    <div><span style={{ color: project.accentColor }}>terrain:</span> {project.fieldNote.terrain}</div>
    <div><span style={{ color: project.accentColor }}>route:</span> {project.fieldNote.route}</div>
    <div><span style={{ color: project.accentColor }}>signal:</span> {project.fieldNote.signal}</div>
  </div>
)}
```

Jika card terasa terlalu ramai, tampilkan hanya saat hover:

```tsx
style={{ opacity: hovered ? 1 : 0.72 }}
```

Atau pakai `max-height` transition nanti.

---

## 8. Phase 5 — TopographicField, Pengganti Globe Hero

File baru:

```txt
components/topographic-field.tsx
```

Keputusan visual:

- Globe tidak jadi pusat hero.
- Globe tetap boleh disimpan sebagai easter egg/lab.
- Hero utama memakai abstract topographic signal field.

### 8.1 Prinsip Visual

Elemen:

```txt
contour lines   = complexity / terrain
route line      = direction / process
waypoints       = web, linux, ai, origin
signal pulse    = current state
labels          = monospace metadata
```

Jangan:

```txt
- peta dunia
- kompas besar
- pin lokasi besar
- glow neon kuat
- cyberpunk city
```

### 8.2 Implementasi Awal SVG

Gunakan SVG, bukan canvas dulu. Lebih mudah dikontrol dan ringan.

```tsx
'use client'

export function TopographicField() {
  return (
    <div className="relative w-full h-full min-h-[260px] overflow-hidden rounded-2xl border border-[#313244] bg-[#11111b]/40">
      <svg
        viewBox="0 0 520 520"
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label="Abstract topographic signal field"
      >
        <defs>
          <radialGradient id="fieldGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#cba6f7" stopOpacity="0.10" />
            <stop offset="70%" stopColor="#cba6f7" stopOpacity="0.02" />
            <stop offset="100%" stopColor="#cba6f7" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="520" height="520" fill="url(#fieldGlow)" />

        <g fill="none" stroke="#45475a" strokeOpacity="0.45" strokeWidth="1">
          <path d="M80 120 C150 60, 240 70, 300 130 S430 200, 380 300 S250 390, 150 340 S20 220, 80 120Z" />
          <path d="M115 150 C170 105, 245 110, 292 155 S385 210, 350 285 S245 350, 170 315 S65 230, 115 150Z" />
          <path d="M150 180 C190 150, 250 150, 285 185 S335 230, 315 275 S245 315, 195 290 S115 225, 150 180Z" />
          <path d="M185 210 C215 190, 255 190, 278 215 S305 240, 292 263 S246 285, 215 270 S165 235, 185 210Z" />
        </g>

        <g fill="none" stroke="#89b4fa" strokeOpacity="0.75" strokeWidth="1.4">
          <path d="M145 330 C210 280, 255 260, 315 210 S390 145, 430 110" strokeDasharray="4 8" />
        </g>

        <g fontFamily="monospace" fontSize="12">
          <circle cx="145" cy="330" r="4" fill="#a6e3a1" />
          <text x="158" y="335" fill="#a6adc8">origin</text>

          <circle cx="255" cy="260" r="3" fill="#89b4fa" />
          <text x="268" y="265" fill="#6c7086">web</text>

          <circle cx="315" cy="210" r="3" fill="#cba6f7" />
          <text x="328" y="215" fill="#6c7086">ai</text>

          <circle cx="430" cy="110" r="3" fill="#f9e2af" />
          <text x="380" y="96" fill="#6c7086">linux</text>
        </g>
      </svg>

      <div className="absolute bottom-4 left-4 font-mono text-[10px] text-[#6c7086]">
        route.signal / quiet-cartography
      </div>
    </div>
  )
}
```

### 8.3 Integrasi Hero

Di `components/hero-section.tsx`:

1. Import:

```tsx
import { TopographicField } from '@/components/topographic-field'
```

2. Ganti area Globe:

```tsx
<TopographicField />
```

3. Jangan langsung delete `GlobeCanvas`. Simpan dulu.

Optional:

```tsx
// const GlobeCanvas = dynamic(...)
```

Bisa dikomentari setelah yakin.

---

## 9. Phase 6 — Route Progress

File baru:

```txt
components/route-progress.tsx
```

Ini optional untuk fase lanjut. Jangan kerjakan sebelum Phase 1-5 stabil.

Konsep:

```txt
boot → origin → terrain → fieldwork → signal
```

Komponen fixed kecil di kanan layar.

Data:

```ts
const ROUTE_NODES = [
  { id: 'hero', label: 'boot' },
  { id: 'about', label: 'origin' },
  { id: 'experience', label: 'terrain' },
  { id: 'projects', label: 'fieldwork' },
  { id: 'contact', label: 'signal' },
]
```

Prinsip:

- Desktop only dulu.
- Hidden di mobile.
- Jangan mengganggu konten.
- Active state berdasarkan section in viewport.

---

## 10. Command Palette Upgrade

File target:

```txt
components/command-palette.tsx
```

Command yang diinginkan:

```txt
go to boot
go to origin
go to terrain
go to fieldwork
go to signal
copy origin metadata
open github
open email channel
```

Jangan terlalu banyak dulu.

Prioritas:

```txt
1. go to origin
2. go to fieldwork
3. go to signal
4. open github
```

---

## 11. Visual Rules

### 11.1 Warna

Gunakan palet existing Catppuccin-like.

```txt
background main : #1e1e2e
panel           : #181825
panel deep      : #11111b
border          : #313244
muted line      : #45475a
text primary    : #cdd6f4
text secondary  : #a6adc8
text muted      : #6c7086
mauve           : #cba6f7
blue            : #89b4fa
green           : #a6e3a1
yellow          : #f9e2af
cyan            : #89dceb
```

### 11.2 Motion

Motion harus:

```txt
slow
subtle
optional
respect prefers-reduced-motion
```

Jangan:

```txt
fast glow
big parallax
heavy animated maps
neon pulse berlebihan
```

### 11.3 Density

Gunakan prinsip:

```txt
low volume, high signal
```

Artinya:

- satu elemen geo besar per section maksimal
- metadata kecil boleh ada
- jangan semua card punya garis kontur
- jangan semua text jadi istilah kartografi

---

## 12. Acceptance Criteria

Setelah implementasi, hasil dianggap benar jika:

```txt
[ ] Struktur utama app tidak berubah besar
[ ] Hero masih terasa terminal/web/Linux/AI
[ ] Geografi terasa sebagai sistem berpikir, bukan tempelan
[ ] Globe bukan lagi pusat perhatian utama
[ ] Section labels memakai layer language
[ ] Bento punya Personal Atlas
[ ] Projects terasa seperti Field Notes
[ ] Mobile tetap readable
[ ] prefers-reduced-motion tetap dihormati
[ ] Tidak ada visual cyberpunk/neon berlebihan
```

---

## 13. Urutan Kerja Paling Aman

Kerjakan urutan ini:

```txt
1. Update app/page.tsx section divider labels
2. Update BOOT_LINES di hero-section.tsx
3. Update hero tagline dan origin metadata
4. Update interest card menjadi Personal Atlas
5. Update projects subtitle
6. Tambahkan fieldNote type dan data di lib/projects.ts
7. Render fieldNote metadata di ProjectCard
8. Buat TopographicField
9. Replace GlobeCanvas di hero dengan TopographicField
10. Polish responsive dan spacing
```

Jangan mulai dari TopographicField kalau copy dan naming belum selesai. Konsep harus terasa dulu sebelum visual besar diganti.

---

## 14. Catatan Anti-Cringe

Setiap kali menambah elemen baru, cek pertanyaan ini:

```txt
Apakah ini membantu user memahami saya lebih baik?
Apakah ini membantu navigasi?
Apakah ini memperjelas project/skill?
Apakah ini cuma dekorasi?
```

Kalau cuma dekorasi, hapus atau kecilkan.

Portfolio premium bukan yang paling ramai, tapi yang paling tahu apa yang perlu ditampilkan.

---

## 15. Final Direction

Final direction:

> Bangun portfolio ini seperti peta sistem digital: gelap, tenang, presisi, berlapis, dan fungsional. Biarkan geografi hidup sebagai cara berpikir — origin, terrain, fieldwork, signal — bukan sebagai globe besar atau icon map yang generik.

Slogan internal saat ngoding:

```txt
Do not decorate. Map the system.
```
