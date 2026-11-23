import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { content } from '../content'

const STORAGE_KEY = 'yakobchuk-dr:safari'

function shouldShow() {
  if (!/iPhone|iPad|iPod/.test(navigator.userAgent)) return false
  try {
    return localStorage.getItem(STORAGE_KEY) !== '1'
  } catch {
    return true
  }
}

function SafariIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-8 fill-none stroke-current" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9.5" />
      <path d="M15.8 8.2l-2.4 5.2-5.2 2.4 2.4-5.2z" />
    </svg>
  )
}

export function SafariPrompt() {
  const { title, text, button } = content.safari
  const [open, setOpen] = useState(shouldShow)

  const close = () => {
    setOpen(false)
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      return
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-60 flex items-center justify-center bg-night/85 px-6 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.85, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 180, damping: 18 }}
            className="paper relative w-full max-w-sm rounded-3xl px-6 pt-8 pb-6 text-center text-wine-900 shadow-letter"
          >
            <div className="pointer-events-none absolute inset-2 rounded-2xl border border-gold-500/40" />
            <div className="relative mx-auto flex size-14 items-center justify-center rounded-full bg-wine-800 text-gold-200 shadow-card">
              <SafariIcon />
            </div>
            <h2 className="relative mt-4 font-serif text-3xl italic">{title}</h2>
            <p className="relative mt-3 text-lg leading-snug">{text}</p>
            <motion.div
              aria-hidden
              className="pointer-events-none fixed right-6 bottom-6 flex size-12 items-center justify-center rounded-full border-2 border-gold-300 text-gold-200"
              animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            >
              <svg viewBox="0 0 24 24" className="size-6 fill-current">
                <path d="M12 20l-7-8h4V4h6v8h4z" />
              </svg>
            </motion.div>
            <button
              type="button"
              onClick={close}
              className="relative mt-6 w-full rounded-full bg-linear-to-r from-gold-600 via-gold-300 to-gold-600 px-4 py-3 text-base font-medium text-wine-900 shadow-card"
            >
              {button}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
