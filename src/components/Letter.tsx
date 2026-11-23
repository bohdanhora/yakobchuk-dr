import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { content } from '../content'
import { Corner } from './Ornaments'
import { Signature } from './Signature'
import { WaxSeal } from './WaxSeal'

export function Letter() {
  const { title, paragraphs, signature } = content.letter
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.3'] })
  const rotateX = useTransform(scrollYProgress, [0, 1], [28, 0])
  const y = useTransform(scrollYProgress, [0, 1], [90, 0])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])

  return (
    <section ref={ref} className="px-4 py-24 perspective-distant">
      <motion.article
        style={{ rotateX, y, opacity }}
        className="paper relative mx-auto max-w-md origin-bottom px-8 pt-12 pb-10 text-wine-900 shadow-letter"
      >
        <div className="pointer-events-none absolute inset-3 border border-gold-500/50" />
        <div className="pointer-events-none absolute inset-4 border border-gold-500/20" />
        <Corner className="absolute top-5 left-5 size-5 text-gold-500" />
        <Corner className="absolute top-5 right-5 size-5 rotate-90 text-gold-500" />
        <Corner className="absolute right-5 bottom-5 size-5 rotate-180 text-gold-500" />
        <Corner className="absolute bottom-5 left-5 size-5 -rotate-90 text-gold-500" />

        <Signature text={title} tone="wine" speed={0.11} className="relative h-12 w-auto max-w-full" />

        {paragraphs.map((text, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 14, filter: 'blur(5px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.9 }}
            transition={{ duration: 1, delay: 0.15 }}
            className="relative mt-5 text-xl leading-relaxed"
          >
            {text}
          </motion.p>
        ))}

        <div className="relative mt-10 flex items-end justify-between gap-4">
          <motion.div
            className="shrink-0"
            initial={{ scale: 2, opacity: 0, rotate: -30 }}
            whileInView={{ scale: 1, opacity: 1, rotate: -10 }}
            viewport={{ once: true, amount: 1 }}
            transition={{ delay: 0.8, type: 'spring', stiffness: 300, damping: 15 }}
          >
            <WaxSeal className="size-16 drop-shadow-md" />
          </motion.div>
          <div className="flex min-w-0 flex-col items-end gap-1">
            {signature.map((line, i, lines) => (
              <Signature
                key={i}
                text={line}
                tone="wine"
                delay={0.2 + lines.slice(0, i).join('').length * 0.11}
                speed={0.11}
                className="h-10 w-auto max-w-full min-w-0"
              />
            ))}
          </div>
        </div>
      </motion.article>
    </section>
  )
}
