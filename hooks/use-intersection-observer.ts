'use client'

import { useEffect, useRef, useState } from 'react'

export function useIntersectionObserver<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
        }
      },
      { threshold }
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return { ref, visible }
}
