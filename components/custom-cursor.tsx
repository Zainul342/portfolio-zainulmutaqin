'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'

export function CustomCursor() {
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [cursorText, setCursorText] = useState('')
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])

  // Spring physics for smooth trailing outer reticle
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)
  
  const springConfig = { damping: 28, stiffness: 280, mass: 0.5 }
  const outerX = useSpring(mouseX, springConfig)
  const outerY = useSpring(mouseY, springConfig)

  useEffect(() => {
    setMounted(true)

    let hasMouse = false
    let rippleId = 0

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

    const handleMouseDown = (e: MouseEvent) => {
      if (!hasMouse) return
      setIsClicked(true)
      
      // Spawn ripple at click location
      const newRipple = { id: rippleId++, x: e.clientX, y: e.clientY }
      setRipples((prev) => [...prev, newRipple].slice(-3)) // Max 3 ripples at once
    }

    const handleMouseUp = () => {
      setIsClicked(false)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    const handleMouseEnter = () => {
      if (hasMouse) {
        setIsVisible(true)
      }
    }

    // Global event delegation for hovering over interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      if (!hasMouse) return
      const target = e.target as HTMLElement
      if (!target) return

      const interactiveEl = target.closest('a, button, [role="button"], input, select, textarea, .interactive-hover')
      if (interactiveEl) {
        setIsHovered(true)
        const customText = interactiveEl.getAttribute('data-cursor')
        if (customText) {
          setCursorText(customText)
        }
      } else {
        setIsHovered(false)
        setCursorText('')
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('mousedown', handleMouseDown, { passive: true })
    window.addEventListener('mouseup', handleMouseUp, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)
    window.addEventListener('mouseover', handleMouseOver, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      window.removeEventListener('mouseover', handleMouseOver)
      document.documentElement.classList.remove('custom-cursor-active')
    }
  }, [mouseX, mouseY])

  // Clean up ripples after animation
  useEffect(() => {
    if (ripples.length === 0) return
    const timer = setTimeout(() => {
      setRipples((prev) => prev.slice(1))
    }, 800)
    return () => clearTimeout(timer)
  }, [ripples])

  if (!mounted || !isVisible) return null

  // Styling properties depending on active states
  const accentColor = isClicked ? '#a6e3a1' : isHovered ? '#94e2d5' : '#cba6f7'
  const glowShadow = isClicked
    ? '0 0 15px rgba(166, 227, 161, 0.6)'
    : isHovered
    ? '0 0 20px rgba(148, 226, 213, 0.4)'
    : '0 0 10px rgba(203, 166, 247, 0.2)'

  return (
    <>
      {/* Click Ripples */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="fixed top-0 left-0 rounded-full border pointer-events-none z-[99997]"
            style={{
              x: ripple.x,
              y: ripple.y,
              translateX: '-50%',
              translateY: '-50%',
              borderColor: '#a6e3a1',
              boxShadow: '0 0 12px rgba(166, 227, 161, 0.4)',
            }}
            initial={{ width: 4, height: 4, opacity: 0.8 }}
            animate={{ width: 80, height: 80, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>

      {/* Inner precise target crosshair */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99999] flex items-center justify-center"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        {isHovered ? (
          // Chevron terminal pointer in hover state
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-mono text-[10px] font-bold"
            style={{ color: accentColor, textShadow: '0 0 4px rgba(148, 226, 213, 0.6)' }}
          >
            &gt;
          </motion.span>
        ) : (
          // Tech precise dot/crosshair in normal state
          <motion.div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: accentColor,
              boxShadow: '0 0 8px rgba(203, 166, 247, 0.8)',
            }}
            animate={{
              scale: isClicked ? 0.5 : 1,
            }}
          />
        )}
      </motion.div>

      {/* Outer Tactical Cartographic Reticle */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[99998] flex items-center justify-center"
        style={{
          x: outerX,
          y: outerY,
          translateX: '-50%',
          translateY: '-50%',
          width: 60,
          height: 60,
        }}
        animate={{
          scale: isClicked ? 0.65 : isHovered ? 1.25 : 1,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
      >
        {/* SVG Tactical Reticle Ring */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          {/* Inner compass dashes (rotates counter-clockwise) */}
          <motion.circle
            cx="50"
            cy="50"
            r="30"
            fill="none"
            stroke={accentColor}
            strokeWidth="0.8"
            strokeDasharray="4 6"
            style={{ originX: '50px', originY: '50px', filter: `drop-shadow(${glowShadow})` }}
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
          />

          {/* Outer compass dashes (rotates clockwise) */}
          <motion.circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke={accentColor}
            strokeWidth="0.5"
            strokeDasharray="8 12"
            style={{ originX: '50px', originY: '50px' }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 35, ease: 'linear' }}
          />

          {/* Precision Corner Brackets [ ] */}
          <motion.g
            stroke={accentColor}
            strokeWidth="1.2"
            fill="none"
            animate={{
              // Corner brackets expand slightly on hover
              scale: isHovered ? 1.08 : 1,
            }}
            transition={{ type: 'spring', damping: 15 }}
            style={{ originX: '50px', originY: '50px' }}
          >
            {/* Top Left Bracket */}
            <path d="M 22 34 A 36 36 0 0 1 34 22 M 22 34 L 22 28 M 34 22 L 28 22" />
            {/* Top Right Bracket */}
            <path d="M 78 34 A 36 36 0 0 0 66 22 M 78 34 L 78 28 M 66 22 L 72 22" />
            {/* Bottom Left Bracket */}
            <path d="M 22 66 A 36 36 0 0 0 34 78 M 22 66 L 22 72 M 34 78 L 28 78" />
            {/* Bottom Right Bracket */}
            <path d="M 78 66 A 36 36 0 0 1 66 78 M 78 66 L 78 72 M 66 78 L 72 78" />
          </motion.g>

          {/* Precise Cardinal Pointer Ticks */}
          <g stroke={accentColor} strokeWidth="1" fill="none">
            {/* North */}
            <line x1="50" y1="8" x2="50" y2="13" />
            {/* South */}
            <line x1="50" y1="92" x2="50" y2="87" />
            {/* West */}
            <line x1="8" y1="50" x2="13" y2="50" />
            {/* East */}
            <line x1="92" y1="50" x2="87" y2="50" />
          </g>
        </svg>

        {/* Floating Hover Monospace Label inside the Reticle */}
        {cursorText && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="absolute z-10 px-1 py-0.5 rounded font-mono text-[7px] font-bold uppercase tracking-wider"
            style={{
              color: '#1e1e2e',
              backgroundColor: accentColor,
              boxShadow: '0 2px 8px rgba(148, 226, 213, 0.4)',
              top: '70%',
            }}
          >
            {cursorText}
          </motion.div>
        )}
      </motion.div>
    </>
  )
}
