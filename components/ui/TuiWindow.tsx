'use client'

import { useState, ReactNode } from 'react'

interface TuiWindowProps {
  tabName: string
  mode: 'EXECUTE' | 'SOURCE' | 'READ'
  children: ReactNode
  className?: string
}

export function TuiWindow({ tabName, mode, children, className = '' }: TuiWindowProps) {
  const [hovered, setHovered] = useState(false)

  // Configure mode status color and text for hover states
  const getModeConfig = () => {
    if (!hovered) {
      return {
        text: 'NORMAL',
        bgColor: 'bg-[#cba6f7]/20',
        textColor: 'text-[#cba6f7]',
        borderColor: 'border-white/10',
      }
    }

    switch (mode) {
      case 'EXECUTE':
        return {
          text: 'EXECUTE',
          bgColor: 'bg-[#f38ba8]', // Catppuccin Red (pastel red/pink)
          textColor: 'text-[#1e1e2e]',
          borderColor: 'border-[#f38ba8]',
        }
      case 'SOURCE':
        return {
          text: 'SOURCE',
          bgColor: 'bg-[#89b4fa]', // Catppuccin Blue (pastel blue)
          textColor: 'text-[#1e1e2e]',
          borderColor: 'border-[#89b4fa]',
        }
      case 'READ':
        return {
          text: 'READ',
          bgColor: 'bg-[#b4befe]', // Catppuccin Lavender (lavender/ungu terang)
          textColor: 'text-[#1e1e2e]',
          borderColor: 'border-[#b4befe]',
        }
    }
  }

  const config = getModeConfig()

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`rounded-none border bg-[#0a0a0a] flex flex-col transition-colors duration-200 ${config.borderColor} ${className}`}
    >
      {/* ── Title Bar ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-[#0d0d0d] select-none font-mono text-xs text-[#a6adc8]">
        <div className="flex items-center gap-2">
          {/* Mock prompt indicator */}
          <span className="text-[#a6e3a1]">⚡</span>
          <span>{tabName}</span>
        </div>
        <div className="flex items-center gap-3 text-neutral-500">
          <span>[TUI]</span>
          <span>●</span>
        </div>
      </div>

      {/* ── Content Area ─────────────────────────────────────────────────── */}
      <div className="flex-grow">
        {children}
      </div>

      {/* ── Statusline (Neovim Statusline Style) ─────────────────────────── */}
      <div className="flex items-center justify-between font-mono text-xs bg-[#0f0f14] text-[#a6adc8] border-t border-white/10 h-7 select-none overflow-hidden">
        <div className="flex items-center h-full">
          {/* Mode tag */}
          <div
            className={`px-3 h-full flex items-center font-bold transition-colors duration-200 ${config.bgColor} ${config.textColor}`}
          >
            [{config.text}]
          </div>
          
          {/* Git branch info */}
          <div className="px-3 bg-white/5 h-full flex items-center gap-1.5 text-neutral-300 border-r border-white/10">
            <span></span>
            <span>main</span>
          </div>

          {/* Tab Name status */}
          <div className="px-3 text-neutral-400 hidden sm:block">
            {tabName}
          </div>
        </div>

        <div className="flex items-center h-full">
          {/* Encoding & Format */}
          <div className="px-3 text-neutral-500 border-l border-white/10 h-full flex items-center">
            utf-8
          </div>
          
          {/* Current buffer type */}
          <div
            className={`px-3 h-full flex items-center font-bold text-[#1e1e2e] transition-colors duration-200 ${
              hovered ? config.bgColor : 'bg-neutral-800'
            }`}
          >
            {mode}
          </div>
        </div>
      </div>
    </div>
  )
}
