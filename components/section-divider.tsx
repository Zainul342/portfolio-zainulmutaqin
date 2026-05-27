'use client'

import { motion } from 'framer-motion'

export function SectionDivider({ label }: { label: string }) {
  const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <div
      className="max-w-5xl mx-auto px-6 py-12"
      aria-hidden="true"
    >
      <div className="flex items-center gap-4">
        {isReducedMotion ? (
          <div className="flex-1 h-px" style={{ backgroundColor: '#313244' }} />
        ) : (
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-5% 0px' }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            className="flex-1 h-px origin-right"
            style={{ backgroundColor: '#313244' }}
          />
        )}
        <span
          className="font-mono text-[9px] tracking-widest uppercase flex-shrink-0"
          style={{ color: '#45475a' }}
        >
          {label}
        </span>
        {isReducedMotion ? (
          <div className="flex-1 h-px" style={{ backgroundColor: '#313244' }} />
        ) : (
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-5% 0px' }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            className="flex-1 h-px origin-left"
            style={{ backgroundColor: '#313244' }}
          />
        )}
      </div>
    </div>
  )
}
