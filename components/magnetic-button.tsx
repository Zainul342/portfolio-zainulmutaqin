'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  range?: number // Hover range of magnetic attraction in px
  strength?: number // Magnetic pull strength multiplier (0 to 1)
}

export function MagneticButton({
  children,
  className = '',
  range = 70,
  strength = 0.25,
}: MagneticButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Tight, snappy, highly responsive spring settings (Awwwards standard)
  const springX = useSpring(x, { stiffness: 220, damping: 22, mass: 0.08 })
  const springY = useSpring(y, { stiffness: 220, damping: 22, mass: 0.08 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current
    if (!container) return

    const { clientX, clientY } = e
    const { left, top, width, height } = container.getBoundingClientRect()

    // Position of cursor relative to button center
    const centerX = left + width / 2
    const centerY = top + height / 2
    const distanceX = clientX - centerX
    const distanceY = clientY - centerY

    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)

    if (distance < range) {
      // Pull toward cursor (bypasses state updates entirely for maximum performance)
      x.set(distanceX * strength)
      y.set(distanceY * strength)

      // Set mouse tracking variables on the element style for optional child glow effects
      const mouseX = clientX - left
      const mouseY = clientY - top
      container.style.setProperty('--mouse-x', `${mouseX}px`)
      container.style.setProperty('--mouse-y', `${mouseY}px`)
    } else {
      x.set(0)
      y.set(0)
    }
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  )
}
