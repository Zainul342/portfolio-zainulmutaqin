'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

// --- Catppuccin Mocha palette ---
const CLR_GRID       = 'rgba(69, 71, 90, 0.55)'    // #45475a  — lat/lon grid lines
const CLR_LAND       = '#cba6f7'                    // mauve    — continent dots
const CLR_LAND_BACK  = 'rgba(203,166,247,0.18)'    // mauve dim — far-side dots
const CLR_MARKER     = '#a6e3a1'                    // green    — Jakarta
const CLR_GLOW       = 'rgba(203,166,247,0.13)'    // atmosphere glow
const CLR_SPHERE_BG  = 'rgba(30,30,46,0.55)'       // dark fill

// Jakarta coordinates
const JAKARTA_LAT = -6.2088
const JAKARTA_LON = 106.8456

// ---- Simplified continent land-dots (lat/lon pairs) -------------------------
// Each entry is [lat, lon]. Packed as a flat number[] for perf.
function buildLandDots(): [number, number][] {
  const dots: [number, number][] = []

  // Helper: fill a bounding box with a coast/fill mask function
  const fill = (
    latMin: number, latMax: number,
    lonMin: number, lonMax: number,
    step: number,
    mask?: (lat: number, lon: number) => boolean,
  ) => {
    for (let lat = latMin; lat <= latMax; lat += step) {
      for (let lon = lonMin; lon <= lonMax; lon += step) {
        if (!mask || mask(lat, lon)) dots.push([lat, lon])
      }
    }
  }

  const s = 4 // base grid step (degrees)

  // --- North America ---
  fill(25, 70, -165, -55, s, (la, lo) => {
    // Rough coast mask
    if (la > 60 && lo < -140) return true          // Alaska
    if (la > 55 && lo > -145 && lo < -60) return true // Canada
    if (la > 42 && la < 55 && lo > -130 && lo < -65) return true
    if (la > 25 && la < 50 && lo > -118 && lo < -65) return true
    if (la > 15 && la < 32 && lo > -118 && lo < -80) return true
    return false
  })

  // --- Central America / Caribbean ---
  fill(7, 22, -95, -60, s)

  // --- South America ---
  fill(-55, 12, -82, -35, s, (la, lo) => {
    if (la > -5 && lo < -50) return true
    if (la > -20 && la <= -5 && lo > -75 && lo < -35) return true
    if (la > -40 && la <= -20 && lo > -72 && lo < -38) return true
    if (la <= -40 && lo > -75 && lo < -55) return true
    return false
  })

  // --- Europe ---
  fill(36, 70, -10, 30, s, (la, lo) => {
    if (la > 55 && lo > 5 && lo < 30) return true  // Scandinavia
    if (la > 45 && la < 58 && lo > -8 && lo < 22) return true
    if (la > 36 && la < 48 && lo > -10 && lo < 28) return true
    return false
  })

  // UK
  fill(50, 59, -6, 2, s)

  // Iceland
  fill(63, 66, -24, -14, s)

  // --- Africa ---
  fill(-35, 37, -18, 52, s, (la, lo) => {
    if (la > 20 && lo > -18 && lo < 38) return true          // North Africa
    if (la > 0 && la <= 20 && lo > -18 && lo < 50) return true
    if (la > -20 && la <= 0 && lo > 10 && lo < 50) return true
    if (la > -35 && la <= -20 && lo > 12 && lo < 38) return true
    return false
  })

  // Madagascar
  fill(-26, -12, 43, 51, s)

  // --- Asia (Russia/Eurasia) ---
  fill(50, 75, 30, 180, s, (la, lo) => {
    if (la > 60 && lo > 60 && lo < 180) return true
    if (la > 50 && la <= 65 && lo > 30 && lo < 135) return true
    return false
  })

  // Middle East / Arabian Peninsula
  fill(12, 38, 36, 60, s)

  // Indian Subcontinent
  fill(8, 34, 68, 90, s)

  // Southeast Asia (mainland)
  fill(1, 26, 92, 110, s)

  // Indonesia (Java, Sumatra, Borneo, etc.)
  fill(-8, 6, 95, 141, s, (la, lo) => {
    // Sumatra
    if (la > -6 && la < 5 && lo > 95 && lo < 108) return true
    // Java
    if (la > -8 && la < -5 && lo > 105 && lo < 116) return true
    // Borneo
    if (la > -4 && la < 7 && lo > 108 && lo < 118) return true
    // Sulawesi
    if (la > -4 && la < 2 && lo > 119 && lo < 125) return true
    // Papua
    if (la > -8 && la < 0 && lo > 130 && lo < 141) return true
    return false
  })

  // Philippines
  fill(5, 20, 117, 127, s)

  // China / East Asia
  fill(20, 50, 100, 135, s, (la, lo) => {
    if (la > 35 && lo > 73 && lo < 135) return true
    if (la > 20 && la <= 35 && lo > 100 && lo < 122) return true
    return false
  })

  // Japan
  fill(30, 45, 130, 145, s)
  // Taiwan
  fill(22, 25, 120, 122, s)
  // Sri Lanka
  fill(6, 10, 80, 82, s)

  // --- Australia ---
  fill(-40, -11, 114, 154, s, (la, lo) => {
    if (la > -34 && la < -12 && lo > 114 && lo < 154) return true
    if (la <= -34 && lo > 115 && lo < 148) return true
    return false
  })

  // New Zealand
  fill(-46, -34, 166, 178, s)

  // Greenland
  fill(60, 84, -54, -18, s)

  return dots
}

