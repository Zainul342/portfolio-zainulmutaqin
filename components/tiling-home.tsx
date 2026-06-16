'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Folder, BookOpen, Github, Mail, ExternalLink } from 'lucide-react'
import { HeroSection } from '@/components/hero-section'
import { PROJECTS } from '@/lib/projects'

// ─── Waybar / Top Bar ─────────────────────────────────────────────────────────
function WayBar() {
  const pathname = usePathname()
  const [time, setTime] = useState('')
  const [online, setOnline] = useState(true)

  useEffect(() => {
    const tick = () => {
      setTime(new Date().toLocaleTimeString('en-US', { hour12: false }))
      setOnline(navigator.onLine)
    }
    tick()
    const id = setInterval(tick, 1000)
    window.addEventListener('online', tick)
    window.addEventListener('offline', tick)
    return () => {
      clearInterval(id)
      window.removeEventListener('online', tick)
      window.removeEventListener('offline', tick)
    }
  }, [])

  const workspaces = [
    { num: 1, label: 'home', href: '/' },
    { num: 2, label: 'archive', href: '/archive' },
    { num: 3, label: 'blog', href: '/blog' },
  ]

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-8 font-mono text-[10px] select-none"
      style={{ backgroundColor: '#11111b', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
    >
      {/* Left — workspace tags */}
      <div className="flex items-center gap-2">
        {workspaces.map(({ num, label, href }) => {
          const isActive = pathname === href
          return (
            <Link
              key={num}
              href={href}
              className="transition-colors duration-150"
              style={{ color: isActive ? '#a6e3a1' : '#6c7086' }}
              aria-current={isActive ? 'page' : undefined}
            >
              {isActive ? `●${num}` : num}
            </Link>
          )
        })}
        <span style={{ color: '#313244' }}>|</span>
        <span style={{ color: '#585b70' }}>bspwm</span>
      </div>

      {/* Center — window title */}
      <div className="hidden md:flex items-center gap-0.5 text-[10px]">
        <span style={{ color: '#a6e3a1' }}>zainul</span>
        <span style={{ color: '#6c7086' }}>@</span>
        <span style={{ color: '#89b4fa' }}>endeavouros</span>
        <span style={{ color: '#6c7086' }}>:~$</span>
      </div>

      {/* Right — clock + network */}
      <div className="flex items-center gap-3">
        <span
          className="flex items-center gap-1"
          title={online ? 'Network online' : 'Network offline'}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: online ? '#a6e3a1' : '#f38ba8' }}
          />
          <span style={{ color: online ? '#a6e3a1' : '#f38ba8' }}>
            {online ? 'online' : 'offline'}
          </span>
        </span>
        <span style={{ color: '#313244' }}>|</span>
        <span className="tabular-nums" style={{ color: '#cdd6f4' }}>
          {time || '--:--:--'}
        </span>
      </div>
    </header>
  )
}

// ─── Sidebar Dock ─────────────────────────────────────────────────────────────
const DOCK_ITEMS = [
  { icon: Home,     href: '/',                  label: 'Home',    external: false },
  { icon: Folder,   href: '/archive',            label: 'Archive', external: false },
  { icon: BookOpen, href: '/blog',               label: 'Blog',    external: false },
  { icon: Github,   href: 'https://github.com/Zainul342', label: 'GitHub', external: true },
  { icon: Mail,     href: 'mailto:zainulmutaqin@example.com', label: 'Mail', external: true },
]

