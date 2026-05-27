'use client'

import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface RevealProps {
  children: React.ReactNode
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  delay?: number
  duration?: number
  className?: string
  width?: 'fit-content' | '100%'
}

export function Reveal({
  children,
  direction = 'up',
  delay = 0.15,
  duration = 0.4,
  className = '',
  width = '100%',
}: RevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-8% 0px' })

  // Disable animations for users who prefer reduced motion
  const reducedMotionVariants = {
    hidden: { opacity: 1, y: 0, x: 0 },
    visible: { opacity: 1, y: 0, x: 0 },
  }

  const getVariants = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return reducedMotionVariants
    }

    const offsets = {
      up: { y: 16, x: 0 },
      down: { y: -16, x: 0 },
      left: { x: 16, y: 0 },
      right: { x: -16, y: 0 },
      none: { x: 0, y: 0 },
    }

    const offset = offsets[direction] || offsets.up

    return {
      hidden: { opacity: 0, ...offset },
      visible: { opacity: 1, x: 0, y: 0 },
    }
  }

  return (
    <div ref={ref} className={className} style={{ position: 'relative', width }}>
      <motion.div
        variants={getVariants()}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        transition={{ duration, delay, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </div>
  )
}
