import { motion, useAnimate } from 'motion/react'
import { useState } from 'react'
import { content } from '../content'
import { Signature } from './Signature'
import { WaxSeal } from './WaxSeal'

type Props = {
  onTap: () => void
  onOpen: () => void
}

const crackLeft = 'polygon(0 0, 54% 0, 47% 22%, 56% 41%, 46% 60%, 54% 79%, 49% 100%, 0 100%)'
const crackRight = 'polygon(54% 0, 100% 0, 100% 100%, 49% 100%, 54% 79%, 46% 60%, 56% 41%, 47% 22%)'

function Pocket() {
  return (
    <svg viewBox="0 0 320 208" preserveAspectRatio="none" className="absolute inset-0 z-20 size-full">
      <defs>
        <linearGradient id="env-side-l" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e4d2ba" />
          <stop offset="1" stopColor="#f3e7d6" />
        </linearGradient>
        <linearGradient id="env-side-r" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#e0cdb3" />
          <stop offset="1" stopColor="#f1e4d2" />
        </linearGradient>
        <linearGradient id="env-bottom" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#f9f1e6" />
          <stop offset="1" stopColor="#eadbc5" />
        </linearGradient>
      </defs>
      <path d="M0 0 L154 112 L0 208 Z" fill="url(#env-side-l)" />
      <path d="M320 0 L166 112 L320 208 Z" fill="url(#env-side-r)" />
      <path d="M0 208 L144 110 Q160 99 176 110 L320 208 Z" fill="url(#env-bottom)" stroke="#8a6a35" strokeOpacity="0.18" />
      <path d="M12 203 L146 116 Q160 107 174 116 L308 203" fill="none" stroke="#c9a66b" strokeOpacity="0.55" strokeWidth="0.8" />
    </svg>
  )
}

function Flap() {
  return (
    <div data-flap className="absolute inset-x-0 top-0 z-30 h-32 origin-top transform-3d">
      <svg viewBox="0 0 320 128" preserveAspectRatio="none" className="absolute inset-0 size-full drop-shadow-lg backface-hidden">
        <defs>
          <linearGradient id="env-flap" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fbf4ea" />
            <stop offset="1" stopColor="#ecdcc7" />
          </linearGradient>
        </defs>
        <path d="M0 0 H320 L176 113 Q160 124 144 113 Z" fill="url(#env-flap)" />
        <path d="M14 5 L150 106 Q160 113 170 106 L306 5" fill="none" stroke="#c9a66b" strokeOpacity="0.6" strokeWidth="0.8" />
      </svg>
      <svg
        viewBox="0 0 320 128"
        preserveAspectRatio="none"
        className="absolute inset-0 size-full backface-hidden"
        style={{ transform: 'rotateX(180deg)' }}
      >
        <defs>
          <linearGradient id="env-liner" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#5a0e1e" />
            <stop offset="1" stopColor="#7a1f2e" />
          </linearGradient>
          <pattern id="env-damask" width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M8 2 L14 8 L8 14 L2 8 Z" fill="none" stroke="#c9a66b" strokeOpacity="0.35" strokeWidth="0.6" />
            <circle cx="8" cy="8" r="1" fill="#c9a66b" fillOpacity="0.45" />
          </pattern>
        </defs>
        <path d="M0 128 H320 L176 15 Q160 4 144 15 Z" fill="url(#env-liner)" />
        <path d="M0 128 H320 L176 15 Q160 4 144 15 Z" fill="url(#env-damask)" />
      </svg>
    </div>
  )
}