function SidebarDock() {
  return (
    <nav
      aria-label="Sidebar dock"
      className="fixed left-0 top-8 bottom-0 z-40 flex flex-col items-center gap-1 pt-4 pb-4 px-1.5 select-none"
      style={{
        width: '40px',
        backgroundColor: '#11111b',
        borderRight: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {DOCK_ITEMS.map(({ icon: Icon, href, label, external }) => {
        const sharedProps = {
          title: label,
          'aria-label': label,
          className: 'group flex items-center justify-center w-7 h-7 rounded-sm transition-colors duration-150',
          style: { color: '#6c7086' } as React.CSSProperties,
          onMouseEnter: (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.currentTarget.style.color = '#cba6f7'
            e.currentTarget.style.backgroundColor = 'rgba(203,166,247,0.07)'
          },
          onMouseLeave: (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.currentTarget.style.color = '#6c7086'
            e.currentTarget.style.backgroundColor = 'transparent'
          },
        }
        return external ? (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            {...sharedProps}
          >
            <Icon size={14} strokeWidth={1.5} />
          </a>
        ) : (
          <Link key={label} href={href} {...sharedProps}>
            <Icon size={14} strokeWidth={1.5} />
          </Link>
        )
      })}
    </nav>
  )
}

// ─── Tiling Window Wrapper ────────────────────────────────────────────────────
type WindowMode = 'NORMAL' | 'EXECUTE' | 'READ' | 'SOURCE'
const MODE_COLORS: Record<WindowMode, string> = {
  NORMAL:  '#a6e3a1',
  EXECUTE: '#f38ba8',
  READ:    '#b4befe',
  SOURCE:  '#89b4fa',
}

interface TilingWindowProps {
  title: string
  accentColor: string
  hoverMode: WindowMode
  children: React.ReactNode
  className?: string
}

function TilingWindow({ title, accentColor, hoverMode, children, className = '' }: TilingWindowProps) {
  const [hovered, setHovered] = useState(false)
  const mode: WindowMode = hovered ? hoverMode : 'NORMAL'
  const modeColor = MODE_COLORS[mode]

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`flex flex-col overflow-hidden transition-all duration-200 ${className}`}
      style={{
        backgroundColor: 'rgba(17,17,27,0.70)',
        backdropFilter: 'blur(8px)',
        border: `1px solid ${hovered ? accentColor : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 0,
        boxShadow: hovered ? `0 0 0 1px ${accentColor}18` : 'none',
        transitionProperty: 'border-color, box-shadow',
      }}
    >
      {/* Title bar */}
      <div
        className="flex items-center justify-between px-3 py-1.5 font-mono text-[9px] shrink-0"
        style={{ backgroundColor: '#0d0d17', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-1.5">
          <span style={{ color: hovered ? accentColor : '#45475a' }}>▸</span>
          <span style={{ color: '#585b70' }}>{title}</span>
        </div>
        <div className="flex items-center gap-1 text-[#313244]">
          <span>─</span><span>□</span><span>✕</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto min-h-0">
        {children}
      </div>

      {/* Statusline */}
      <div
        className="flex items-center justify-between font-mono text-[9px] h-5 shrink-0 select-none"
        style={{ backgroundColor: '#0d0d17', borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center h-full">
          <span
            className="px-2 h-full flex items-center font-bold text-[#11111b] transition-colors duration-150"
            style={{ backgroundColor: modeColor }}
          >
            {mode}
          </span>
          <span className="px-2 h-full flex items-center gap-1 text-[#cdd6f4]" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
            <span style={{ color: '#f9e2af' }}>⎇</span>
            <span>main</span>
          </span>
          <span className="px-2 text-[#585b70] hidden sm:block max-w-[140px] truncate">{title}</span>
        </div>
        <div className="flex items-center h-full gap-0">
          <span className="px-2 text-[#585b70] hidden sm:block">utf-8</span>
          <span
            className="px-2 h-full flex items-center font-bold text-[#11111b] transition-colors duration-150"
            style={{ backgroundColor: hovered ? accentColor : '#585b70' }}
          >
            {hovered ? 'ACTIVE' : '100%'}
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Profile Window Content ───────────────────────────────────────────────────
function ProfileContent() {
  const fields = [
    { key: 'name',      val: '"Zainul Mutaqin"',  color: '#f9e2af' },
    { key: 'os',        val: '"EndeavourOS bspwm"', color: '#a6e3a1' },
    { key: 'host',      val: '"ThinkPad T490s"',  color: '#89b4fa' },
    { key: 'wm',        val: '"bspwm + Polybar"', color: '#cba6f7' },
    { key: 'terminal',  val: '"Ghostty"',          color: '#89dceb' },
    { key: 'editor',    val: '"Neovim (Kickstart)"', color: '#a6e3a1' },
    { key: 'shell',     val: '"zsh + starship"',  color: '#f38ba8' },
    { key: 'status',    val: '"Gap Year • SNBT 2026 Prep"', color: '#fab387' },
    { key: 'location',  val: '"Jakarta, ID (UTC+07)"', color: '#89b4fa' },
    { key: 'focus',     val: '"Web Systems • Linux Tooling"', color: '#cba6f7' },
  ]

  return (
    <div className="p-3 font-mono text-[10px] h-full overflow-auto">
      <div style={{ color: '#585b70' }} className="mb-2">// profile.tsx</div>
      <div style={{ color: '#cba6f7' }}>const</div>{' '}
      <span style={{ color: '#89b4fa' }}>profile</span>
      <span style={{ color: '#cdd6f4' }}> = {'{'}</span>
      <div className="pl-4 leading-6">
        {fields.map(({ key, val, color }) => (
          <div key={key} className="flex items-start gap-2">
            <span style={{ color: '#585b70' }}>{key}:</span>
            <span style={{ color }}>{val}</span>
            <span style={{ color: '#313244' }}>,</span>
          </div>
        ))}
      </div>
      <span style={{ color: '#cdd6f4' }}>{'}'}</span>
    </div>
  )
}

// ─── Projects Log Window Content ──────────────────────────────────────────────
function ProjectsLogContent() {
  return (
    <div className="p-3 font-mono text-[10px] h-full overflow-auto">
      <div style={{ color: '#585b70' }} className="mb-2">// projects.log — click any row to view</div>

      {/* Table header */}
      <div
        className="grid gap-2 mb-1 pb-1"
        style={{
          gridTemplateColumns: '1fr 2fr 1fr auto',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          color: '#6c7086',
        }}
      >
        <span>ID</span>
        <span>DESCRIPTION</span>
        <span>STACK</span>
        <span>LINK</span>
      </div>

      {/* Project rows */}
      {PROJECTS.map((p, i) => (
        <div
          key={p.id}
          className="grid gap-2 py-1 transition-colors duration-100 group"
          style={{
            gridTemplateColumns: '1fr 2fr 1fr auto',
            borderBottom: '1px solid rgba(255,255,255,0.03)',
          }}
        >
          <span style={{ color: p.accentColor }} className="truncate">
            {String(i + 1).padStart(2, '0')}. {p.id}
          </span>
          <span className="text-[#a6adc8] truncate group-hover:text-[#cdd6f4] transition-colors">
            {p.description.slice(0, 55)}{p.description.length > 55 ? '…' : ''}
          </span>
          <span style={{ color: '#585b70' }} className="truncate">
            {p.stack.map((s) => s.label).join(' · ')}
          </span>
          <div className="flex items-center gap-1.5">
            {p.github && (
              <a
                href={p.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${p.name} GitHub`}
                className="transition-colors duration-100"
                style={{ color: '#585b70' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#cba6f7')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#585b70')}
              >
                <Github size={10} />
              </a>
            )}
            {p.demo && (
              <a
                href={p.demo}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${p.name} demo`}
                className="transition-colors duration-100"
                style={{ color: p.accentColor }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                <ExternalLink size={10} />
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Main Tiling Layout ───────────────────────────────────────────────────────
export function TilingHome() {
  return (
    <>
      <WayBar />
      <SidebarDock />

      {/* Main tiling canvas — offset by topbar height (32px) + sidebar width (40px) */}
      <div
        className="fixed inset-0 overflow-auto"
        style={{
          top: '32px',
          left: '40px',
          backgroundColor: '#0a0a0a',
        }}
      >
        {/* Subtle dot grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(69,71,90,0.25) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
          aria-hidden
        />

        {/* Tiling grid */}
        <div
          className="relative grid gap-2 p-2 min-h-full"
          style={{
            gridTemplateColumns: 'repeat(12, 1fr)',
            gridTemplateRows: 'auto auto',
          }}
        >
          {/* Window 1 — Hero Terminal (8 cols on lg, full on mobile) */}
          <TilingWindow
            title="zainul@endeavouros:~"
            accentColor="#f38ba8"
            hoverMode="EXECUTE"
            className="col-span-12 lg:col-span-8 min-h-[520px]"
          >
            {/* HeroSection is already a 'use client' component */}
            <HeroSection />
          </TilingWindow>

          {/* Window 2 — Profile (4 cols on lg, full on mobile) */}
          <TilingWindow
            title="~/dotfiles/profile.tsx"
            accentColor="#b4befe"
            hoverMode="READ"
            className="col-span-12 lg:col-span-4 min-h-[520px]"
          >
            <ProfileContent />
          </TilingWindow>

          {/* Window 3 — Projects Log (full width) */}
          <TilingWindow
            title="~/logs/projects.log"
            accentColor="#89b4fa"
            hoverMode="SOURCE"
            className="col-span-12 min-h-[280px]"
          >
            <ProjectsLogContent />
          </TilingWindow>
        </div>
      </div>
    </>
  )
}
