import { motion, useScroll, useSpring } from 'motion/react'

export function MusicToggle({ playing, onToggle }: { playing: boolean; onToggle: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-label={playing ? 'Выключить музыку' : 'Включить музыку'}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.5 }}
      className="safe-top fixed right-4 z-40 flex size-11 items-center justify-center rounded-full border border-gold-500/40 bg-wine-900/60 text-gold-300 backdrop-blur-md"
    >
      {playing ? (
        <span className="flex h-4 items-end gap-0.5">
          {[0, 1, 2, 3].map((i) => (
            <motion.span
              key={i}
              className="h-full w-0.5 origin-bottom rounded-full bg-gold-300"
              animate={{ scaleY: [0.3, 1, 0.45, 0.85, 0.3] }}
              transition={{ duration: 1 + i * 0.17, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </span>
      ) : (
        <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current" strokeWidth="1.4" strokeLinecap="round">
          <path d="M9 18V5l11-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="17" cy="16" r="3" />
        </svg>
      )}
    </motion.button>
  )
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-40 h-0.5 origin-left bg-linear-to-r from-gold-700 via-gold-300 to-gold-700"
    />
  )
}
