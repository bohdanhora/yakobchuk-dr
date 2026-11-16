import { motion, type Variants } from 'motion/react'
import { Divider } from './Ornaments'

const word: Variants = {
  hidden: { y: '110%' },
  show: (i: number) => ({ y: '0%', transition: { delay: 0.15 + i * 0.09, duration: 1, ease: [0.22, 1, 0.36, 1] } }),
}

export function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  const words = title.split(' ')

  return (
    <header className="text-center">
      <motion.p
        initial={{ opacity: 0, letterSpacing: '0.6em' }}
        whileInView={{ opacity: 1, letterSpacing: '0.3em' }}
        viewport={{ once: true, amount: 1 }}
        transition={{ duration: 1.4 }}
        className="text-xs text-gold-400 uppercase"
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.8 }}
        className="mt-4 font-serif text-5xl leading-none italic"
        aria-label={title}
      >
        {words.map((text, i) => (
          <span key={i} aria-hidden className="inline-block overflow-hidden pb-2 align-bottom">
            <motion.span custom={i} variants={word} className="text-gold inline-block px-1">
              {text}
            </motion.span>
          </span>
        ))}
      </motion.h2>
      <Divider delay={0.5} className="mx-auto mt-4 w-48" />
    </header>
  )
}
