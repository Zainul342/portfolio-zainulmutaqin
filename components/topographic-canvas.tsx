'use client'

import { useEffect, useRef, useState } from 'react'
import { createNoise3D } from 'simplex-noise'

// --- Catppuccin Mocha colors mapped to HSL/RGBA ---
const COLOR_MAUVE     = 'rgba(203, 166, 247, 0.6)'  // #cba6f7 - Peak contour lines
const COLOR_BLUE      = 'rgba(137, 180, 250, 0.35)' // #89b4fa - Mid contour lines
const COLOR_SURFACE   = 'rgba(88, 91, 112, 0.2)'    // #585b70 - Base grid / Low contours
const COLOR_GRID      = 'rgba(49, 50, 68, 0.15)'    // #313244 - Reference coordinate grid
const COLOR_WAYPOINT  = '#a6e3a1'                   // #a6e3a1 - Green active marker
const COLOR_HUD_TEXT  = '#a6adc8'                   // #a6adc8 - Subtext

interface Waypoint {
  id: string
  label: string
  lat: number
  lon: number
  xPercent: number // 0-1 percentage of canvas size
  yPercent: number // 0-1 percentage of canvas size
  description: string
}

const WAYPOINTS: Waypoint[] = [
  {
    id: 'origin',
    label: 'origin.base',
    lat: -6.2088,
    lon: 106.8456,
    xPercent: 0.28,
    yPercent: 0.32,
    description: 'Jakarta (Origin)'
  },
  {
    id: 'terrain',
    label: 'field.work',
    lat: 35.6762,
    lon: 139.6503,
    xPercent: 0.72,
    yPercent: 0.24,
    description: 'Nippon (Terrain)'
  },
  {
    id: 'signal',
    label: 'signal.beacon',
    lat: 51.5074,
    lon: -0.1278,
    xPercent: 0.52,
    yPercent: 0.76,
    description: 'Greenwich (Signal)'
  }
]

