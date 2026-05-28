'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

// --- Catppuccin Mocha palette ---
const CLR_GRID        = 'rgba(108, 112, 134, 0.25)' // #6c7086 — Lat/Lon background lines
const CLR_GRID_FRONT  = 'rgba(203, 166, 247, 0.45)' // #cba6f7 — Lat/Lon foreground lines
const CLR_ORBIT       = 'rgba(137, 180, 250, 0.2)'  // #89b4fa — Dotted orbit tracks
const CLR_PACKET      = '#89b4fa'                   // blue — Glowing orbit packets
const CLR_MARKER      = '#a6e3a1'                   // green — Active target marker
const CLR_GLOW        = 'rgba(203, 166, 247, 0.15)' // mauve — Sphere atmosphere glow
const CLR_SPHERE_BG   = 'rgba(24, 24, 37, 0.45)'    // mantle — Sphere dark glass backing

// Jakarta coordinates
const JAKARTA_LAT = -6.2088
const JAKARTA_LON = 106.8456

const DEG = Math.PI / 180

function latLonToXYZ(lat: number, lon: number, r: number): [number, number, number] {
  const phi = (90 - lat) * DEG
  const theta = lon * DEG
  return [
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  ]
}

// Project a 3-D point onto 2-D canvas given Y and X rotations
function project(
  x: number,
  y: number,
  z: number,
  rotY: number,
  rotX: number,
  cx: number,
  cy: number,
): [number, number, number] /* [sx, sy, depth] */ {
  // Rotate around Y axis
  const cosY = Math.cos(rotY),
    sinY = Math.sin(rotY)
  const x1 = x * cosY + z * sinY
  const z1 = -x * sinY + z * cosY

  // Rotate around X axis
  const cosX = Math.cos(rotX),
    sinX = Math.sin(rotX)
  const y2 = y * cosX - z1 * sinX
  const z2 = y * sinX + z1 * cosX

  return [cx + x1, cy + y2, z2]
}

// Helper to get tilted orbit coordinates
function getOrbitXYZ(angle: number, tilt: number, r: number): [number, number, number] {
  const x = r * Math.cos(angle)
  const z = r * Math.sin(angle)
  const cosT = Math.cos(tilt),
    sinT = Math.sin(tilt)
  // Rotate on Z-axis to apply orbit tilt
  return [x * cosT, x * sinT, z]
}

interface GlobeCanvasProps {
  className?: string
}

