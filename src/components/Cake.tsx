import { AnimatePresence, motion, useTransform, type MotionValue } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { content } from '../content'
import { useBlow } from '../hooks/useBlow'
import { fireworks } from '../lib/celebrate'
import { Flourish } from './Ornaments'
import { SectionTitle } from './SectionTitle'
import { Signature } from './Signature'

const CANDLE_BASE = 134
const CANDLE_HEIGHT = 40

function candleX(i: number, total: number) {
  if (total === 1) return 140
  return 106 + (i * 68) / (total - 1)
}

function dripPath(cx: number, cy: number, rx: number, ry: number, drips: number[]) {
  const n = drips.length
  const edge = (x: number) => cy + ry * Math.sqrt(Math.max(0, 1 - ((x - cx) / rx) ** 2))
  let d = `M${cx - rx} ${cy} A${rx} ${ry} 0 0 0 ${cx + rx} ${cy}`
  for (let i = n - 1; i >= 0; i--) {
    const x = cx - rx + 6 + ((2 * rx - 12) * i) / (n - 1)
    const base = edge(x)
    const depth = drips[i]
    d += ` L${x + 5} ${base + 2} Q${x + 5} ${base + depth} ${x} ${base + depth} Q${x - 5} ${base + depth} ${x - 5} ${base + 2}`
  }
  return `${d} Z`
}

function pearls(cx: number, cy: number, rx: number, ry: number, count: number) {
  return Array.from({ length: count }, (_, i) => {
    const t = Math.PI * (0.06 + (0.88 * i) / (count - 1))
    return { x: cx - rx * Math.cos(t), y: cy + ry * Math.sin(t) }
  })
}

type CandleProps = { x: number; lit: boolean; index: number; lean: MotionValue<number>; onBlow: () => void }

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current" strokeWidth="1.5" strokeLinecap="round">
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </svg>
  )
}

function Candle({ x, lit, index, lean, onBlow }: CandleProps) {
  const top = CANDLE_BASE - CANDLE_HEIGHT

  return (
    <g
      role="button"
      tabIndex={lit ? 0 : -1}
      aria-label={`Задуть свечу ${index + 1}`}
      onClick={lit ? onBlow : undefined}
      onKeyDown={(e) => {
        if (lit && (e.key === 'Enter' || e.key === ' ')) onBlow()
      }}
      className={lit ? 'cursor-pointer outline-none' : 'outline-none'}
    >
      <rect x={x - 14} y={top - 40} width="28" height={CANDLE_HEIGHT + 44} fill="transparent" />
      <rect x={x - 3.5} y={top} width="7" height={CANDLE_HEIGHT} rx="2" fill="url(#cake-candle)" />
      <rect x={x - 3.5} y={top + 10} width="7" height="1.6" fill="url(#cake-gold)" />
      <rect x={x - 3.5} y={top + 26} width="7" height="1.6" fill="url(#cake-gold)" />
      <line x1={x} y1={top} x2={x} y2={top - 5} stroke="#2a1a10" strokeWidth="1.2" strokeLinecap="round" />

      <AnimatePresence>
        {lit && (
          <motion.g
            key="flame"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.2, y: -6 }}
            transition={{ duration: 0.35 }}
          >
            <circle cx={x} cy={top - 13} r="18" fill="#f2c46a" opacity="0.45" filter="url(#cake-glow)" />
            <motion.g style={{ skewX: lean, originY: 1 }}>
              <g className="flame-origin animate-flicker" style={{ animationDelay: `${index * -0.27}s` }}>
                <path
                  d={`M${x} ${top - 25} C${x + 6} ${top - 16} ${x + 6} ${top - 6} ${x} ${top - 4} C${x - 6} ${top - 6} ${x - 6} ${top - 16} ${x} ${top - 25} Z`}
                  fill="url(#cake-flame)"
                />
                <ellipse cx={x} cy={top - 8} rx="1.8" ry="3" fill="#5a7bd8" opacity="0.5" />
              </g>
            </motion.g>
          </motion.g>
        )}
      </AnimatePresence>

      {!lit && (
        <motion.path
          d={`M${x} ${top - 6} c-5 -7 5 -12 0 -19 c-5 -7 5 -12 0 -19 c-4 -6 3 -10 0 -14`}
          fill="none"
          stroke="#f6ebdd"
          strokeOpacity="0.55"
          strokeWidth="1.6"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0.9, y: 0 }}
          animate={{ pathLength: 1, opacity: 0, y: -18 }}
          transition={{ duration: 2.2, ease: 'easeOut' }}
        />
      )}
    </g>
  )
}

