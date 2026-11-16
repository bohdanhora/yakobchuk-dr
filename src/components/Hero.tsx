import { motion } from 'motion/react'
import { useCallback, useRef, useState } from 'react'
import { content } from '../content'
import { sparkle } from '../lib/celebrate'
import { Flourish } from './Ornaments'
import { Signature } from './Signature'
import { WaxSeal } from './WaxSeal'

export function Hero() {
  const { eyebrow, greeting, tagline, scrollHint } = content.hero
  const [written, setWritten] = useState(false)
  const nameRef = useRef<HTMLDivElement>(null)

  const onWritten = useCallback(() => {
    setWritten(true)
    const rect = nameRef.current?.getBoundingClientRect()
    if (!rect) return
    sparkle((rect.left + rect.width / 2) / window.innerWidth, (rect.top + rect.height / 2) / window.innerHeight, 55)
  }, [])

  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 text-center">
      <motion.div
        aria-hidden
        className="absolute top-1/2 left-1/2 size-128 -translate-1/2 rounded-full bg-radial from-gold-500/25 to-transparent to-65%"
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: written ? 1 : 0.35, scale: written ? 1 : 0.6 }}
        transition={{ duration: 2.4, ease: 'easeOut' }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.4, rotate: -30 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 140, damping: 14 }}
      >
        <WaxSeal className="size-14 drop-shadow-lg" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, letterSpacing: '0.7em' }}
        animate={{ opacity: 1, letterSpacing: '0.3em' }}
        transition={{ delay: 0.6, duration: 2 }}
        className="relative mt-7 text-xs text-gold-400 uppercase"
      >
        {eyebrow}
      </motion.p>

      <div ref={nameRef} className="relative mt-3 w-full">
        <Signature
          text={content.name}
          start="mount"
          delay={1.1}
          speed={0.21}
          shine
          onDone={onWritten}
          className="mx-auto h-28 w-auto max-w-full xs:h-32"
        />
      </div>

      <Flourish start="mount" delay={2.8} className="relative -mt-1 w-56" />

      <motion.p
        initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ delay: 3.6, duration: 1.4 }}
        className="relative mt-6 font-serif text-4xl text-cream italic"
      >
        {greeting}
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 4.3, duration: 1.2 }}
        className="relative mt-4 max-w-xs text-lg leading-snug text-cream/65"
      >
        {tagline}
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5.4, duration: 1 }}
        className="absolute bottom-8 flex flex-col items-center gap-2 text-cream/60"
      >
        <span className="text-xs tracking-widest uppercase">{scrollHint}</span>
        <svg viewBox="0 0 24 24" className="size-5 animate-bob fill-none stroke-current" strokeWidth="1.2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </motion.div>
    </section>
  )
}
