'use client'

import { useEffect, useRef, useState } from 'react'
import { Github, Mail, Send, CheckCircle2, AlertCircle } from 'lucide-react'

type FormState = 'idle' | 'sending' | 'success' | 'error'

function useIntersectionObserver(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

export function ContactSection() {
  const { ref, visible } = useIntersectionObserver()
  const [formState, setFormState] = useState<FormState>('idle')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [focusedField, setFocusedField] = useState<string | null>(null)

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

  const inputStyle = (field: string) => ({
    backgroundColor: '#181825',
    border: `1px solid ${focusedField === field ? '#cba6f7' : '#313244'}`,
    color: '#cdd6f4',
    boxShadow: focusedField === field ? '0 0 0 2px rgba(203, 166, 247, 0.12)' : 'none',
    outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  })

  return (
    <section
      id="contact"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative py-24 px-6"
      aria-label="Contact"
    >
      {/* Subtle background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 80%, rgba(203,166,247,0.04), transparent)',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-2xl mx-auto">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-12">
          <span className="section-label">// contact</span>
          <div className="flex-1 h-px" style={{ backgroundColor: '#313244' }} />
        </div>

        <div
          className="text-center mb-12 transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)' }}
        >
          <h2
            className="text-4xl font-bold mb-4 text-balance"
            style={{ color: '#cdd6f4' }}
          >
            Let&rsquo;s build something.
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: '#a6adc8', lineHeight: 1.7 }}>
            Open to opportunities, collaborations, or just a good conversation about tech.
          </p>
        </div>

        {/* Form */}
        <div
          className="rounded-lg overflow-hidden transition-all duration-700"
          style={{
            backgroundColor: '#181825',
            border: '1px solid #313244',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '100ms',
          }}
        >
          {/* Terminal header */}
          <div className="traffic-lights">
            <span className="traffic-light" style={{ backgroundColor: '#f38ba8' }} aria-hidden="true" />
            <span className="traffic-light" style={{ backgroundColor: '#f9e2af' }} aria-hidden="true" />
            <span className="traffic-light" style={{ backgroundColor: '#a6e3a1' }} aria-hidden="true" />
            <span className="font-mono text-xs ml-2" style={{ color: '#6c7086' }}>
              ~/contact — zainul@portfolio
            </span>
          </div>

          <div className="p-6">
            {formState === 'success' ? (
              <div className="flex flex-col items-center gap-4 py-8">
                <CheckCircle2 size={36} style={{ color: '#a6e3a1' }} />
                <div className="font-mono text-sm text-center" style={{ color: '#a6e3a1' }}>
                  message sent successfully
                </div>
                <div className="font-mono text-xs" style={{ color: '#6c7086' }}>
                  {'>'} I&apos;ll get back to you soon. Thanks!
                </div>
                <button
                  onClick={() => setFormState('idle')}
                  className="mt-2 font-mono text-xs px-4 py-2 rounded transition-colors cursor-none"
                  style={{ backgroundColor: '#313244', color: '#a6adc8', border: '1px solid #45475a' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#cba6f7'; e.currentTarget.style.color = '#cba6f7' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#45475a'; e.currentTarget.style.color = '#a6adc8' }}
                >
                  send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block font-mono text-xs mb-1.5"
                    style={{ color: '#6c7086' }}
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
                    className="w-full px-3 py-2.5 rounded font-mono text-base cursor-none"
                    style={inputStyle('name')}
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block font-mono text-xs mb-1.5"
                    style={{ color: '#6c7086' }}
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
                    className="w-full px-3 py-2.5 rounded font-mono text-base cursor-none"
                    style={inputStyle('email')}
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block font-mono text-xs mb-1.5"
                    style={{ color: '#6c7086' }}
                  >
                    {'>'} message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="What's on your mind?"
                    required
                    className="w-full px-3 py-2.5 rounded font-mono text-base resize-none cursor-none"
                    style={inputStyle('message')}
                  />
                </div>

                {formState === 'error' && (
                  <div className="flex items-center gap-2 font-mono text-xs" style={{ color: '#f38ba8' }}>
                    <AlertCircle size={13} />
                    something went wrong. please try again.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={formState === 'sending'}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded font-mono text-sm font-medium transition-all duration-200 cursor-none"
                  style={{
                    backgroundColor: formState === 'sending' ? '#313244' : '#cba6f7',
                    color: formState === 'sending' ? '#6c7086' : '#1e1e2e',
                  }}
                  onMouseEnter={(e) => {
                    if (formState !== 'sending') {
                      e.currentTarget.style.backgroundColor = '#d4b5f8'
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(203,166,247,0.25)'
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
                      <span className="animate-spin rounded-full w-3.5 h-3.5 border-2 border-current border-t-transparent" />
                      sending...
                    </>
                  ) : (
                    <>
                      <Send size={13} />
                      send message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

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
            style={{ color: '#6c7086' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#cdd6f4'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#6c7086'; e.currentTarget.style.transform = 'translateY(0)' }}
            aria-label="GitHub profile"
          >
            <Github size={15} />
            github
          </a>
          <a
            href="mailto:zainul@example.com"
            className="flex items-center gap-2 font-mono text-xs transition-all duration-150 cursor-none"
            style={{ color: '#6c7086' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#cba6f7'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#6c7086'; e.currentTarget.style.transform = 'translateY(0)' }}
            aria-label="Send email"
          >
            <Mail size={15} />
            email
          </a>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer
      className="py-6 px-6 text-center"
      style={{ borderTop: '1px solid #313244' }}
    >
      <p className="font-mono text-xs" style={{ color: '#45475a' }}>
        built by{' '}
        <span style={{ color: '#6c7086' }}>zainul mutaqin</span>
        {' '}—{' '}
        <span style={{ color: '#313244' }}>{'<'}</span>
        <span style={{ color: '#cba6f7' }}>crafted with intent</span>
        <span style={{ color: '#313244' }}>{'/>'}</span>
      </p>
    </footer>
  )
}
