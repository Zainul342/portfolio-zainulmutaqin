'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Search, ArrowRight, Hash, Mail, Github, Terminal, Skull, Globe, MapPin } from 'lucide-react'

type CommandCategory = 'navigate' | 'action' | 'easter'

interface Command {
  id: string
  label: string
  description?: string
  category: CommandCategory
  icon: React.ReactNode
  action: () => void
  easterEgg?: { text: string; color: string }
}

const EASTER_EGGS: Record<string, { text: string; color: string }> = {
  'sudo-rm': {
    text: 'rm: cannot remove \'/\': Permission denied. Nice try. Portfolio still intact.',
    color: '#f38ba8',
  },
  'hack-planet': {
    text: '> accessing mainframe...\n> downloading internet...\n> hacking complete. You are now 10x engineer.',
    color: '#a6e3a1',
  },
  'whereami': {
    text: '',   // rendered by WhereAmIResult component
    color: '#a6e3a1',
  },
}

function WhereAmIResult() {
  const [phase, setPhase] = useState<'locating' | 'loading' | 'done'>('locating')
  const [barProgress, setBarProgress] = useState(0)

  useEffect(() => {
    // Phase 1: show "locating..." for 600ms
    const t1 = setTimeout(() => {
      setPhase('loading')
    }, 600)

    // Phase 2: animate the bar from 0 → 100 over ~1.2s
    const t2 = setTimeout(() => {
      let progress = 0
      const interval = setInterval(() => {
        progress += 8
        setBarProgress(Math.min(progress, 100))
        if (progress >= 100) {
          clearInterval(interval)
          setPhase('done')
        }
      }, 80)
      return () => clearInterval(interval)
    }, 700)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  const barFilled = Math.round(barProgress / 8)
  const barEmpty = 12 - barFilled
  const barStr = '█'.repeat(Math.max(0, barFilled)) + '░'.repeat(Math.max(0, barEmpty))

  return (
    <div
      className="px-4 py-3 font-mono text-xs whitespace-pre"
      style={{ color: '#a6e3a1', backgroundColor: 'rgba(166,227,161,0.05)', borderBottom: '1px solid #313244' }}
      aria-live="polite"
    >
      {'> whereami'}{'\n'}
      {phase === 'locating' && '  locating...'}
      {(phase === 'loading' || phase === 'done') && (
        <>
          {'  locating...'}{'\n'}
          {`  ${barStr} ${barProgress}%`}
        </>
      )}
      {phase === 'done' && (
        <>
          {'\n\n'}
          {'  hostname     : zainul-machine'}{'\n'}
          {'  location     : Jakarta, Indonesia'}{'\n'}
          {'  coordinates  : 6.2088° S, 106.8456° E'}{'\n'}
          {'  timezone     : UTC+7 (WIB)'}{'\n'}
          {'  status       : '}<span style={{ color: '#a6e3a1' }}>online</span>
        </>
      )}
    </div>
  )
}

function buildCommands(onClose: () => void, setEasterEgg: (key: string) => void): Command[] {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    onClose()
  }

  return [
    {
      id: 'nav-projects',
      label: 'go to projects',
      description: 'View all projects',
      category: 'navigate',
      icon: <Hash size={14} />,
      action: () => scrollTo('projects'),
    },
    {
      id: 'nav-about',
      label: 'go to about',
      description: 'Learn more about Zain',
      category: 'navigate',
      icon: <Hash size={14} />,
      action: () => scrollTo('about'),
    },
    {
      id: 'nav-skills',
      label: 'go to skills',
      description: 'Check out the tech stack',
      category: 'navigate',
      icon: <Hash size={14} />,
      action: () => scrollTo('skills'),
    },
    {
      id: 'nav-contact',
      label: 'go to contact',
      description: 'Get in touch',
      category: 'navigate',
      icon: <Hash size={14} />,
      action: () => scrollTo('contact'),
    },
    {
      id: 'action-github',
      label: 'open github',
      description: 'github.com/Zainul342',
      category: 'action',
      icon: <Github size={14} />,
      action: () => {
        window.open('https://github.com/Zainul342', '_blank')
        onClose()
      },
    },
    {
      id: 'action-email',
      label: 'send email',
      description: 'Open email client',
      category: 'action',
      icon: <Mail size={14} />,
      action: () => {
        window.location.href = 'mailto:zainul@example.com'
        onClose()
      },
    },
    {
      id: 'action-domcy',
      label: 'open domcy-coffee demo',
      description: 'domcy-coffee.vercel.app',
      category: 'action',
      icon: <Globe size={14} />,
      action: () => {
        window.open('https://domcy-coffee.vercel.app', '_blank')
        onClose()
      },
    },
    {
      id: 'action-snbt',
      label: 'open snbtflow demo',
      description: 'snbtflow.vercel.app',
      category: 'action',
      icon: <Globe size={14} />,
      action: () => {
        window.open('https://snbtflow.vercel.app', '_blank')
        onClose()
      },
    },
    {
      id: 'whereami',
      label: 'whereami',
      description: 'Locate current host',
      category: 'easter',
      icon: <MapPin size={14} />,
      action: () => setEasterEgg('whereami'),
      easterEgg: EASTER_EGGS['whereami'],
    },
    {
      id: 'sudo-rm',
      label: 'sudo rm -rf /',
      description: 'Dangerous command',
      category: 'easter',
      icon: <Skull size={14} />,
      action: () => setEasterEgg('sudo-rm'),
      easterEgg: EASTER_EGGS['sudo-rm'],
    },
    {
      id: 'hack-planet',
      label: 'hack the planet',
      description: 'Classic',
      category: 'easter',
      icon: <Terminal size={14} />,
      action: () => setEasterEgg('hack-planet'),
      easterEgg: EASTER_EGGS['hack-planet'],
    },
  ]
}

const CATEGORY_LABELS: Record<CommandCategory, string> = {
  navigate: 'navigation',
  action: 'actions',
  easter: 'secret commands',
}

export function CommandPalette({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [easterEggKey, setEasterEggKey] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const commands = buildCommands(onClose, (key) => setEasterEggKey(key))

  const filtered = query.trim()
    ? commands.filter(
        (cmd) =>
          cmd.label.includes(query.toLowerCase()) ||
          (cmd.description?.toLowerCase().includes(query.toLowerCase()) ?? false)
      )
    : commands

  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIndex(0)
      setEasterEggKey(null)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    setActiveIndex(0)
    setEasterEggKey(null)
  }, [query])

  const runActive = useCallback(() => {
    const cmd = filtered[activeIndex]
    if (cmd) cmd.action()
  }, [filtered, activeIndex])

  useEffect(() => {
    if (!open) return
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); setEasterEggKey(null) }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        runActive()
      }
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [open, onClose, filtered, runActive])

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${activeIndex}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  if (!open) return null

  // Group filtered commands
  const grouped = filtered.reduce<Record<CommandCategory, Command[]>>(
    (acc, cmd) => {
      if (!acc[cmd.category]) acc[cmd.category] = []
      acc[cmd.category].push(cmd)
      return acc
    },
    {} as Record<CommandCategory, Command[]>
  )

  const easterEgg = easterEggKey ? EASTER_EGGS[easterEggKey] : null
  let globalIndex = 0

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4"
      style={{ backgroundColor: 'rgba(17, 17, 27, 0.7)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div
        className="w-full max-w-xl rounded-xl overflow-hidden"
        style={{
          backgroundColor: '#181825',
          border: '1px solid #313244',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(203,166,247,0.08)',
        }}
      >
        {/* Search input */}
        <div
          className="flex items-center gap-3 px-4 py-3"
          style={{ borderBottom: '1px solid #313244' }}
        >
          <Search size={15} style={{ color: '#6c7086', flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent font-mono text-sm outline-none"
            style={{ color: '#cdd6f4' }}
            aria-autocomplete="list"
            aria-controls="palette-list"
          />
          <kbd
            className="font-mono text-[10px] px-1.5 py-0.5 rounded hidden sm:block"
            style={{ backgroundColor: '#313244', color: '#6c7086', border: '1px solid #45475a' }}
          >
            esc
          </kbd>
        </div>

        {/* Easter egg result */}
        {easterEggKey === 'whereami' ? (
          <WhereAmIResult key={easterEggKey} />
        ) : easterEgg && easterEgg.text ? (
          <div
            className="px-4 py-3 font-mono text-xs whitespace-pre-line"
            style={{
              color: easterEgg.color,
              backgroundColor: `color-mix(in srgb, ${easterEgg.color} 5%, #181825)`,
              borderBottom: '1px solid #313244',
            }}
            aria-live="polite"
          >
            {easterEgg.text}
          </div>
        ) : null}

        {/* Command list */}
        <div
          id="palette-list"
          ref={listRef}
          className="overflow-y-auto"
          style={{ maxHeight: '320px' }}
          role="listbox"
        >
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center font-mono text-sm" style={{ color: '#6c7086' }}>
              no commands found for &quot;{query}&quot;
            </div>
          ) : (
            (Object.keys(grouped) as CommandCategory[]).map((cat) => (
              <div key={cat}>
                <div
                  className="px-4 py-1.5 font-mono text-[10px] uppercase tracking-wider sticky top-0"
                  style={{
                    color: '#45475a',
                    backgroundColor: '#181825',
                    borderBottom: '1px solid rgba(49,50,68,0.5)',
                  }}
                >
                  {CATEGORY_LABELS[cat]}
                </div>
                {grouped[cat].map((cmd) => {
                  const idx = globalIndex++
                  const isActive = idx === activeIndex

                  return (
                    <button
                      key={cmd.id}
                      data-index={idx}
                      role="option"
                      aria-selected={isActive}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-75 cursor-none"
                      style={{
                        backgroundColor: isActive ? '#313244' : 'transparent',
                        borderLeft: isActive ? '2px solid #cba6f7' : '2px solid transparent',
                      }}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={() => cmd.action()}
                    >
                      <span
                        style={{
                          color: isActive
                            ? cmd.category === 'easter'
                              ? '#f38ba8'
                              : '#cba6f7'
                            : '#6c7086',
                          flexShrink: 0,
                        }}
                      >
                        {cmd.icon}
                      </span>

                      <span className="flex-1">
                        <span
                          className="font-mono text-sm block"
                          style={{
                            color: isActive
                              ? cmd.category === 'easter'
                                ? '#f38ba8'
                                : '#cdd6f4'
                              : '#a6adc8',
                          }}
                        >
                          {'>'} {cmd.label}
                        </span>
                        {cmd.description && (
                          <span
                            className="font-mono text-[11px]"
                            style={{ color: '#6c7086' }}
                          >
                            {cmd.description}
                          </span>
                        )}
                      </span>

                      {isActive && (
                        <ArrowRight size={12} style={{ color: '#cba6f7', flexShrink: 0 }} />
                      )}
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-4 py-2"
          style={{ borderTop: '1px solid #313244' }}
        >
          <div className="flex items-center gap-3">
            {[
              { key: '↑↓', label: 'navigate' },
              { key: '↵', label: 'select' },
              { key: 'esc', label: 'close' },
            ].map(({ key, label }) => (
              <span key={key} className="flex items-center gap-1 font-mono text-[10px]" style={{ color: '#45475a' }}>
                <kbd
                  className="px-1.5 py-0.5 rounded text-[9px]"
                  style={{ backgroundColor: '#313244', border: '1px solid #45475a', color: '#6c7086' }}
                >
                  {key}
                </kbd>
                {label}
              </span>
            ))}
          </div>
          <span className="font-mono text-[10px]" style={{ color: '#45475a' }}>
            cmd+k
          </span>
        </div>
      </div>
    </div>
  )
}
