'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue } from 'framer-motion'

export function CustomCursor() {
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Direct coordinates without spring to ensure instant, zero-delay movement
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  useEffect(() => {
    setMounted(true)

    let hasMouse = false

    const handleMouseMove = (e: MouseEvent) => {
      if (!hasMouse) {
        hasMouse = true
        setIsVisible(true)
        document.documentElement.classList.add('custom-cursor-active')
      }
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    const handleTouchStart = () => {
      hasMouse = false
      setIsVisible(false)
      document.documentElement.classList.remove('custom-cursor-active')
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    const handleMouseEnter = () => {
      if (hasMouse) {
        setIsVisible(true)
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.documentElement.classList.remove('custom-cursor-active')
    }
  }, [mouseX, mouseY])

  if (!mounted || !isVisible) return null

  return (
    <motion.div
      className="fixed top-0 left-0 w-2 h-2 bg-neutral-100 rounded-full pointer-events-none z-[99999]"
      style={{
        x: mouseX,
        y: mouseY,
        translateX: '-50%',
        translateY: '-50%',
        mixBlendMode: 'difference',
      }}
    />
  )
}