// ---- Math helpers -----------------------------------------------------------
const DEG = Math.PI / 180

function latLonToXYZ(lat: number, lon: number, r: number): [number, number, number] {
  const phi  = (90 - lat) * DEG
  const theta = lon * DEG
  return [
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  ]
}

// Project a 3-D point onto 2-D canvas given rotation angles
function project(
  x: number, y: number, z: number,
  rotY: number, rotX: number,
  cx: number, cy: number,
): [number, number, number] /* [sx, sy, depth] */ {
  // Rotate around Y axis
  const cosY = Math.cos(rotY), sinY = Math.sin(rotY)
  const x1 = x * cosY + z * sinY
  const z1 = -x * sinY + z * cosY

  // Rotate around X axis
  const cosX = Math.cos(rotX), sinX = Math.sin(rotX)
  const y2 = y * cosX - z1 * sinX
  const z2 = y * sinX + z1 * cosX

  return [cx + x1, cy + y2, z2]
}

const LAND_DOTS = buildLandDots()
const LAND_DOTS_MOBILE = LAND_DOTS.filter((_, index) => index % 2 === 0)

// ---- Component --------------------------------------------------------------
interface GlobeCanvasProps {
  size?: number
  className?: string
}

export function GlobeCanvas({ size = 400, className = '' }: GlobeCanvasProps) {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const stateRef   = useRef({
    rotY:    (180 - JAKARTA_LON) * DEG,  // start so Jakarta faces viewer
    rotX:    JAKARTA_LAT * DEG * 0.4,
    velY:    0,
    velX:    0,
    dragging: false,
    lastMX:  0,
    lastMY:  0,
    paused:  false,
    raf:     0,
  })

  useEffect(() => {
    const updateIsMobile = () => {
      if (typeof window === 'undefined') return
      setIsMobile(window.innerWidth < 768)
    }

    updateIsMobile()
    window.addEventListener('resize', updateIsMobile)
    return () => window.removeEventListener('resize', updateIsMobile)
  }, [])

  // Canonical render function stored in ref so event handlers always get fresh
  const drawRef = useRef<() => void>(() => {})

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = canvas.width
    const H = canvas.height
    const dpr = window.devicePixelRatio || 1
    const r   = (size / 2) * dpr * 0.96
    const cx  = W / 2
    const cy  = H / 2
    const s   = stateRef.current

    ctx.clearRect(0, 0, W, H)

    // ---- Atmosphere glow ----
    const glowR = r * 1.18
    const grad = ctx.createRadialGradient(cx, cy, r * 0.92, cx, cy, glowR)
    grad.addColorStop(0, CLR_GLOW)
    grad.addColorStop(1, 'rgba(203,166,247,0)')
    ctx.beginPath()
    ctx.arc(cx, cy, glowR, 0, Math.PI * 2)
    ctx.fillStyle = grad
    ctx.fill()

    // ---- Sphere base ----
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fillStyle = CLR_SPHERE_BG
    ctx.fill()

    // ---- Clip to sphere ----
    ctx.save()
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.clip()

    // ---- Lat/Lon grid ----
    ctx.strokeStyle = CLR_GRID
    ctx.lineWidth = 0.6

    const pointStep = isMobile ? 6 : 3
    const dots = isMobile ? LAND_DOTS_MOBILE : LAND_DOTS

    // Latitude lines every 30°
    for (let lat = -60; lat <= 60; lat += 30) {
      ctx.beginPath()
      let first = true
      for (let lon = -180; lon <= 180; lon += pointStep) {
        const [gx, gy, gz] = project(...latLonToXYZ(lat, lon, r), s.rotY, s.rotX, cx, cy)
        if (gz < 0) { first = true; continue }
        if (first) { ctx.moveTo(gx, gy); first = false }
        else ctx.lineTo(gx, gy)
      }
      ctx.stroke()
    }

    // Longitude lines every 30°
    for (let lon = -180; lon < 180; lon += 30) {
      ctx.beginPath()
      let first = true
      for (let lat = -90; lat <= 90; lat += pointStep) {
        const [gx, gy, gz] = project(...latLonToXYZ(lat, lon, r), s.rotY, s.rotX, cx, cy)
        if (gz < 0) { first = true; continue }
        if (first) { ctx.moveTo(gx, gy); first = false }
        else ctx.lineTo(gx, gy)
      }
      ctx.stroke()
    }

    ctx.restore()

    // ---- Sphere outline ring ----
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(69,71,90,0.7)'
    ctx.lineWidth = 1.2
    ctx.stroke()

    // ---- Land dots ----
    const dotR = Math.max(1.5, r / 95) * dpr * 0.6
    for (const [lat, lon] of dots) {
      const [dx, dy, dz] = project(...latLonToXYZ(lat, lon, r), s.rotY, s.rotX, cx, cy)
      // Cull points outside sphere (edge guard)
      const distSq = (dx - cx) ** 2 + (dy - cy) ** 2
      if (distSq > r * r) continue

      const isFront = dz >= 0
      ctx.beginPath()
      ctx.arc(dx, dy, dotR, 0, Math.PI * 2)
      ctx.fillStyle = isFront ? CLR_LAND : CLR_LAND_BACK
      ctx.fill()
    }

    // ---- Jakarta marker ----
    const [jx, jy, jz] = project(
      ...latLonToXYZ(JAKARTA_LAT, JAKARTA_LON, r),
      s.rotY, s.rotX, cx, cy,
    )
    const jDistSq = (jx - cx) ** 2 + (jy - cy) ** 2
    if (jz >= 0 && jDistSq < r * r) {
      // Outer pulse ring — driven by time for CSS-free animation
      const t  = performance.now() / 1000
      const pulse = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * 2.5))
      const pulseR = (r / 28) * (1.5 + pulse)
      ctx.beginPath()
      ctx.arc(jx, jy, pulseR, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(166,227,161,${0.15 * pulse})`
      ctx.fill()
      // Middle ring
      ctx.beginPath()
      ctx.arc(jx, jy, r / 32, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(166,227,161,${0.35 + 0.15 * pulse})`
      ctx.fill()
      // Core dot
      ctx.beginPath()
      ctx.arc(jx, jy, r / 55, 0, Math.PI * 2)
      ctx.fillStyle = CLR_MARKER
      ctx.fill()
    }
  }, [size, isMobile])

  drawRef.current = draw

  // ---- Animation loop ----
  useEffect(() => {
    const s = stateRef.current
    const AUTO_SPEED = (2 * Math.PI) / 35000  // full rotation every ~35s

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
        // Clamp X tilt
        s.rotX = Math.max(-0.45, Math.min(0.45, s.rotX))
      }

      drawRef.current()
      s.raf = requestAnimationFrame(loop)
    }
    s.raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(s.raf)
  }, [])

  // ---- Pointer interactions ----
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const s = stateRef.current
    const effectiveDpr = isMobile ? Math.min(window.devicePixelRatio || 1, 1.5) : (window.devicePixelRatio || 1)

    const onPointerDown = (e: PointerEvent) => {
      s.dragging = true
      s.paused   = true
      s.velY     = 0
      s.velX     = 0
      s.lastMX   = e.clientX
      s.lastMY   = e.clientY
      canvas.setPointerCapture(e.pointerId)
    }
    const onPointerMove = (e: PointerEvent) => {
      if (!s.dragging) return
      const dx = e.clientX - s.lastMX
      const dy = e.clientY - s.lastMY
      const sensitivity = (Math.PI / (size * effectiveDpr)) * (isMobile ? 2.4 : 1.8)
      s.velY  = dx * sensitivity
      s.velX  = dy * sensitivity
      s.rotY += s.velY
      s.rotX  = Math.max(-0.45, Math.min(0.45, s.rotX + s.velX))
      s.lastMX = e.clientX
      s.lastMY = e.clientY
    }
    const onPointerUp = () => {
      s.dragging = false
      // resume auto-rotate after a short coast
      setTimeout(() => { s.paused = false }, 2500)
    }
    const onPointerCancel = () => {
      s.dragging = false
      s.paused = false
    }
    const onLostPointerCapture = () => {
      s.dragging = false
    }

    canvas.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerCancel)
    canvas.addEventListener('lostpointercapture', onLostPointerCapture)
    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerCancel)
      canvas.removeEventListener('lostpointercapture', onLostPointerCapture)
    }
  }, [size, isMobile])

  // ---- DPR-aware sizing ----
  const dpr = typeof window !== 'undefined'
    ? (isMobile ? Math.min(window.devicePixelRatio || 1, 1.5) : (window.devicePixelRatio || 1))
    : 1
  const canvasPx = size * dpr

  return (
    <canvas
      ref={canvasRef}
      width={canvasPx}
      height={canvasPx}
      className={className}
      style={{ width: size, height: size, cursor: 'grab', touchAction: 'none' }}
      aria-label="Interactive 3D wireframe globe showing Jakarta, Indonesia"
      role="img"
    />
  )
}