type CakeArtProps = { lit: boolean[]; lean: MotionValue<number>; onBlow: (i: number) => void }

function CakeArt({ lit, lean, onBlow }: CakeArtProps) {
  return (
    <svg viewBox="0 0 280 300" className="relative mx-auto w-full max-w-xs overflow-visible">
      <defs>
        <linearGradient id="cake-tier" x1="0" x2="1">
          <stop offset="0" stopColor="#2a0610" />
          <stop offset="0.28" stopColor="#6e1526" />
          <stop offset="0.48" stopColor="#9a2a3d" />
          <stop offset="0.7" stopColor="#6e1526" />
          <stop offset="1" stopColor="#2a0610" />
        </linearGradient>
        <linearGradient id="cake-cream" x1="0" x2="1">
          <stop offset="0" stopColor="#cdb595" />
          <stop offset="0.45" stopColor="#fdf6ec" />
          <stop offset="1" stopColor="#cdb595" />
        </linearGradient>
        <linearGradient id="cake-top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffaf2" />
          <stop offset="1" stopColor="#e6d2b6" />
        </linearGradient>
        <linearGradient id="cake-gold" x1="0" x2="1">
          <stop offset="0" stopColor="#7d5f30" />
          <stop offset="0.5" stopColor="#f6e7bf" />
          <stop offset="1" stopColor="#7d5f30" />
        </linearGradient>
        <linearGradient id="cake-plate" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6e7bf" />
          <stop offset="1" stopColor="#8a6a35" />
        </linearGradient>
        <linearGradient id="cake-candle" x1="0" x2="1">
          <stop offset="0" stopColor="#d8c4a8" />
          <stop offset="0.5" stopColor="#fffaf2" />
          <stop offset="1" stopColor="#c9b08f" />
        </linearGradient>
        <radialGradient id="cake-flame" cx="0.5" cy="0.72" r="0.65">
          <stop offset="0" stopColor="#fffef6" />
          <stop offset="0.35" stopColor="#fff0b8" />
          <stop offset="0.7" stopColor="#f2c46a" />
          <stop offset="1" stopColor="#d9822e" />
        </radialGradient>
        <filter id="cake-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>

      <ellipse cx="140" cy="276" rx="132" ry="20" fill="#000" opacity="0.35" filter="url(#cake-glow)" />
      <ellipse cx="140" cy="270" rx="128" ry="18" fill="url(#cake-plate)" />
      <ellipse cx="140" cy="266" rx="118" ry="13" fill="#f3e3c3" />
      <ellipse cx="140" cy="266" rx="118" ry="13" fill="none" stroke="#a8834a" strokeOpacity="0.5" />

      <path d="M40 200 V258 A100 14 0 0 0 240 258 V200 Z" fill="url(#cake-tier)" />
      <ellipse cx="140" cy="200" rx="100" ry="14" fill="url(#cake-top)" />
      <path d={dripPath(140, 200, 100, 14, [14, 7, 20, 10, 16, 6, 22, 9, 15, 8, 18, 11])} fill="url(#cake-cream)" />
      {pearls(140, 256, 100, 14, 17).map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3.2" fill="url(#cake-gold)" />
      ))}

      <path d="M76 134 V196 A64 10 0 0 0 204 196 V134 Z" fill="url(#cake-tier)" />
      <path d="M76 178 A64 10 0 0 0 204 178 V183 A64 10 0 0 1 76 183 Z" fill="url(#cake-gold)" />
      <ellipse cx="140" cy="134" rx="64" ry="10" fill="url(#cake-top)" />
      <path d={dripPath(140, 134, 64, 10, [12, 6, 16, 8, 13, 5, 17, 9])} fill="url(#cake-cream)" />

      {lit.map((isLit, i) => (
        <Candle key={i} x={candleX(i, lit.length)} lit={isLit} index={i} lean={lean} onBlow={() => onBlow(i)} />
      ))}
    </svg>
  )
}

