'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  archiveEntries,
  categoryConfig,
  categoryOrder,
  type ArchiveCategory,
} from '@/lib/archive'

// ─── Client component (filter tabs need interactivity) ─────────────────────
export default function ArchivePage() {
  const [activeFilter, setActiveFilter] = useState<'all' | ArchiveCategory>('all')

  const filtered =
    activeFilter === 'all'
      ? archiveEntries
      : archiveEntries.filter((e) => e.category === activeFilter)

  // Count per category
  const counts = archiveEntries.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + 1
    return acc
  }, {})

  // Group filtered by year descending
  const grouped = filtered.reduce<Record<string, typeof filtered>>((acc, e) => {
    if (!acc[e.year]) acc[e.year] = []
    acc[e.year].push(e)
    return acc
  }, {})
  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a))

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-4 sm:px-6 pt-28 pb-24">
      <div className="max-w-4xl mx-auto">

        {/* ── Page Header ─────────────────────────────────────────────────── */}
        <div className="mb-10 border-b border-white/5 pb-8">
          <div className="flex items-center gap-2 font-mono text-[10px] text-neutral-600 mb-3 tracking-widest uppercase">
            <Link href="/" className="hover:text-neutral-400 transition-colors">zm</Link>
            <span>/</span>
            <span className="text-neutral-400">archive</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-200 mb-2 tracking-tight">
            Digital Archive
          </h1>
          <p className="font-mono text-xs text-neutral-600 max-w-lg leading-relaxed">
            Chronological log of projects, certificates, awards, education, organizations, and work.{' '}
            <span className="text-neutral-700">Maintained manually.</span>
          </p>
        </div>

        {/* ── Filter Tabs ──────────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-1.5 mb-8">
          {categoryOrder.map((cat) => {
            const isActive = activeFilter === cat
            const cfg = cat !== 'all' ? categoryConfig[cat] : null
            const count = cat === 'all' ? archiveEntries.length : (counts[cat] ?? 0)

            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className="flex items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] tracking-wider rounded-sm border transition-all duration-150"
                style={{
                  borderColor: isActive
                    ? cfg?.color ?? 'rgba(255,255,255,0.3)'
                    : 'rgba(255,255,255,0.06)',
                  color: isActive
                    ? cfg?.color ?? 'rgba(255,255,255,0.85)'
                    : '#4b5563',
                  backgroundColor: isActive
                    ? cfg?.bg ?? 'rgba(255,255,255,0.05)'
                    : 'transparent',
                }}
              >
                {cat === 'all' ? 'all' : cfg?.label}
                <span
                  className="opacity-50"
                  style={{ color: isActive ? cfg?.color ?? '#fff' : '#374151' }}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* ── Table ────────────────────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <p className="font-mono text-xs text-neutral-700 py-12 text-center">
            no entries in this category yet.
          </p>
        ) : (
          <div className="border border-white/5 rounded-sm overflow-hidden">

            {/* Desktop column headers */}
            <div
              className="hidden sm:grid font-mono text-[10px] text-neutral-700 uppercase tracking-widest px-5 py-2.5 border-b border-white/5"
              style={{ gridTemplateColumns: '3.5rem 5rem 1fr 1fr 4rem' }}
            >
              <span>Year</span>
              <span>Cat</span>
              <span>Entry</span>
              <span>Issuer / Stack</span>
              <span className="text-right">Link</span>
            </div>

            {/* Rows grouped by year */}
            {years.map((year) => (
              <div key={year}>
                {grouped[year].map((entry, idx) => {
                  const cat = categoryConfig[entry.category]

                  return (
                    <div
                      key={`${year}-${entry.category}-${idx}`}
                      className="group border-b border-white/[0.035] last:border-b-0 hover:bg-white/[0.02] transition-colors duration-100"
                    >
                      {/* ── Mobile layout ── */}
                      <div className="sm:hidden px-4 py-3.5 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className="font-mono text-[10px] px-1.5 py-0.5 rounded-sm tracking-wider"
                            style={{ color: cat.color, backgroundColor: cat.bg }}
                          >
                            {cat.label}
                          </span>
                          <span className="font-mono text-[10px] text-neutral-700">{entry.year}</span>
                        </div>
                        <p className="text-sm font-semibold text-neutral-200 leading-snug">{entry.title}</p>
                        <p className="font-mono text-[10px] text-neutral-600">{entry.issuer}</p>
                        {entry.note && (
                          <p className="font-mono text-[10px] text-neutral-700 leading-relaxed">{entry.note}</p>
                        )}
                        {entry.url && (
                          <a
                            href={entry.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block font-mono text-[10px] text-neutral-600 hover:text-neutral-300 transition-colors mt-0.5"
                          >
                            [{entry.urlLabel ?? 'Link'}] ↗
                          </a>
                        )}
                      </div>

                      {/* ── Desktop layout ── */}
                      <div
                        className="hidden sm:grid items-center px-5 py-3 gap-x-3"
                        style={{ gridTemplateColumns: '3.5rem 5rem 1fr 1fr 4rem' }}
                      >
                        {/* Year */}
                        <span className="font-mono text-xs text-neutral-700 tabular-nums select-none">
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
                        <div className="pr-3">
                          <span className="text-sm font-semibold text-neutral-200 leading-tight">
                            {entry.title}
                          </span>
                          {entry.note && (
                            <p className="font-mono text-[10px] text-neutral-700 mt-0.5 leading-relaxed truncate">
                              {entry.note}
                            </p>
                          )}
                        </div>

                        {/* Issuer / Stack */}
                        <span className="font-mono text-xs text-neutral-600 pr-3 truncate">
                          {entry.issuer}
                        </span>

                        {/* Link */}
                        <div className="text-right">
                          {entry.url ? (
                            <a
                              href={entry.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-[10px] text-neutral-700 group-hover:text-neutral-400 transition-colors duration-150"
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
        )}

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <div className="mt-7 flex items-center justify-between">
          <p className="font-mono text-[10px] text-neutral-800">
            {filtered.length} of {archiveEntries.length} entries
            {activeFilter !== 'all' ? ` · filtered: ${activeFilter.toLowerCase()}` : ''}
          </p>
          <Link
            href="/"
            className="font-mono text-[10px] text-neutral-700 hover:text-neutral-300 transition-colors duration-150"
          >
            ← back to portfolio
          </Link>
        </div>

      </div>
    </main>
  )
}
