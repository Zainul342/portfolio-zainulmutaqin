'use client'

import { useEffect, useRef, useState } from 'react'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [hovering, setHovering] = useState(false)
  const posRef = useRef({ x: -100, y: -100 })
  const ringPosRef = useRef({ x: -100, y: -100 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY }
    }

    const loop = () => {
      const dot = dotRef.current
      const ring = ringRef.current
      if (dot) {
        dot.style.transform = `translate(${posRef.current.x - 4}px, ${posRef.current.y - 4}px)`
      }
      if (ring) {
        ringPosRef.current.x += (posRef.current.x - ringPosRef.current.x) * 0.18
        ringPosRef.current.y += (posRef.current.y - ringPosRef.current.y) * 0.18
        ring.style.transform = `translate(${ringPosRef.current.x - 16}px, ${ringPosRef.current.y - 16}px)`
      }
      rafRef.current = requestAnimationFrame(loop)
    }

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isClickable = target.closest('a, button, [role="option"], input, textarea, select, [data-clickable]')
      setHovering(!!isClickable)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <>
      {/* Outer ring */}
      <div
        ref={ringRef}
        className="cursor-dot"
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: `1.5px solid ${hovering ? '#cba6f7' : 'rgba(203,166,247,0.4)'}`,
          transition: 'border-color 0.15s, width 0.15s, height 0.15s',
          transform: 'translate(-100px, -100px)',
          ...(hovering ? { width: 40, height: 40 } : {}),
        }}
        aria-hidden="true"
      />
      {/* Inner dot */}
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: hovering ? '#cba6f7' : '#a6adc8',
          transition: 'background-color 0.15s, transform 0.05s',
          transform: 'translate(-100px, -100px)',
        }}
        aria-hidden="true"
      />
    </>
  )
}
