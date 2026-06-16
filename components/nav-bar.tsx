'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavBarProps {
  onOpenPalette: () => void
}

export function NavBar({ onOpenPalette }: NavBarProps) {
  const pathname = usePathname()
  const [activeSection, setActiveSection] = useState('home')
  const [scrollPercent, setScrollPercent] = useState(0)
  const [time, setTime] = useState('')

  // Workspace configurations
  const WORKSPACES = [
    { id: 'home', label: 'home', isHash: true },
    { id: 'about', label: 'about', isHash: true },
    { id: 'experience', label: 'experience', isHash: true },
    { id: 'projects', label: 'projects', isHash: true },
    { id: 'contact', label: 'contact', isHash: true },
  ]

  // Update time and scroll percentage
  useEffect(() => {
    // 1. Live Time
    const updateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', { hour12: false }))
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)

    // 2. Scroll percentage and Active Section tracking
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight > 0) {
        setScrollPercent(Math.min(100, Math.max(0, Math.round((window.scrollY / docHeight) * 100))))
      } else {
        setScrollPercent(0)
      }

      if (pathname !== '/') {
        setActiveSection(pathname.split('/')[1] || 'home')
        return
      }

      // Track active section on homepage
      if (window.scrollY < 50) {
        setActiveSection('home')
        return
      }

      for (const ws of [...WORKSPACES].reverse()) {
        if (!ws.isHash) continue
        const el = document.getElementById(ws.id)
        if (el && window.scrollY >= el.offsetTop - 150) {
          setActiveSection(ws.id)
          break
        }
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      clearInterval(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [pathname])

  const scrollTo = (id: string) => {
    if (pathname !== '/') {
      window.location.href = `/#${id}`
      return
    }
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setActiveSection('home')
      return
    }
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/10 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-9 px-4 font-mono text-[10px] sm:text-xs text-[#a6adc8]">
        {/* Left Panel: Workspaces */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {WORKSPACES.map((ws, index) => {
            const isCurrent = activeSection === ws.id
            const num = index + 1
            return (
              <button
                key={ws.id}
                onClick={() => scrollTo(ws.id)}
                className="transition-colors duration-150 cursor-none"
                style={{
                  color: isCurrent ? '#a6e3a1' : '#6c7086',
                }}
              >
                {/* Desktop: [ 1:home ], Mobile: [1] */}
                <span className="hidden sm:inline">
                  [ {isCurrent ? '●' : num}:{ws.label} ]
                </span>
                <span className="sm:hidden">
                  [{isCurrent ? '●' : num}]
                </span>
              </button>
            )
          })}
          
          {/* Navigation Links for separate routes */}
          <span className="text-[#313244] hidden sm:inline">|</span>
          <Link
            href="/archive"
            className="transition-colors duration-150 cursor-none hover:text-[#cba6f7] hidden sm:inline"
            style={{ color: pathname === '/archive' ? '#cba6f7' : '#6c7086' }}
          >
            [ archive ]
          </Link>
          <Link
            href="/archive"
            className="transition-colors duration-150 cursor-none hover:text-[#cba6f7] sm:hidden"
            style={{ color: pathname === '/archive' ? '#cba6f7' : '#6c7086' }}
          >
            [A]
          </Link>
        </div>

        {/* Center Panel: Active window prompt */}
        <div className="hidden md:block text-[11px]">
          <span style={{ color: '#a6e3a1' }}>zainul</span>
          <span style={{ color: '#6c7086' }}>@</span>
          <span style={{ color: '#89b4fa' }}>thinkpad</span>
          <span style={{ color: '#6c7086' }}>:</span>
          <span style={{ color: '#89dceb' }}>~/portfolio/{activeSection}</span>
        </div>

        {/* Right Panel: System stats */}
        <div className="flex items-center space-x-3 sm:space-x-4 text-[10px] sm:text-xs">
          {/* Wifi status */}
          <div className="hidden sm:flex items-center gap-1">
            <span style={{ color: '#6c7086' }}>WIFI:</span>
            <span style={{ color: '#a6e3a1' }}>online</span>
          </div>

          <span className="text-[#313244] hidden sm:inline">|</span>

          {/* Static RAM */}
          <div className="hidden sm:flex items-center gap-1">
            <span style={{ color: '#6c7086' }}>RAM:</span>
            <span style={{ color: '#cdd6f4' }}>4.8G/8G</span>
          </div>

          <span className="text-[#313244] hidden sm:inline">|</span>

          {/* Dynamic CPU based on scroll progress */}
          <div className="flex items-center gap-1">
            <span style={{ color: '#6c7086' }}>CPU:</span>
            <span style={{ color: scrollPercent > 80 ? '#f38ba8' : scrollPercent > 50 ? '#fab387' : '#a6e3a1' }} className="tabular-nums">
              {scrollPercent}%
            </span>
          </div>

          <span className="text-[#313244]">|</span>

          {/* Time (Always visible) */}
          <div className="flex items-center gap-1">
            <span style={{ color: '#6c7086' }}>TIME:</span>
            <span style={{ color: '#cdd6f4' }} className="tabular-nums">{time || '--:--:--'}</span>
          </div>

          <span className="text-[#313244]">|</span>

          {/* Cmd+K trigger */}
          <button
            onClick={onOpenPalette}
            className="hover:text-[#cba6f7] transition-colors duration-150 cursor-none px-1 rounded bg-[#313244]/40 border border-[#45475a] text-[9px] sm:text-[10px]"
            style={{ color: '#6c7086' }}
          >
            ⌘K
          </button>
        </div>
      </div>
    </header>
  )
}
