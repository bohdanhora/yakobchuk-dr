import { motion } from 'motion/react'
import { useRef, useState } from 'react'
import { content, type Reason } from '../content'
import { sparkle } from '../lib/celebrate'
import { Corner } from './Ornaments'
import { SectionTitle } from './SectionTitle'

const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']

function FlipCard({ reason, index }: { reason: Reason; index: number }) {
  const [flipped, setFlipped] = useState(false)
  const ref = useRef<HTMLButtonElement>(null)

  const flip = () => {
    if (!flipped) {
      const rect = ref.current?.getBoundingClientRect()
      if (rect) sparkle((rect.left + rect.width / 2) / window.innerWidth, (rect.top + rect.height / 2) / window.innerHeight, 22)
      navigator.vibrate?.(10)
    }
    setFlipped((f) => !f)
  }

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={flip}
      aria-pressed={flipped}
      initial={{ opacity: 0, y: 40, rotateY: -25 }}
      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.9, delay: (index % 2) * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="aspect-3/4 perspective-distant"
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
        className="relative size-full transform-3d"
      >
        <div className="absolute inset-0 overflow-hidden rounded-2xl bg-linear-to-br from-wine-700 via-wine-800 to-wine-950 p-2 shadow-card backface-hidden">
          <div className="relative flex size-full flex-col items-center justify-center rounded-xl border border-gold-500/50">
            <div className="absolute inset-1 rounded-lg border border-gold-500/20" />
            <Corner className="absolute top-2 left-2 size-4 text-gold-500/80" />
            <Corner className="absolute top-2 right-2 size-4 rotate-90 text-gold-500/80" />
            <Corner className="absolute right-2 bottom-2 size-4 rotate-180 text-gold-500/80" />
            <Corner className="absolute bottom-2 left-2 size-4 -rotate-90 text-gold-500/80" />
            <span className="text-gold font-serif text-6xl leading-none italic">{roman[index % roman.length]}</span>
            <span className="mt-4 px-3 text-xs tracking-widest text-gold-300/80 uppercase">{reason.front}</span>
          </div>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 w-1/2 -skew-x-12 bg-linear-to-r from-transparent via-white/15 to-transparent"
            initial={{ x: '-150%' }}
            whileInView={{ x: '350%' }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 + (index % 2) * 0.15, duration: 1.4, ease: 'easeInOut' }}
          />
        </div>
        <div className="paper absolute inset-0 flex rotate-y-180 flex-col items-center justify-center rounded-2xl p-5 text-center shadow-card backface-hidden">
          <div className="absolute inset-2 rounded-xl border border-gold-500/40" />
          <span className="relative font-serif text-xl leading-snug text-wine-900 italic">{reason.back}</span>
          <svg viewBox="0 0 24 24" className="relative mt-3 size-4 fill-wine-600">
            <path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11z" />
          </svg>
          {reason.note && (
            <span className="relative mt-2 font-hand text-lg leading-tight text-wine-900/60">({reason.note})</span>
          )}
        </div>
      </motion.div>
    </motion.button>
  )
}

export function Reasons() {
  const { eyebrow, title, items } = content.reasons

  return (
    <section className="px-5 py-24">
      <SectionTitle eyebrow={eyebrow} title={title} />
      <div className="mx-auto mt-14 grid max-w-md grid-cols-2 gap-4">
        {items.map((reason, i) => (
          <FlipCard key={i} reason={reason} index={i} />
        ))}
      </div>
    </section>
  )
}
