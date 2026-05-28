'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  range?: number // Hover range of magnetic attraction in px
  strength?: number // Magnetic pull strength multiplier (0 to 1)
}

export function MagneticButton({
  children,
  className = '',
  range = 60,
  strength = 0.35,
}: MagneticButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current
    if (!container) return

    const { clientX, clientY } = e
    const { left, top, width, height } = container.getBoundingClientRect()

    // Calculate distance from cursor to center of the button
    const centerX = left + width / 2
    const centerY = top + height / 2
    const distanceX = clientX - centerX
    const distanceY = clientY - centerY

    // Verify cursor is within range
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)

    if (distance < range) {
      // Pull toward cursor
      setPosition({
        x: distanceX * strength,
        y: distanceY * strength,
      })
    } else {
      // Outside range, snap back
      setPosition({ x: 0, y: 0 })
    }
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{
        type: 'spring',
        stiffness: 150,
        damping: 15,
        mass: 0.1,
      }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  )
}