export function TopographicCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const [size, setSize] = useState(400)
  const [hoveredWaypoint, setHoveredWaypoint] = useState<Waypoint | null>(null)
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000, active: false })
  const [isMobile, setIsMobile] = useState(false)

  // Stable references for state used in animation loop to prevent dependency recreation
  const stateRef = useRef({
    time: 0,
    mouseGridX: -1,
    mouseGridY: -1,
    mouseInfluence: 0,
    noise3D: createNoise3D(),
    rafId: 0,
  })

  // 1. Handle Sizing & Responsiveness
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateSize = () => {
      const w = window.innerWidth
      const mobile = w < 768
      setIsMobile(mobile)
      
      const width = container.clientWidth
      const height = container.clientHeight
      const side = Math.min(width, height) || 350
      setSize(side)
    }

    updateSize()
    const resizeObserver = new ResizeObserver(updateSize)
    resizeObserver.observe(container)
    window.addEventListener('resize', updateSize)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateSize)
    }
  }, [])

  // 2. Main Render & Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const mediaQuery = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null
    const isReduced = mediaQuery?.matches ?? false
    
    // Grid density configuration
    const cols = isMobile ? 32 : 48
    const rows = isMobile ? 32 : 48
    
    // Contour elevation levels to extract via Marching Squares
    // From valleys (low) to peaks (high)
    const contourLevels = [-0.4, -0.15, 0.1, 0.35, 0.6]

    const loop = () => {
      const W = canvas.width
      const H = canvas.height
      const dpr = window.devicePixelRatio || 1
      const innerSize = size * dpr
      
      // Update dimensions to prevent scaling fuzziness
      if (canvas.width !== innerSize || canvas.height !== innerSize) {
        canvas.width = innerSize
        canvas.height = innerSize
      }

      ctx.clearRect(0, 0, innerSize, innerSize)

      // Time evolution (very slow tectonic movement)
      if (!isReduced) {
        stateRef.current.time += 0.0003
      }

      const t = stateRef.current.time
      const noise = stateRef.current.noise3D

      // --- Draw Reference Grid ---
      ctx.strokeStyle = COLOR_GRID
      ctx.lineWidth = 0.5 * dpr
      const gridCells = 8
      const cellSize = innerSize / gridCells
      
      ctx.beginPath()
      for (let i = 1; i < gridCells; i++) {
        // Vertical grids
        ctx.moveTo(i * cellSize, 0)
        ctx.lineTo(i * cellSize, innerSize)
        // Horizontal grids
        ctx.moveTo(0, i * cellSize)
        ctx.lineTo(innerSize, i * cellSize)
      }
      ctx.stroke()

      // --- Marching Squares Grid Generation ---
      const dx = innerSize / (cols - 1)
      const dy = innerSize / (rows - 1)
      
      // Create a grid of heights
      const grid = new Float32Array(cols * rows)
      
      // Mouse coordinates mapped to 0-1 space on canvas
      const mxNormalized = mousePos.active ? mousePos.x / size : -10
      const myNormalized = mousePos.active ? mousePos.y / size : -10

      for (let r = 0; r < rows; r++) {
        const yNorm = r / (rows - 1)
        const ny = yNorm * 2.8 - 1.4 // Scale for noise sampling
        
        for (let c = 0; c < cols; c++) {
          const xNorm = c / (cols - 1)
          const nx = xNorm * 2.8 - 1.4
          
          // Base procedural noise (multi-frequency octave for organic feel)
          let value = noise(nx, ny, t) * 0.7
          value += noise(nx * 2, ny * 2, t * 1.5) * 0.25
          value += noise(nx * 4, ny * 4, t * 2) * 0.08
          
          // Add organic radial falloff from the center to make it look like an island/mountain peak
          const distFromCenter = Math.sqrt((xNorm - 0.5) ** 2 + (yNorm - 0.5) ** 2)
          const centerFalloff = Math.max(0, 1 - distFromCenter * 1.8)
          value = value * 0.6 + centerFalloff * 0.5 - 0.15

          // Gentle interactive mouse warping (gravitational pull/elevation increase)
          if (mousePos.active) {
            const distToMouse = Math.sqrt((xNorm - mxNormalized) ** 2 + (yNorm - myNormalized) ** 2)
            if (distToMouse < 0.24) {
              const influence = Math.exp(-((distToMouse * 4) ** 2)) * 0.45
              value += influence
            }
          }
          
          grid[r * cols + c] = value
        }
      }

      // Helper function to linearly interpolate coordinates on cell edges
      const getLerpedPoint = (x0: number, y0: number, x1: number, y1: number, v0: number, v1: number, threshold: number) => {
        if (Math.abs(v0 - v1) < 1e-6) return { x: (x0 + x1) / 2, y: (y0 + y1) / 2 }
        const p = (threshold - v0) / (v1 - v0)
        return {
          x: x0 + p * (x1 - x0),
          y: y0 + p * (y1 - y0)
        }
      }

      // --- Marching Squares Iso-contour extraction ---
      contourLevels.forEach((level, levelIdx) => {
        // Style selection based on height level
        if (levelIdx === contourLevels.length - 1) {
          ctx.strokeStyle = COLOR_MAUVE
          ctx.lineWidth = 1.0 * dpr
        } else if (levelIdx >= 2) {
          ctx.strokeStyle = COLOR_BLUE
          ctx.lineWidth = 0.75 * dpr
        } else {
          ctx.strokeStyle = COLOR_SURFACE
          ctx.lineWidth = 0.5 * dpr
        }

        ctx.beginPath()

        for (let r = 0; r < rows - 1; r++) {
          for (let c = 0; c < cols - 1; c++) {
            // Corners coordinate
            const x0 = c * dx
            const x1 = (c + 1) * dx
            const y0 = r * dy
            const y1 = (r + 1) * dy

            // Corner heights
            const v0 = grid[r * cols + c]       // top-left
            const v1 = grid[r * cols + (c + 1)] // top-right
            const v2 = grid[(r + 1) * cols + (c + 1)] // bottom-right
            const v3 = grid[(r + 1) * cols + c] // bottom-left

            // Classify corners
            let index = 0
            if (v0 >= level) index |= 8
            if (v1 >= level) index |= 4
            if (v2 >= level) index |= 2
            if (v3 >= level) index |= 1

            if (index === 0 || index === 15) continue

            // Compute edge points
            const pt = getLerpedPoint(x0, y0, x1, y0, v0, v1, level) // top
            const pr = getLerpedPoint(x1, y0, x1, y1, v1, v2, level) // right
            const pb = getLerpedPoint(x0, y1, x1, y1, v3, v2, level) // bottom
            const pl = getLerpedPoint(x0, y0, x0, y1, v0, v3, level) // left

            switch (index) {
              case 1:  // bottom-left
              case 14: // top-left + top-right + bottom-right
                ctx.moveTo(pl.x, pl.y); ctx.lineTo(pb.x, pb.y)
                break
              case 2:  // bottom-right
              case 13: // top-left + top-right + bottom-left
                ctx.moveTo(pb.x, pb.y); ctx.lineTo(pr.x, pr.y)
                break
              case 3:  // bottom-left + bottom-right
              case 12: // top-left + top-right
                ctx.moveTo(pl.x, pl.y); ctx.lineTo(pr.x, pr.y)
                break
              case 4:  // top-right
              case 11: // top-left + bottom-right + bottom-left
                ctx.moveTo(pt.x, pt.y); ctx.lineTo(pr.x, pr.y)
                break
              case 5:  // top-right + bottom-left (saddle)
                ctx.moveTo(pt.x, pt.y); ctx.lineTo(pl.x, pl.y)
                ctx.moveTo(pb.x, pb.y); ctx.lineTo(pr.x, pr.y)
                break
              case 6:  // top-right + bottom-right
              case 9:  // top-left + bottom-left
                ctx.moveTo(pt.x, pt.y); ctx.lineTo(pb.x, pb.y)
                break
              case 7:  // all except top-left
              case 8:  // top-left only
                ctx.moveTo(pt.x, pt.y); ctx.lineTo(pl.x, pl.y)
                break
              case 10: // top-left + bottom-right (saddle)
                ctx.moveTo(pt.x, pt.y); ctx.lineTo(pr.x, pr.y)
                ctx.moveTo(pl.x, pl.y); ctx.lineTo(pb.x, pb.y)
                break
            }
          }
        }
        ctx.stroke()
      })

      // --- Apply Radial Mask to Fade Grid and Contours at Edges ---
      ctx.save()
      ctx.globalCompositeOperation = 'destination-in'
      const maskGrad = ctx.createRadialGradient(
        innerSize / 2,
        innerSize / 2,
        0,
        innerSize / 2,
        innerSize / 2,
        innerSize / 2
      )
      maskGrad.addColorStop(0, 'rgba(0,0,0,1)')
      maskGrad.addColorStop(0.5, 'rgba(0,0,0,0.85)')
      maskGrad.addColorStop(0.82, 'rgba(0,0,0,0.2)')
      maskGrad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = maskGrad
      ctx.beginPath()
      ctx.arc(innerSize / 2, innerSize / 2, innerSize / 2, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // --- Draw Waypoint Nodes and Beacons ---
      WAYPOINTS.forEach((wp) => {
        const wx = wp.xPercent * innerSize
        const wy = wp.yPercent * innerSize
        
        // Hover state calculations
        const distanceToMouse = mousePos.active
          ? Math.sqrt((mousePos.x * dpr - wx) ** 2 + (mousePos.y * dpr - wy) ** 2)
          : Infinity
        
        const isWpHovered = distanceToMouse < 24 * dpr
        
        // Pulsing animation for the ring
        const timeScale = performance.now() / 1000
        const pulse = 0.5 + 0.5 * Math.sin(timeScale * 3.5 + wp.xPercent * 10)
        
        // Draw active pulsing radar rings
        ctx.beginPath()
        const ringRadius = (isWpHovered ? 14 : 7) * dpr + pulse * 4 * dpr
        ctx.arc(wx, wy, ringRadius, 0, Math.PI * 2)
        ctx.strokeStyle = isWpHovered ? COLOR_WAYPOINT : COLOR_MAUVE
        ctx.lineWidth = 0.8 * dpr
        ctx.stroke()

        // Draw solid center dot
        ctx.beginPath()
        ctx.arc(wx, wy, (isWpHovered ? 4.5 : 2.5) * dpr, 0, Math.PI * 2)
        ctx.fillStyle = isWpHovered ? COLOR_WAYPOINT : COLOR_MAUVE
        ctx.fill()

        // Render waypoint HUD label directly inside the canvas
        ctx.fillStyle = isWpHovered ? COLOR_WAYPOINT : COLOR_HUD_TEXT
        ctx.font = `${isWpHovered ? 'bold' : 'normal'} ${9 * dpr}px var(--font-mono)`
        ctx.fillText(`// ${wp.label}`, wx + 10 * dpr, wy + 3 * dpr)
      })

      // --- Draw Signal Beacon Tracks ---
      // Subtle glowing arcs connecting the waypoints
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(203, 166, 247, 0.12)'
      ctx.lineWidth = 0.8 * dpr
      ctx.setLineDash([4 * dpr, 6 * dpr]) // Dotted line effect
      
      const p1 = WAYPOINTS[0] // origin
      const p2 = WAYPOINTS[1] // terrain
      const p3 = WAYPOINTS[2] // signal

      ctx.moveTo(p1.xPercent * innerSize, p1.yPercent * innerSize)
      ctx.lineTo(p2.xPercent * innerSize, p2.yPercent * innerSize)
      ctx.lineTo(p3.xPercent * innerSize, p3.yPercent * innerSize)
      ctx.closePath()
      ctx.stroke()
      ctx.setLineDash([]) // Reset dash pattern

      stateRef.current.rafId = requestAnimationFrame(loop)
    }

    loop()

    return () => {
      cancelAnimationFrame(stateRef.current.rafId)
    }
  }, [size, mousePos, isMobile])

  // 3. Coordinate Tracking for Hover Tooltips & Interactions
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setMousePos({ x, y, active: true })

    // Check if close to any waypoint to show tooltip
    let activeWp: Waypoint | null = null
    WAYPOINTS.forEach((wp) => {
      const wx = wp.xPercent * size
      const wy = wp.yPercent * size
      const dist = Math.sqrt((x - wx) ** 2 + (y - wy) ** 2)
      if (dist < 20) {
        activeWp = wp
      }
    })
    setHoveredWaypoint(activeWp)
  }

  const handleMouseLeave = () => {
    setMousePos({ x: -1000, y: -1000, active: false })
    setHoveredWaypoint(null)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas || e.touches.length === 0) return
    const rect = canvas.getBoundingClientRect()
    const x = e.touches[0].clientX - rect.left
    const y = e.touches[0].clientY - rect.top
    setMousePos({ x, y, active: true })
    
    let activeWp: Waypoint | null = null
    WAYPOINTS.forEach((wp) => {
      const wx = wp.xPercent * size
      const wy = wp.yPercent * size
      const dist = Math.sqrt((x - wx) ** 2 + (y - wy) ** 2)
      if (dist < 25) {
        activeWp = wp
      }
    })
    setHoveredWaypoint(activeWp)
  }

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full min-h-[300px] flex flex-col items-center justify-center select-none"
    >
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseLeave}
        className="transition-all duration-300 hover:scale-[1.01]"
        style={{ width: size, height: size, cursor: 'none', touchAction: 'none' }}
        aria-label="Interactive procedural topographic map of portfolio terrains"
        role="img"
      />

      {/* Premium Floating Overlay HUD for Hovered Waypoints */}
      <div 
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-[85%] max-w-[280px] bg-ctp-mantle/85 backdrop-blur-md border border-ctp-surface1 rounded-md p-3 font-mono text-[10px] text-ctp-text pointer-events-none transition-all duration-300 flex flex-col gap-1.5 shadow-xl ${
          hoveredWaypoint ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'
        }`}
      >
        {hoveredWaypoint && (
          <>
            <div className="flex justify-between border-b border-ctp-surface0 pb-1">
              <span className="text-ctp-mauve font-bold">{hoveredWaypoint.description}</span>
              <span className="text-ctp-green font-semibold">SIGNAL: OK</span>
            </div>
            <div className="flex flex-col gap-0.5 text-ctp-subtext0">
              <div className="flex justify-between">
                <span>LATITUDE:</span>
                <span>{hoveredWaypoint.lat.toFixed(4)}° N</span>
              </div>
              <div className="flex justify-between">
                <span>LONGITUDE:</span>
                <span>{hoveredWaypoint.lon.toFixed(4)}° E</span>
              </div>
              <div className="flex justify-between">
                <span>ELEVATION:</span>
                <span>{Math.round(452 + (hoveredWaypoint.xPercent * 230))} m</span>
              </div>
            </div>
            <div className="text-[9px] text-ctp-overlay0 text-center mt-1 border-t border-ctp-surface0 pt-1">
              QUIET CARTOGRAPHY OS v2 // ACTIVE
            </div>
          </>
        )}
      </div>

      {/* Permanent visual cues indicating interaction capability */}
      <div className="absolute top-2 right-2 font-mono text-[9px] text-ctp-surface2 pointer-events-none uppercase tracking-wider flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-ctp-mauve animate-pulse" />
        procedural contour field (noise3d)
      </div>
    </div>
  )
}
