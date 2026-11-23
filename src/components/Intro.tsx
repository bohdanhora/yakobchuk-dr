import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { content } from '../content'

export function Intro({ onDone }: { onDone: () => void }) {
  const { lines } = content.intro
  const [index, setIndex] = useState(0)
  const doneRef = useRef(onDone)

  useEffect(() => {
    doneRef.current = onDone
  })

  useEffect(() => {
    if (index >= lines.length) {
      doneRef.current()
      return
    }
    const isLast = index === lines.length - 1
    const id = window.setTimeout(() => setIndex((i) => i + 1), isLast ? 3400 : 2900)
    return () => window.clearTimeout(id)
  }, [index, lines.length])

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.2 } }}
      transition={{ duration: 1 }}
      className="relative flex min-h-svh items-center justify-center px-8 text-center"
    >
      <AnimatePresence mode="wait">
        {index < lines.length && (
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 14, filter: 'blur(14px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className={
              index === lines.length - 1
                ? 'text-gold max-w-xs font-serif text-5xl leading-tight italic'
                : 'max-w-xs font-serif text-3xl leading-snug text-cream/90 italic'
            }
          >
            {lines[index]}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.section>
  )
}
