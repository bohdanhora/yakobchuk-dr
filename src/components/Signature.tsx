import { motion, useInView } from 'motion/react'
import { useEffect, useId, useRef, useState } from 'react'
import { layoutText, loadScriptFonts, type TextLayout } from '../lib/fonts'

const tones = {
  gold: { stops: ['#fbf0d0', '#e3c88f', '#b8914f', '#8a6a35'], pen: true },
  wine: { stops: ['#a33246', '#7a1f2e', '#4a0a18'], pen: false },
}

type Props = {
  text: string
  className?: string
  tone?: keyof typeof tones
  delay?: number
  speed?: number
  start?: 'mount' | 'view'
  shine?: boolean
  onDone?: () => void
}

export function Signature({
  text,
  className = '',
  tone = 'gold',
  delay = 0,
  speed = 0.2,
  start = 'view',
  shine = false,
  onDone,
}: Props) {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [layout, setLayout] = useState<TextLayout | null>(null)
  const doneRef = useRef(onDone)
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const palette = tones[tone]

  useEffect(() => {
    doneRef.current = onDone
  })

  useEffect(() => {
    let alive = true
    loadScriptFonts().then((fonts) => {
      if (alive) setLayout(layoutText(fonts, text))
    })
    return () => {
      alive = false
    }
  }, [text])

  const active = layout !== null && (start === 'mount' || inView)
  const count = layout?.glyphs.length ?? 0
  const draw = speed * 2.6
  const total = delay + count * speed + draw

  useEffect(() => {
    if (!active) return
    const id = window.setTimeout(() => doneRef.current?.(), total * 1000)
    return () => window.clearTimeout(id)
  }, [active, total])

  return (
    <svg
      ref={ref}
      viewBox={layout?.viewBox ?? '0 0 400 120'}
      className={`overflow-visible ${className}`}
      role="img"
      aria-label={text}
    >
      <defs>
        <linearGradient id={`${uid}fill`} x1="0" y1="0" x2="0" y2="1">
          {palette.stops.map((color, i) => (
            <stop key={color} offset={i / (palette.stops.length - 1)} stopColor={color} />
          ))}
        </linearGradient>
        <linearGradient id={`${uid}shine`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id={`${uid}glow`} x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
        {layout && shine && (
          <mask id={`${uid}mask`}>
            {layout.glyphs.map((g, i) => (
              <path key={i} d={g.d} fill="#fff" />
            ))}
          </mask>
        )}
      </defs>

      {active &&
        layout.glyphs.map((g, i) => {
          const at = delay + i * speed
          return (
            <g key={i}>
              <motion.path
                d={g.d}
                fill="none"
                stroke={`url(#${uid}fill)`}
                strokeWidth={1.1}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  pathLength: { delay: at, duration: draw, ease: [0.45, 0, 0.3, 1] },
                  opacity: { delay: at, duration: 0.01 },
                }}
              />
              <motion.path
                d={g.d}
                fill={`url(#${uid}fill)`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: at + draw * 0.6, duration: 0.8 }}
              />
            </g>
          )
        })}

      {active && palette.pen && count > 0 && (
        <motion.circle
          r={3.2}
          fill="#fff7de"
          filter={`url(#${uid}glow)`}
          initial={{ opacity: 0, cx: layout.glyphs[0].cx, cy: layout.glyphs[0].cy }}
          animate={{
            cx: layout.glyphs.map((g) => g.cx),
            cy: layout.glyphs.map((g) => g.cy),
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            delay,
            duration: count * speed + draw * 0.5,
            ease: 'linear',
            opacity: { delay, duration: count * speed + draw * 0.5, times: [0, 0.05, 0.9, 1] },
          }}
        />
      )}

      {active && shine && (
        <g mask={`url(#${uid}mask)`}>
          <motion.rect
            y={layout.y}
            height={layout.height}
            width={layout.width * 0.35}
            fill={`url(#${uid}shine)`}
            initial={{ x: layout.x - layout.width * 0.4 }}
            animate={{ x: layout.x + layout.width * 1.05 }}
            transition={{ delay: total + 0.2, duration: 1.8, ease: 'easeInOut', repeat: Infinity, repeatDelay: 4 }}
          />
        </g>
      )}
    </svg>
  )
}
