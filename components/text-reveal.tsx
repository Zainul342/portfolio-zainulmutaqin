'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface TextRevealProps {
  text: string
  className?: string
  delay?: number
  duration?: number
  stagger?: number
  mode?: 'words' | 'chars'
  trigger?: boolean
}

export function TextReveal({
  text,
  className = '',
  delay = 0,
  duration = 0.8,
  stagger = 0.025,
  mode = 'words',
  trigger,
}: TextRevealProps) {
  const containerRef = useRef<HTMLSpanElement>(null)
  // Trigger animation when the element enters the viewport or when programmatically triggered
  const isInView = useInView(containerRef, { once: true, margin: '-10%' })
  const active = trigger !== undefined ? trigger : isInView

  // Split logic based on mode
  const items = mode === 'words' ? text.split(' ') : text.split('')

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  }

  const childVariants = {
    hidden: {
      y: '100%',
      transition: {
        type: 'tween',
        ease: [0.16, 1, 0.3, 1], // easeOutExpo
        duration: duration,
      },
    },
    visible: {
      y: '0%',
      transition: {
        type: 'tween',
        ease: [0.16, 1, 0.3, 1], // easeOutExpo
        duration: duration,
      },
    },
  }

  const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (isReducedMotion) {
    return <span className={className}>{text}</span>
  }

  return (
    <motion.span
      ref={containerRef}
      className={`inline-block overflow-hidden py-1 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={active ? 'visible' : 'hidden'}
      aria-label={text}
    >
      {items.map((item, index) => (
        <span
          key={index}
          className="inline-block overflow-hidden"
          style={{ verticalAlign: 'bottom' }}
        >
          <motion.span
            variants={childVariants}
            className="inline-block"
            // Keep spaces between words if we split by words
            style={{ marginRight: mode === 'words' ? '0.28em' : '0' }}
          >
            {item}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}
