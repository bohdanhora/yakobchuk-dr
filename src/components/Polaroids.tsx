import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react'
import { useRef, useState } from 'react'
import { content, type Photo } from '../content'
import { SectionTitle } from './SectionTitle'

const tilts = [-6, 5, -3, 7, -5, 4]
const drift = [50, -40, 60, -30, 45, -50]

function PhotoArea({ photo, index }: { photo: Photo; index: number }) {
  return (
    <div className="relative aspect-square overflow-hidden bg-wine-900">
      {photo.src ? (
        <img src={photo.src} alt={photo.caption} loading="lazy" className="size-full object-cover" />
      ) : (
        <div className="flex size-full flex-col items-center justify-center gap-2 bg-linear-to-br from-wine-600 via-wine-800 to-wine-950">
          <svg viewBox="0 0 24 24" className="size-8 fill-none stroke-gold-300/60" strokeWidth="1">
            <rect x="3" y="6" width="18" height="14" rx="2" />
            <circle cx="12" cy="13" r="4" />
            <path d="M8 6l1.5-2h5L16 6" />
          </svg>
          <span className="font-serif text-xl text-gold-300/70 italic">Фото {index + 1}</span>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 shadow-inner" />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/15 via-transparent to-transparent" />
    </div>
  )
}

function Polaroid({ photo, index, onOpen }: { photo: Photo; index: number; onOpen: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [drift[index % drift.length], -drift[index % drift.length]])
  const tilt = tilts[index % tilts.length]
  const side = index % 2 === 0 ? 'self-start' : 'self-end'

  return (
    <motion.div ref={ref} style={{ y }} className={side}>
      <motion.button
        type="button"
        onClick={onOpen}
        aria-label={`Открыть фото ${index + 1}`}
        initial={{ opacity: 0, y: -160, rotate: tilt * 4, scale: 1.2 }}
        whileInView={{ opacity: 1, y: 0, rotate: tilt, scale: 1 }}
        whileTap={{ scale: 1.04, rotate: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ type: 'spring', stiffness: 90, damping: 12 }}
        className="relative block w-60 bg-paper p-3 pb-5 text-left shadow-polaroid xs:w-64"
      >
        <div className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-3 bg-cream-dark/60 shadow-sm backdrop-blur-sm" />
        <PhotoArea photo={photo} index={index} />
        <p className="mt-3 text-center font-hand text-2xl text-wine-900/80">{photo.caption}</p>
      </motion.button>
    </motion.div>
  )
}

export function Polaroids() {
  const { eyebrow, title, hint, items } = content.photos
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="overflow-x-clip px-5 py-24">
      <SectionTitle eyebrow={eyebrow} title={title} />
      <p className="mt-4 text-center text-base text-cream/50 italic">{hint}</p>
      <div className="mx-auto mt-16 flex max-w-sm flex-col gap-10">
        {items.map((photo, i) => (
          <Polaroid key={i} photo={photo} index={i} onOpen={() => setOpen(i)} />
        ))}
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-night/85 px-6 backdrop-blur-md"
          >
            <motion.figure
              initial={{ scale: 0.6, rotate: tilts[open % tilts.length] * 2, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 160, damping: 18 }}
              className="w-full max-w-sm bg-paper p-4 pb-6 shadow-polaroid"
            >
              <PhotoArea photo={items[open]} index={open} />
              <figcaption className="mt-4 text-center font-hand text-3xl text-wine-900/80">{items[open].caption}</figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