export function Envelope({ onTap, onOpen }: Props) {
  const [scope, animate] = useAnimate()
  const [opening, setOpening] = useState(false)
  const { eyebrow, title, addressee, hint } = content.envelope

  const open = async () => {
    if (opening) return
    setOpening(true)
    onTap()
    navigator.vibrate?.(25)

    animate('[data-hint]', { opacity: 0, y: 10 }, { duration: 0.3 })
    animate('[data-ripple]', { opacity: 0 }, { duration: 0.2 })
    await animate('[data-seal]', { scale: [1, 0.88, 1.06] }, { duration: 0.4, ease: 'easeOut' })
    navigator.vibrate?.(15)
    await Promise.all([
      animate('[data-seal-left]', { x: -46, y: 160, rotate: -38, opacity: 0 }, { duration: 1, ease: [0.5, 0, 0.75, 0] }),
      animate('[data-seal-right]', { x: 52, y: 170, rotate: 44, opacity: 0 }, { duration: 1, ease: [0.5, 0, 0.75, 0] }),
      animate('[data-flap]', { rotateX: 180 }, { duration: 1, delay: 0.25, ease: [0.65, 0, 0.35, 1] }),
    ])
    await animate('[data-flap]', { zIndex: 1 }, { duration: 0 })
    animate('[data-title]', { opacity: 0, y: -24, filter: 'blur(6px)' }, { duration: 0.8 })
    await animate('[data-letter]', { y: '-62%' }, { duration: 1.1, ease: [0.22, 1, 0.36, 1] })
    await animate(
      '[data-stage]',
      { scale: 1.7, opacity: 0, filter: 'blur(8px)' },
      { duration: 1, delay: 0.5, ease: [0.55, 0, 1, 0.45] },
    )
    onOpen()
  }

  return (
    <motion.section
      ref={scope}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="flex min-h-svh flex-col items-center justify-center overflow-hidden px-6"
    >
      <div data-stage className="flex flex-col items-center">
        <div data-title className="flex flex-col items-center">
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.8em' }}
            animate={{ opacity: 1, letterSpacing: '0.35em' }}
            transition={{ delay: 0.3, duration: 2 }}
            className="text-xs text-gold-400 uppercase"
          >
            {eyebrow}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.6, duration: 1.4 }}
            className="text-gold mt-3 font-serif text-5xl italic"
          >
            {title}
          </motion.h1>
        </div>

        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative mt-20"
        >
          <motion.div
            aria-hidden
            className="absolute -inset-20 rounded-full bg-radial from-gold-500/30 to-transparent to-70%"
            animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1.05, 0.95] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.button
            type="button"
            onClick={open}
            aria-label="Открыть письмо"
            initial={{ opacity: 0, y: 60, rotate: -6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
            transition={{ delay: 0.9, type: 'spring', stiffness: 60, damping: 13 }}
            className="relative block h-52 w-80 perspective-distant"
          >
            <div className="absolute inset-0 rounded-md bg-cream-dark shadow-envelope" />
            <svg viewBox="0 0 320 128" preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-32 w-full">
              <path d="M0 0 H320 L160 120 Z" fill="#5a0e1e" />
              <path d="M0 0 H320 L160 120 Z" fill="url(#env-damask)" />
            </svg>

            <div data-letter className="paper absolute inset-x-4 top-3 bottom-3 z-10 rounded-sm px-5 pt-4 text-left shadow-lg">
              <div className="absolute inset-1.5 rounded-sm border border-gold-500/50" />
              <p className="font-script text-3xl text-wine-700">{addressee}</p>
              <div className="mt-3 space-y-2.5">
                <div className="h-px w-full bg-wine-700/15" />
                <div className="h-px w-5/6 bg-wine-700/15" />
                <div className="h-px w-2/3 bg-wine-700/15" />
              </div>
            </div>

            <Pocket />

            <div className="absolute inset-x-0 bottom-2 z-20 flex justify-center">
              <Signature text={addressee} tone="wine" start="mount" delay={2} speed={0.13} className="h-10 w-auto" />
            </div>

            <Flap />

            <div className="absolute top-30 left-1/2 z-40 -translate-x-1/2 -translate-y-1/2">
              {[0, 1].map((i) => (
                <motion.span
                  key={i}
                  data-ripple
                  className="absolute inset-0 rounded-full border border-gold-300/70"
                  initial={{ opacity: 0 }}
                  animate={{ scale: [1, 2], opacity: [0.8, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, delay: 3 + i * 1.2, ease: 'easeOut' }}
                />
              ))}
              <motion.div
                data-seal
                className="relative size-20 drop-shadow-xl"
                initial={{ scale: 2.2, opacity: 0, rotate: -25 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ delay: 1.6, type: 'spring', stiffness: 260, damping: 15 }}
              >
                <div data-seal-left className="absolute inset-0" style={{ clipPath: crackLeft }}>
                  <WaxSeal className="size-full" />
                </div>
                <div data-seal-right className="absolute inset-0" style={{ clipPath: crackRight }}>
                  <WaxSeal className="size-full" />
                </div>
              </motion.div>
            </div>
          </motion.button>
        </motion.div>

        <motion.p
          data-hint
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.35, 1, 0.35] }}
          transition={{ delay: 3, duration: 2.6, repeat: Infinity }}
          className="mt-20 text-lg tracking-wide text-cream/80 italic"
        >
          {hint}
        </motion.p>
      </div>
    </motion.section>
  )
}