export function GlobeCanvas({ className = '' }: GlobeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState(300)
  const [isMobile, setIsMobile] = useState(false)

  const stateRef = useRef({
    rotY: (180 - JAKARTA_LON) * DEG, // Face Jakarta towards viewer at start
    rotX: JAKARTA_LAT * DEG * 0.4,
    velY: 0,
    velX: 0,
    dragging: false,
    lastMX: 0,
    lastMY: 0,
    paused: false,
    raf: 0,
  })

  // Measure container dimensions
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateSizing = () => {
      const w = window.innerWidth
      setIsMobile(w < 768)

      const width = container.clientWidth
      const height = container.clientHeight
      const side = Math.min(width, height) || 300
      setSize(side)
    }

    updateSizing()
    const observer = new ResizeObserver(updateSizing)
    observer.observe(container)
    window.addEventListener('resize', updateSizing)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateSizing)
    }
  }, [])

  const drawRef = useRef<() => void>(() => {})

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = canvas.width
    const H = canvas.height
    const dpr = window.devicePixelRatio || 1
    const r = (size / 2) * dpr * 0.94
    const cx = W / 2
    const cy = H / 2
    const s = stateRef.current
    const t = performance.now() / 1000

    ctx.clearRect(0, 0, W, H)

    // 1. Atmosphere radial gradient backing
    const glowR = r * 1.14
    const atmosphereGrad = ctx.createRadialGradient(cx, cy, r * 0.9, cx, cy, glowR)
    atmosphereGrad.addColorStop(0, CLR_GLOW)
    atmosphereGrad.addColorStop(1, 'rgba(203, 166, 247, 0)')
    ctx.beginPath()
    ctx.arc(cx, cy, glowR, 0, Math.PI * 2)
    ctx.fillStyle = atmosphereGrad
    ctx.fill()

    // 2. Dark glass-like sphere base backing
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fillStyle = CLR_SPHERE_BG
    ctx.fill()

    // 3. Render Lat/Lon wireframe lines
    // We split rendering into back-face and front-face lines to create a perfect depth illusion
    const steps = isMobile ? 8 : 12 // meridian/parallel frequency
    const pointStep = isMobile ? 8 : 4 // drawing resolution

    const drawGridLines = (drawBack: boolean) => {
      ctx.lineWidth = drawBack ? 0.35 * dpr : 0.65 * dpr
      
      // Latitude Parallels
      for (let i = 1; i < steps; i++) {
        const lat = -90 + (180 / steps) * i
        ctx.beginPath()
        let first = true
        
        for (let lon = -180; lon <= 180; lon += pointStep) {
          const [gx, gy, gz] = project(...latLonToXYZ(lat, lon, r), s.rotY, s.rotX, cx, cy)
          
          const isFront = gz >= 0
          if (drawBack && isFront) { first = true; continue }
          if (!drawBack && !isFront) { first = true; continue }

          if (first) {
            ctx.moveTo(gx, gy)
            first = false
          } else {
            ctx.lineTo(gx, gy)
          }
        }
        ctx.strokeStyle = drawBack ? CLR_GRID : CLR_GRID_FRONT
        ctx.stroke()
      }

      // Longitude Meridians
      for (let i = 0; i < steps; i++) {
        const lon = -180 + (360 / steps) * i
        ctx.beginPath()
        let first = true

        for (let lat = -90; lat <= 90; lat += pointStep) {
          const [gx, gy, gz] = project(...latLonToXYZ(lat, lon, r), s.rotY, s.rotX, cx, cy)

          const isFront = gz >= 0
          if (drawBack && isFront) { first = true; continue }
          if (!drawBack && !isFront) { first = true; continue }

          if (first) {
            ctx.moveTo(gx, gy)
            first = false
          } else {
            ctx.lineTo(gx, gy)
          }
        }
        ctx.strokeStyle = drawBack ? CLR_GRID : CLR_GRID_FRONT
        ctx.stroke()
      }
    };

    // Draw grid back-face (behind sphere)
    drawGridLines(true)

    // 4. Draw tilted orbital telemetry track paths
    const orbits = [
      { tilt: 28 * DEG, speed: 0.8, offset: 0 },
      { tilt: -35 * DEG, speed: -0.6, offset: Math.PI / 2 },
      { tilt: 72 * DEG, speed: 1.1, offset: Math.PI },
    ]

    orbits.forEach((orbit, oIdx) => {
      // Draw complete orbit track
      ctx.beginPath()
      ctx.strokeStyle = CLR_ORBIT
      ctx.lineWidth = 0.5 * dpr
      ctx.setLineDash([3 * dpr, 5 * dpr])
      
      let first = true
      for (let angle = 0; angle <= Math.PI * 2 + 0.1; angle += 0.05) {
        const [ox, oy, oz] = project(...getOrbitXYZ(angle, orbit.tilt, r * 1.02), s.rotY, s.rotX, cx, cy)
        
        if (first) {
          ctx.moveTo(ox, oy)
          first = false
        } else {
          ctx.lineTo(ox, oy)
        }
      }
      ctx.stroke()
      ctx.setLineDash([])

      // Draw sliding packet tracer along the orbit
      const packetAngle = t * orbit.speed + orbit.offset
      const [px, py, pz] = project(...getOrbitXYZ(packetAngle, orbit.tilt, r * 1.02), s.rotY, s.rotX, cx, cy)
      const pFront = pz >= 0

      if (pFront) {
        // Outer glow
        ctx.beginPath()
        ctx.arc(px, py, 4 * dpr, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(137, 180, 250, 0.3)`
        ctx.fill()
        
        // Inner core
        ctx.beginPath()
        ctx.arc(px, py, 2 * dpr, 0, Math.PI * 2)
        ctx.fillStyle = CLR_PACKET
        ctx.fill()
      }
    })

    // Draw grid front-face (in front of sphere backing)
    drawGridLines(false)

    // 5. Draw Target Marker (Jakarta, ID)
    const [jx, jy, jz] = project(...latLonToXYZ(JAKARTA_LAT, JAKARTA_LON, r), s.rotY, s.rotX, cx, cy)
    const isMarkerFront = jz >= 0

    if (isMarkerFront) {
      // Pulse telemetry circles
      const pulse = 0.5 + 0.5 * Math.sin(t * 3.5)
      
      ctx.beginPath()
      ctx.arc(jx, jy, 8 * dpr + pulse * 4 * dpr, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(166, 227, 161, ${0.4 - pulse * 0.3})`
      ctx.lineWidth = 0.8 * dpr
      ctx.stroke()

      // Core point
      ctx.beginPath()
      ctx.arc(jx, jy, 2.5 * dpr, 0, Math.PI * 2)
      ctx.fillStyle = CLR_MARKER
      ctx.fill()

      // Monospace label coordinates
      ctx.fillStyle = CLR_MARKER
      ctx.font = `bold ${8 * dpr}px var(--font-mono)`
      ctx.fillText(`TARGET: JAKARTA`, jx + 8 * dpr, jy - 3 * dpr)
      ctx.fillStyle = 'rgba(205, 214, 244, 0.65)'
      ctx.font = `${6.5 * dpr}px var(--font-mono)`
      ctx.fillText(`${JAKARTA_LAT.toFixed(4)}S, ${JAKARTA_LON.toFixed(4)}E`, jx + 8 * dpr, jy + 5 * dpr)
    }

    // 6. Draw clean outer aesthetic frame ring
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(108, 112, 134, 0.4)'
    ctx.lineWidth = 0.8 * dpr
    ctx.stroke()

  }, [size, isMobile])

  drawRef.current = draw

  // Animation ticks
  useEffect(() => {
    const s = stateRef.current
    const mediaQuery = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null
    const AUTO_SPEED = mediaQuery?.matches ? 0 : (2 * Math.PI) / 45000 // slow spin every 45s

    let last = 0
    const loop = (ts: number) => {
      const dt = ts - last
      last = ts

      if (!s.paused && !s.dragging) {
        s.rotY += AUTO_SPEED * dt
      }

      if (!s.dragging) {
        s.velY *= 0.92
        s.velX *= 0.92
        s.rotY += s.velY
        s.rotX += s.velX
        // Clamp latitude tilt
        s.rotX = Math.max(-0.45, Math.min(0.45, s.rotX))
      }

      drawRef.current()
      s.raf = requestAnimationFrame(loop)
    }
    s.raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(s.raf)
  }, [])

  // Grab & drag listener binding
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const s = stateRef.current
    const effectiveDpr = isMobile ? Math.min(window.devicePixelRatio || 1, 1.5) : (window.devicePixelRatio || 1)

    const onPointerDown = (e: PointerEvent) => {
      s.dragging = true
      s.paused = true
      s.velY = 0
      s.velX = 0
      s.lastMX = e.clientX
      s.lastMY = e.clientY
      canvas.setPointerCapture(e.pointerId)
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!s.dragging) return
      const dx = e.clientX - s.lastMX
      const dy = e.clientY - s.lastMY
      s.lastMX = e.clientX
      s.lastMY = e.clientY

      const sensitivity = (Math.PI / (size * effectiveDpr)) * 1.8
      s.rotY += dx * sensitivity
      s.rotX += dy * sensitivity
      s.rotX = Math.max(-0.45, Math.min(0.45, s.rotX))

      drawRef.current()
    }

    const onPointerUp = (e: PointerEvent) => {
      if (!s.dragging) return
      s.dragging = false
      canvas.releasePointerCapture(e.pointerId)
      s.paused = false
    }

    const onPointerCancel = (e: PointerEvent) => {
      if (!s.dragging) return
      s.dragging = false
      canvas.releasePointerCapture(e.pointerId)
      s.paused = false
    }

    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('pointercancel', onPointerCancel)
    
    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointercancel', onPointerCancel)
    }
  }, [size, isMobile])

  const dpr = typeof window !== 'undefined'
    ? (isMobile ? Math.min(window.devicePixelRatio || 1, 1.5) : (window.devicePixelRatio || 1))
    : 1
  const canvasPx = size * dpr

  return (
    <div ref={containerRef} className="w-full h-full min-h-[250px] flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={canvasPx}
        height={canvasPx}
        className={className}
        style={{ width: size, height: size, cursor: 'grab', touchAction: 'none' }}
        aria-label="Interactive 3D wireframe telemetry globe"
        role="img"
      />
    </div>
  )
}
