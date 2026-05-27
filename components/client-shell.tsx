'use client'

import { useEffect, useState, ReactNode } from 'react'
import { CommandPalette } from '@/components/command-palette'
import { NavBar } from '@/components/nav-bar'
import { CustomCursor } from '@/components/custom-cursor'
import { ScrollProgress } from '@/components/scroll-progress'
import { Footer } from '@/components/contact-section'

interface ClientShellProps {
  children: ReactNode
}

export function ClientShell({ children }: ClientShellProps) {
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [fabVisible, setFabVisible] = useState(false)

  // Global Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setPaletteOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Listen for custom open event
  useEffect(() => {
    const handleOpen = () => setPaletteOpen(true)
    window.addEventListener('open-command-palette', handleOpen)
    return () => window.removeEventListener('open-command-palette', handleOpen)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setFabVisible(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {/* Custom cursor — desktop only */}
      <div className="hidden md:block">
        <CustomCursor />
      </div>

      {/* Scroll progress indicator */}
      <ScrollProgress />

      {/* Navigation */}
      <NavBar onOpenPalette={() => setPaletteOpen(true)} />

      {/* Main content wrapper */}
      <div className="flex flex-col min-h-screen">
        {children}
      </div>

      <Footer />

      {/* Mobile command palette FAB */}
      <button
        type="button"
        onClick={() => setPaletteOpen(true)}
        aria-label="Open command palette"
        className="md:hidden fixed bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500"
        style={{
          backgroundColor: '#313244',
          border: '1px solid #6c7086',
          zIndex: 40,
          opacity: fabVisible ? 1 : 0,
          transform: fabVisible ? 'translateY(0)' : 'translateY(8px)',
        }}
      >
        <span className="font-mono text-lg" style={{ color: '#cba6f7' }}>
          ⌘
        </span>
      </button>

      {/* Command Palette */}
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
      />
    </>
  )
}
