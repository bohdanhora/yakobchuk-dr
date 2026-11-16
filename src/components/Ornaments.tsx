import { motion, useInView } from 'motion/react'
import { useId, useRef } from 'react'

type DrawProps = {
  className?: string
  delay?: number
  start?: 'mount' | 'view'
}

function useStart(start: 'mount' | 'view') {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.8 })
  return { ref, on: start === 'mount' || inView }
}

function GoldStroke({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#a8834a" stopOpacity="0" />
      <stop offset="0.2" stopColor="#c9a66b" />
      <stop offset="0.5" stopColor="#f6e7bf" />
      <stop offset="0.8" stopColor="#c9a66b" />
      <stop offset="1" stopColor="#a8834a" stopOpacity="0" />
    </linearGradient>
  )
}

export function Flourish({ className = '', delay = 0, start = 'view' }: DrawProps) {
  const { ref, on } = useStart(start)
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')

  return (
    <svg ref={ref} viewBox="0 0 320 48" fill="none" aria-hidden className={className}>
      <defs>
        <GoldStroke id={`${uid}g`} />
      </defs>
      <motion.path
        d="M6 28 C 60 30, 104 14, 148 22 C 172 27, 184 40, 170 42 C 154 44, 152 26, 176 19 C 214 8, 262 26, 314 20"
        stroke={`url(#${uid}g)`}
        strokeWidth="1.4"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={on ? { pathLength: 1, opacity: 1 } : undefined}
        transition={{ delay, duration: 1.8, ease: [0.45, 0, 0.25, 1] }}
      />
      <motion.path
        d="M160 2 L164 6 L160 10 L156 6 Z"
        fill="#e3c88f"
        initial={{ opacity: 0, scale: 0 }}
        animate={on ? { opacity: 1, scale: 1 } : undefined}
        transition={{ delay: delay + 1.4, duration: 0.5 }}
      />
    </svg>
  )
}

export function Divider({ className = '', delay = 0, start = 'view' }: DrawProps) {
  const { ref, on } = useStart(start)
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')

  return (
    <svg ref={ref} viewBox="0 0 200 20" fill="none" aria-hidden className={className}>
      <defs>
        <GoldStroke id={`${uid}g`} />
      </defs>
      <motion.path
        d="M88 10 H4"
        stroke={`url(#${uid}g)`}
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={on ? { pathLength: 1 } : undefined}
        transition={{ delay: delay + 0.3, duration: 1.1, ease: 'easeOut' }}
      />
      <motion.path
        d="M112 10 H196"
        stroke={`url(#${uid}g)`}
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={on ? { pathLength: 1 } : undefined}
        transition={{ delay: delay + 0.3, duration: 1.1, ease: 'easeOut' }}
      />
      <motion.g
        initial={{ opacity: 0, scale: 0, rotate: -90 }}
        animate={on ? { opacity: 1, scale: 1, rotate: 0 } : undefined}
        transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: '100px 10px' }}
      >
        <path d="M100 2 L106 10 L100 18 L94 10 Z" stroke="#d9bb82" strokeWidth="1" />
        <path d="M100 6 L103 10 L100 14 L97 10 Z" fill="#e3c88f" />
        <circle cx="90" cy="10" r="1.3" fill="#d9bb82" />
        <circle cx="110" cy="10" r="1.3" fill="#d9bb82" />
      </motion.g>
    </svg>
  )
}

export function Corner({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path d="M2 20 V8 Q2 2 8 2 H20" stroke="currentColor" strokeWidth="1" />
      <path d="M6 20 V10 Q6 6 10 6 H20" stroke="currentColor" strokeWidth="0.6" opacity="0.6" />
      <circle cx="2" cy="22" r="1.2" fill="currentColor" />
      <circle cx="22" cy="2" r="1.2" fill="currentColor" />
    </svg>
  )
}