export function Cake({ onListenChange }: { onListenChange?: (on: boolean) => void }) {
  const { eyebrow, title, hint, micButton, listening, tapHint, denied, candles } = content.cake
  const finale = content.finale
  const [lit, setLit] = useState(() => Array.from({ length: candles }, () => true))
  const finaleRef = useRef<HTMLDivElement>(null)
  const litCount = lit.filter(Boolean).length
  const allOut = litCount === 0

  const blowNext = useCallback(() => {
    navigator.vibrate?.(12)
    setLit((prev) => {
      const burning = prev.flatMap((l, i) => (l ? [i] : []))
      if (burning.length === 0) return prev
      const pick = burning[Math.floor(Math.random() * burning.length)]
      return prev.map((l, j) => (j === pick ? false : l))
    })
  }, [])

  const mic = useBlow(blowNext)
  const { stop: stopMic } = mic
  const lean = useTransform(mic.level, [0, 0.6], [0, -30])
  const ring = useTransform(mic.level, [0, 0.6], [1, 1.9])
  const micUnavailable = mic.status === 'denied' || mic.status === 'unsupported'

  useEffect(() => {
    onListenChange?.(mic.status === 'listening')
  }, [mic.status, onListenChange])

  useEffect(() => {
    if (!allOut) return
    stopMic()
    navigator.vibrate?.([20, 80, 30])
    const boom = window.setTimeout(fireworks, 500)
    const scroll = window.setTimeout(
      () => finaleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
      1100,
    )
    return () => {
      window.clearTimeout(boom)
      window.clearTimeout(scroll)
    }
  }, [allOut, stopMic])

  const blow = (i: number) => {
    navigator.vibrate?.(12)
    setLit((prev) => prev.map((l, j) => (j === i ? false : l)))
  }
  const relight = () => setLit(Array.from({ length: candles }, () => true))

  return (
    <section className="px-5 pt-24 pb-32">
      <SectionTitle eyebrow={eyebrow} title={title} />
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 1 }}
        className="mt-4 text-center text-xl text-cream/75 italic"
      >
        {hint}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative mt-16"
      >
        <motion.div
          aria-hidden
          className="absolute -top-16 left-1/2 size-112 -translate-x-1/2 rounded-full bg-radial from-gold-400/30 via-gold-600/10 to-transparent to-70%"
          animate={{ opacity: (litCount / candles) * 0.9 + 0.1 }}
          transition={{ duration: 0.8 }}
        />
        <CakeArt lit={lit} lean={lean} onBlow={blow} />
      </motion.div>

      {!allOut && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-10 flex flex-col items-center gap-3 text-center"
        >
          {mic.status === 'listening' ? (
            <>
              <div className="relative flex size-14 items-center justify-center">
                <motion.span style={{ scale: ring }} className="absolute inset-0 rounded-full bg-gold-400/25" />
                <span className="relative flex size-12 items-center justify-center rounded-full border border-gold-400/60 bg-wine-900/70 text-gold-300">
                  <MicIcon />
                </span>
              </div>
              <motion.p
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-2xl text-cream italic"
              >
                {listening}
              </motion.p>
            </>
          ) : micUnavailable ? (
            <p className="max-w-xs text-lg text-cream/70 italic">{denied}</p>
          ) : (
            <button
              type="button"
              onClick={mic.start}
              disabled={mic.status === 'starting'}
              className="flex items-center gap-3 rounded-full border border-gold-500/50 bg-wine-900/50 px-6 py-3 text-lg text-gold-200 shadow-card backdrop-blur-sm transition-colors active:bg-wine-800 disabled:opacity-60"
            >
              <MicIcon />
              {micButton}
            </button>
          )}
          {!micUnavailable && <p className="text-base text-cream/50 italic">{tapHint}</p>}
        </motion.div>
      )}

      <div ref={finaleRef}>
        <AnimatePresence>
          {allOut && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.8, duration: 1.2 }}
              className="mx-auto mt-16 flex max-w-md flex-col items-center text-center"
            >
              <Signature text={finale.title} start="mount" delay={1.2} speed={0.12} shine className="h-20 w-auto max-w-full" />
              <Flourish start="mount" delay={3.2} className="mt-1 w-48" />
              <motion.p
                initial={{ opacity: 0, filter: 'blur(8px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                transition={{ delay: 3.8, duration: 1.4 }}
                className="mt-6 text-2xl leading-relaxed text-cream"
              >
                {finale.text}
              </motion.p>
              <Signature text={finale.signature} start="mount" delay={4.8} speed={0.12} className="mt-6 h-12 w-auto max-w-full" />
              <motion.button
                type="button"
                onClick={relight}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 6.5 }}
                className="mt-12 rounded-full border border-gold-500/40 px-6 py-2.5 text-base tracking-wide text-cream/70 transition-colors active:bg-wine-800"
              >
                {finale.replay}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
