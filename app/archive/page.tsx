import type { Metadata } from 'next'
import Link from 'next/link'
import { archiveEntries, categoryConfig } from '@/lib/archive'
import { ClientShell } from '@/components/client-shell'

export const metadata: Metadata = {
  title: 'Digital Archive — Zainul Mutaqin',
  description:
    'A complete log of projects, certificates, awards, and education milestones — Zainul Mutaqin.',
  alternates: {
    canonical: 'https://zainulmutaqin.com/archive',
  },
}

// Group entries by year (descending)
function groupByYear(entries: typeof archiveEntries) {
  return entries.reduce<Record<string, typeof archiveEntries>>((acc, entry) => {
    if (!acc[entry.year]) acc[entry.year] = []
    acc[entry.year].push(entry)
    return acc
  }, {})
}

export default function ArchivePage() {
  const grouped = groupByYear(archiveEntries)
  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a))

  return (
    <ClientShell>
      <main className="min-h-screen bg-[#0a0a0a] px-4 sm:px-6 pt-28 pb-24">
        <div className="max-w-4xl mx-auto">

          {/* ── Page Header ─────────────────────────────────────────────── */}
          <div className="mb-12 border-b border-white/5 pb-8">
            <div className="flex items-center gap-2 font-mono text-xs text-neutral-600 mb-3 tracking-widest uppercase">
              <span className="text-[#cba6f7]">zm</span>
              <span>/</span>
              <span>archive</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-200 mb-2 tracking-tight">
              Digital Archive
            </h1>
            <p className="font-mono text-xs text-neutral-600 max-w-lg leading-relaxed">
              A chronological log of projects, certificates, awards, and education.{' '}
              <span className="text-neutral-500">
                All entries are static and maintained manually.
              </span>
            </p>
          </div>

          {/* ── Archive Table ────────────────────────────────────────────── */}
          <div className="border border-white/5 rounded-sm overflow-hidden">

            {/* Table header row */}
            <div
              className="hidden sm:grid font-mono text-[10px] text-neutral-600 uppercase tracking-widest px-5 py-2.5 border-b border-white/5"
              style={{ gridTemplateColumns: '4rem 5.5rem 1fr 1fr 4rem' }}
            >
              <span>Year</span>
              <span>Category</span>
              <span>Entry</span>
              <span>Issuer / Stack</span>
              <span className="text-right">Link</span>
            </div>

            {/* Grouped rows */}
            {years.map((year) => (
              <div key={year}>
                {grouped[year].map((entry, idx) => {
                  const cat = categoryConfig[entry.category]
                  return (
                    <div
                      key={`${year}-${idx}`}
                      className="group border-b border-white/[0.04] last:border-b-0 hover:bg-white/[0.025] transition-colors duration-150"
                    >
                      {/* Mobile layout (stacked) */}
                      <div className="sm:hidden px-4 py-3.5 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className="font-mono text-[10px] px-1.5 py-0.5 rounded-sm tracking-wider"
                            style={{ color: cat.color, backgroundColor: cat.bg }}
                          >
                            {cat.label}
                          </span>
                          <span className="font-mono text-[10px] text-neutral-600">{entry.year}</span>
                        </div>
                        <p className="text-sm font-semibold text-neutral-200 leading-snug">{entry.title}</p>
                        <p className="font-mono text-[10px] text-neutral-600">{entry.issuer}</p>
                        {entry.url && (
                          <a
                            href={entry.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block font-mono text-[10px] text-neutral-500 hover:text-neutral-300 transition-colors mt-1"
                          >
                            [{entry.urlLabel ?? 'Link'}] ↗
                          </a>
                        )}
                      </div>

                      {/* Desktop layout (grid) */}
                      <div
                        className="hidden sm:grid items-center px-5 py-3"
                        style={{ gridTemplateColumns: '4rem 5.5rem 1fr 1fr 4rem' }}
                      >
                        {/* Year */}
                        <span className="font-mono text-xs text-neutral-600 tabular-nums">
                          {entry.year}
                        </span>

                        {/* Category badge */}
                        <div>
                          <span
                            className="font-mono text-[10px] px-1.5 py-0.5 rounded-sm tracking-wider"
                            style={{ color: cat.color, backgroundColor: cat.bg }}
                          >
                            {cat.label}
                          </span>
                        </div>

                        {/* Title */}
                        <span className="text-sm font-semibold text-neutral-200 pr-4 leading-tight">
                          {entry.title}
                        </span>

                        {/* Issuer / Stack */}
                        <span className="font-mono text-xs text-neutral-600 pr-4 truncate">
                          {entry.issuer}
                        </span>

                        {/* Link */}
                        <div className="text-right">
                          {entry.url ? (
                            <a
                              href={entry.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-[10px] text-neutral-600 hover:text-neutral-300 transition-colors duration-150"
                              aria-label={`Open ${entry.title}`}
                            >
                              [{entry.urlLabel ?? 'Link'}]
                            </a>
                          ) : (
                            <span className="font-mono text-[10px] text-neutral-800">—</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          {/* ── Footer note ──────────────────────────────────────────────── */}
          <div className="mt-8 flex items-center justify-between">
            <p className="font-mono text-[10px] text-neutral-700">
              {archiveEntries.length} entries total · sorted by year desc
            </p>
            <Link
              href="/"
              className="font-mono text-[10px] text-neutral-600 hover:text-neutral-300 transition-colors duration-150"
            >
              ← back to portfolio
            </Link>
          </div>

        </div>
      </main>
    </ClientShell>
  )
}
