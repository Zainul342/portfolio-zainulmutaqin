'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface SectionDividerProps {
  label: string
  accentColor?: string
}

export function SectionDivider({ label, accentColor = 'var(--ctp-surface1)' }: SectionDividerProps) {
  const [isReducedMotion, setIsReducedMotion] = useState(false)
  useEffect(() => {
    setIsReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-6 py-16" aria-hidden="true">
      <div className="flex items-center gap-6">
        {/* Left Side: Topographic Curve with tracing dot */}
        <div className="flex-1 relative h-6 flex items-center overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background to-transparent z-10" />
          {isReducedMotion ? (
            <svg className="w-full h-4 opacity-20" style={{ color: accentColor }} viewBox="0 0 300 12" preserveAspectRatio="none">
              <path d="M 0,6 Q 75,2 150,8 T 300,6" fill="none" stroke="currentColor" strokeWidth="0.8" />
              <path d="M 0,9 Q 75,4 150,10 T 300,8" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
              <path d="M 0,3 Q 75,0 150,6 T 300,4" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.4" />
            </svg>
          ) : (
            <svg className="w-full h-4 opacity-30" style={{ color: accentColor }} viewBox="0 0 300 12" preserveAspectRatio="none">
              {/* Path 1 */}
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, margin: '-5% 0px' }}
                transition={{ duration: 1.4, ease: 'easeInOut' }}
                d="M 0,6 Q 75,2 150,8 T 300,6"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.8"
              />
              {/* Path 2 */}
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.6 }}
                viewport={{ once: true, margin: '-5% 0px' }}
                transition={{ duration: 1.7, ease: 'easeInOut', delay: 0.15 }}
                d="M 0,9 Q 75,4 150,10 T 300,8"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
              {/* Path 3 */}
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.4 }}
                viewport={{ once: true, margin: '-5% 0px' }}
                transition={{ duration: 2.0, ease: 'easeInOut', delay: 0.3 }}
                d="M 0,3 Q 75,0 150,6 T 300,4"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.3"
              />
              {/* Glowing Waypoint Tracer Dot */}
              <motion.circle
                initial={{ cx: 0, cy: 6, opacity: 0 }}
                whileInView={{
                  cx: [0, 90, 180, 240],
                  cy: [6, 3, 7, 5],
                  opacity: [0, 1, 1, 0]
                }}
                viewport={{ once: true }}
                transition={{ duration: 2.2, ease: 'easeInOut', delay: 0.2 }}
                r="1.8"
                fill="currentColor"
                style={{ filter: 'drop-shadow(0 0 3px currentColor)' }}
              />
              {/* Static waypoint ticks */}
              <line x1="80" y1="2" x2="80" y2="10" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
              <line x1="200" y1="2" x2="200" y2="10" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
            </svg>
          )}
        </div>

        {/* Center: Monospace Map Label */}
        <span
          className="font-mono text-[9px] tracking-widest uppercase flex-shrink-0 px-3 py-1.5 border border-ctp-surface1 rounded-lg bg-ctp-mantle/75 backdrop-blur-md shadow-lg"
          style={{
            color: accentColor,
            borderColor: `color-mix(in srgb, ${accentColor} 30%, var(--ctp-surface1))`,
            boxShadow: `0 4px 12px rgba(0,0,0,0.15), 0 0 10px color-mix(in srgb, ${accentColor} 5%, transparent)`
          }}
        >
          {label}
        </span>

        {/* Right Side: Topographic Curve with tracing dot */}
        <div className="flex-1 relative h-6 flex items-center overflow-hidden">
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent z-10" />
          {isReducedMotion ? (
            <svg className="w-full h-4 opacity-20" style={{ color: accentColor }} viewBox="0 0 300 12" preserveAspectRatio="none">
              <path d="M 0,6 Q 75,9 150,4 T 300,6" fill="none" stroke="currentColor" strokeWidth="0.8" />
              <path d="M 0,3 Q 75,8 150,2 T 300,4" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
              <path d="M 0,9 Q 75,11 150,6 T 300,8" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.4" />
            </svg>
          ) : (
            <svg className="w-full h-4 opacity-30" style={{ color: accentColor }} viewBox="0 0 300 12" preserveAspectRatio="none">
              {/* Path 1 */}
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, margin: '-5% 0px' }}
                transition={{ duration: 1.4, ease: 'easeInOut' }}
                d="M 0,6 Q 75,9 150,4 T 300,6"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.8"
              />
              {/* Path 2 */}
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.6 }}
                viewport={{ once: true, margin: '-5% 0px' }}
                transition={{ duration: 1.7, ease: 'easeInOut', delay: 0.15 }}
                d="M 0,3 Q 75,8 150,2 T 300,4"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
              {/* Path 3 */}
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.4 }}
                viewport={{ once: true, margin: '-5% 0px' }}
                transition={{ duration: 2.0, ease: 'easeInOut', delay: 0.3 }}
                d="M 0,9 Q 75,11 150,6 T 300,8"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.3"
              />
              {/* Glowing Waypoint Tracer Dot */}
              <motion.circle
                initial={{ cx: 300, cy: 6, opacity: 0 }}
                whileInView={{
                  cx: [300, 210, 120, 60],
                  cy: [6, 9, 3, 5],
                  opacity: [0, 1, 1, 0]
                }}
                viewport={{ once: true }}
                transition={{ duration: 2.2, ease: 'easeInOut', delay: 0.2 }}
                r="1.8"
                fill="currentColor"
                style={{ filter: 'drop-shadow(0 0 3px currentColor)' }}
              />
              {/* Static waypoint ticks */}
              <line x1="100" y1="2" x2="100" y2="10" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
              <line x1="220" y1="2" x2="220" y2="10" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
            </svg>
          )}
        </div>
      </div>
    </div>
  )
}
