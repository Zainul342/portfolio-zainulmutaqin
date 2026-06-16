'use client'

import { useEffect, useState, useRef } from 'react'
import { Github, Mail, Send, CheckCircle2, AlertCircle, ArrowUp } from 'lucide-react'
import { Reveal } from '@/components/motion-wrapper'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'

type FormState = 'idle' | 'sending' | 'success' | 'error'

// ─── Reusable Neovim Editor Buffer Wrapper ───────────────────────────────────
interface NeovimBufferProps {
  filename: string
  linesCount?: number
  accentColor?: string
  hoverMode?: 'INSERT' | 'VISUAL'
  children: React.ReactNode
  className?: string
  hovered: boolean
  setHovered: (h: boolean) => void
}

function NeovimBuffer({
  filename,
  linesCount = 10,
  accentColor = '#cba6f7',
  hoverMode = 'INSERT',
  children,
  className = '',
  hovered,
  setHovered,
}: NeovimBufferProps) {
  const [lines, setLines] = useState(linesCount)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contentRef.current) return

    const calculateLines = () => {
      if (!contentRef.current) return
      const height = contentRef.current.offsetHeight
      // Gutter padding is py-4 (32px total), line-height is 24px (leading-6)
      const calculatedLines = Math.max(linesCount, Math.ceil(height / 24))
      setLines(calculatedLines)
    }

    calculateLines()

    if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
      const observer = new ResizeObserver(() => {
        calculateLines()
      })
      observer.observe(contentRef.current)
      return () => observer.disconnect()
    }
  }, [linesCount])

  const lineNumbers = Array.from({ length: lines }, (_, i) => i + 1)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative rounded-[3px] border overflow-hidden flex flex-col transition-all duration-200 select-none bg-black/45 backdrop-blur-md min-h-[300px] ${className}`}
      style={{
        borderColor: hovered ? accentColor : '#313244',
        boxShadow: hovered ? '0 4px 20px rgba(0, 0, 0, 0.4)' : 'none',
      }}
    >
      {/* Tabline / Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#0a0a0c]/80 border-b border-white/5 font-mono text-[9px] text-[#585b70]">
        <div className="flex items-center gap-1.5">
          <span style={{ color: hovered ? accentColor : '#585b70' }}></span>
          <span>{filename}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>[unix]</span>
          <span>utf-8</span>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="flex flex-grow relative">
        {/* Line Gutter */}
        <div className="flex flex-col items-end pr-2.5 pl-2 py-4 select-none font-mono text-[10px] text-[#313244] border-r border-white/5 bg-[#0a0a0c]/20 w-8">
          {lineNumbers.map((num) => (
            <span key={num} className="leading-6">{num}</span>
          ))}
        </div>

        {/* Content Pane */}
        <div ref={contentRef} className="flex-grow p-4 pl-3 flex flex-col justify-between text-left">
          {children}
        </div>
      </div>

      {/* Lualine Status Bar */}
      <div className="flex items-center justify-between font-mono text-[9px] bg-[#0f0f14] text-[#a6adc8] border-t border-white/5 h-5 select-none">
        <div className="flex items-center h-full">
          {/* Mode indicator */}
          <div
            className="px-2 h-full flex items-center font-bold text-[#1e1e2e] transition-colors duration-150"
            style={{
              backgroundColor: hovered
                ? hoverMode === 'INSERT' ? '#89b4fa' : '#fab387'
                : '#a6e3a1',
            }}
          >
            {hovered ? hoverMode : 'NORMAL'}
          </div>
          {/* Git branch */}
          <div className="px-2 bg-white/5 h-full flex items-center gap-1 text-[#cdd6f4]">
            <span></span>
            <span>main</span>
          </div>
          {/* Filename status */}
          <div className="px-2 text-[#585b70] hidden sm:block max-w-[120px] truncate">
            {filename}
          </div>
        </div>

        <div className="flex items-center h-full">
          <div className="px-2 text-[#585b70] hidden xs:block">
            utf-8
          </div>
          <div
            className="px-2 h-full flex items-center font-bold text-[#1e1e2e]"
            style={{
              backgroundColor: hovered ? accentColor : '#585b70',
            }}
          >
            {hovered ? 'INSERT' : '100%'}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ContactSection() {
  const { ref, visible } = useIntersectionObserver<HTMLElement>(0.15)
  const [formState, setFormState] = useState<FormState>('idle')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [hovered, setHovered] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !message) return
    const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_URL
    if (!endpoint) {
      setFormState('error')
      return
    }
    setFormState('sending')
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })
      if (!res.ok) {
        setFormState('error')
        return
      }
      setFormState('success')
      setName('')
      setEmail('')
      setMessage('')
    } catch {
      setFormState('error')
    }
  }

  const isFocused = focusedField !== null
  const isBufferActive = hovered || isFocused

  const inputStyle = (field: string) => ({
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    border: `1px solid ${focusedField === field ? '#cba6f7' : 'rgba(255, 255, 255, 0.05)'}`,
    color: '#cdd6f4',
    outline: 'none',
    transition: 'border-color 0.15s',
  })

  return (
    <section
      id="contact"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative py-28 md:py-36 px-6"
      aria-label="Contact"
    >
      <div className="relative max-w-2xl mx-auto">
        <Reveal delay={0.05} direction="up">
          {/* Section label */}
          <div className="flex items-center gap-3 mb-12">
            <span className="section-label">// contact</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <div
            className="text-center mb-10 transition-all duration-700"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)' }}
          >
            <h2
              className="text-3xl font-bold mb-4 text-balance"
              style={{ color: '#cdd6f4' }}
            >
              Let&rsquo;s build something.
            </h2>
            <p className="text-xs leading-relaxed" style={{ color: '#a6adc8', lineHeight: 1.6 }}>
              Open to opportunities, collaborations, or just a good conversation about tech.
            </p>
          </div>

          {/* Neovim Form Card */}
          <NeovimBuffer
            filename="~/dotfiles/contact.txt"
            linesCount={16}
            accentColor="#cba6f7"
            hoverMode="INSERT"
            hovered={isBufferActive}
            setHovered={setHovered}
          >
            <div className="p-2 w-full flex-grow flex flex-col justify-between h-full">
              {formState === 'success' ? (
                <div className="flex flex-col items-center gap-4 py-8 h-full justify-center">
                  <CheckCircle2 size={36} style={{ color: '#a6e3a1' }} />
                  <div className="font-mono text-xs text-center" style={{ color: '#a6e3a1' }}>
                    message sent successfully
                  </div>
                  <div className="font-mono text-[10px]" style={{ color: '#585b70' }}>
                    {'>'} I&apos;ll get back to you soon. Thanks!
                  </div>
                  <button
                    onClick={() => setFormState('idle')}
                    className="mt-2 font-mono text-[10px] px-3 py-1.5 rounded-[2px] transition-colors cursor-none"
                    style={{ backgroundColor: '#313244', color: '#a6adc8', border: '1px solid #45475a' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#cba6f7'; e.currentTarget.style.color = '#cba6f7' }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#45475a'; e.currentTarget.style.color = '#a6adc8' }}
                  >
                    send another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 w-full">
                  <div>
                    <label
                      htmlFor="name"
                      className="block font-mono text-[10px] mb-1.5"
                      style={{ color: '#585b70' }}
                    >
                      {'>'} name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Your name"
                      required
                      className="w-full px-3 py-2 rounded-[2px] font-mono text-sm cursor-none"
                      style={inputStyle('name')}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block font-mono text-[10px] mb-1.5"
                      style={{ color: '#585b70' }}
                    >
                      {'>'} email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="your@email.com"
                      required
                      className="w-full px-3 py-2 rounded-[2px] font-mono text-sm cursor-none"
                      style={inputStyle('email')}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block font-mono text-[10px] mb-1.5"
                      style={{ color: '#585b70' }}
                    >
                      {'>'} message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="What's on your mind?"
                      required
                      className="w-full px-3 py-2 rounded-[2px] font-mono text-sm resize-none cursor-none"
                      style={inputStyle('message')}
                    />
                  </div>

                  {formState === 'error' && (
                    <div className="flex items-center gap-2 font-mono text-[10px]" style={{ color: '#f38ba8' }}>
                      <AlertCircle size={12} />
                      something went wrong. please try again.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={formState === 'sending'}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-[2px] font-mono text-xs font-medium transition-all duration-200 cursor-none"
                    style={{
                      backgroundColor: formState === 'sending' ? '#313244' : '#cba6f7',
                      color: formState === 'sending' ? '#6c7086' : '#1e1e2e',
                    }}
                    onMouseEnter={(e) => {
                      if (formState !== 'sending') {
                        e.currentTarget.style.backgroundColor = '#d4b5f8'
                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(203,166,247,0.2)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (formState !== 'sending') {
                        e.currentTarget.style.backgroundColor = '#cba6f7'
                        e.currentTarget.style.boxShadow = 'none'
                      }
                    }}
                  >
                    {formState === 'sending' ? (
                      <>
                        <span className="animate-spin rounded-full w-3 h-3 border-2 border-current border-t-transparent" />
                        sending...
                      </>
                    ) : (
                      <>
                        <Send size={11} />
                        send message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </NeovimBuffer>

          {/* Social links */}
          <div
            className="mt-8 flex justify-center gap-6 transition-all duration-700"
            style={{
              opacity: visible ? 1 : 0,
              transitionDelay: '200ms',
            }}
          >
            <a
              href="https://github.com/Zainul342"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-mono text-xs transition-all duration-150 cursor-none"
              style={{ color: '#585b70' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#cdd6f4'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#585b70'; e.currentTarget.style.transform = 'translateY(0)' }}
              aria-label="GitHub profile"
            >
              <Github size={14} />
              github
            </a>
            <a
              href="mailto:akuzainul176@gmail.com"
              className="flex items-center gap-2 font-mono text-xs transition-all duration-150 cursor-none"
              style={{ color: '#585b70' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#cba6f7'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#585b70'; e.currentTarget.style.transform = 'translateY(0)' }}
              aria-label="Send email"
            >
              <Mail size={14} />
              email
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer
      className="py-10 px-6 text-center relative border-t border-white/5"
      style={{ backgroundColor: 'var(--ctp-crust)' }}
    >
      {/* Back to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center border border-white/5 bg-[rgba(20,21,27,0.85)] text-[#cba6f7] hover:text-[#d4b5f8] hover:border-white/10 transition-all cursor-none shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
        title="Back to Top"
        aria-label="Back to Top"
      >
        <ArrowUp size={14} />
      </button>

      <p className="font-mono text-xs" style={{ color: '#45475a' }}>
        &copy; {new Date().getFullYear()} built by{' '}
        <span style={{ color: '#585b70' }}>zainul mutaqin</span>
        {' '}—{' '}
        <span style={{ color: '#313244' }}>{'<'}</span>
        <span style={{ color: '#cba6f7' }}>crafted with intent</span>
        <span style={{ color: '#313244' }}>{'/>'}</span>
      </p>
    </footer>
  )
}
