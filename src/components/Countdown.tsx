import { AnimatePresence, motion } from 'motion/react'
import { content } from '../content'
import type { TimeLeft } from '../hooks/useCountdown'
import { plural } from '../lib/celebrate'
import { Divider } from './Ornaments'
import { WaxSeal } from './WaxSeal'

const units: { key: keyof TimeLeft; forms: [string, string, string] }[] = [
  { key: 'days', forms: ['день', 'дня', 'дней'] },
  { key: 'hours', forms: ['час', 'часа', 'часов'] },
  { key: 'minutes', forms: ['минута', 'минуты', 'минут'] },
  { key: 'seconds', forms: ['секунда', 'секунды', 'секунд'] },
]

export function Countdown({ time }: { time: TimeLeft }) {
  const { eyebrow, title, subtitle } = content.countdown

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.96, filter: 'blur(6px)' }}
      transition={{ duration: 1 }}
      className="flex min-h-svh flex-col items-center justify-center px-6 text-center"
    >
      <motion.div
        animate={{ y: [0, -6, 0], rotate: [-3, 3, -3] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <WaxSeal className="size-20 drop-shadow-xl" />
      </motion.div>
      <p className="mt-8 text-xs tracking-widest text-gold-400 uppercase">{eyebrow}</p>
      <h1 className="text-gold mt-3 font-serif text-5xl leading-tight italic">{title}</h1>
      <Divider start="mount" delay={0.6} className="mt-3 w-44" />
      <p className="mt-4 max-w-xs text-xl text-cream/75 italic">{subtitle}</p>

      <div className="mt-12 grid grid-cols-4 gap-2.5">
        {units.map(({ key, forms }) => (
          <div
            key={key}
            className="flex w-18 flex-col items-center rounded-2xl border border-gold-500/30 bg-linear-to-b from-wine-800/70 to-wine-950/70 py-3 shadow-card backdrop-blur-sm"
          >
            <div className="relative h-10 w-full overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={time[key]}
                  initial={{ y: -28, opacity: 0, filter: 'blur(4px)' }}
                  animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                  exit={{ y: 28, opacity: 0, filter: 'blur(4px)' }}
                  transition={{ duration: 0.45 }}
                  className="text-gold absolute inset-0 font-serif text-4xl font-medium lining-nums tabular-nums"
                >
                  {String(time[key]).padStart(2, '0')}
                </motion.span>
              </AnimatePresence>
            </div>
            <span className="mt-1 text-xs text-gold-400/80">{plural(time[key], forms)}</span>
          </div>
        ))}
      </div>
    </motion.section>
  )
}
