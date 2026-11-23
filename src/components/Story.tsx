import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { content, type StoryCharacter, type StoryChoice } from '../content'
import { sparkle } from '../lib/celebrate'
import { Divider } from './Ornaments'
import { SectionTitle } from './SectionTitle'
import { Signature } from './Signature'

const { story } = content
const characters: StoryCharacter[] = story.characters
const byId = Object.fromEntries(characters.map((c) => [c.id, c])) as Record<string, StoryCharacter>

const STORAGE_KEY = 'yakobchuk-dr:favorite'
const testMode = new URLSearchParams(window.location.search).has('test')

function readFavorite() {
  if (testMode) return null
  try {
    if (new URLSearchParams(window.location.search).has('reset-choice')) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    const id = localStorage.getItem(STORAGE_KEY)
    return id && byId[id] ? id : null
  } catch {
    return null
  }
}

function saveFavorite(id: string) {
  if (testMode) return
  try {
    localStorage.setItem(STORAGE_KEY, id)
  } catch {
    return
  }
}

type Step = { text: string; choices?: StoryChoice[] }

function Portrait({ character, fit = 'contain', className = '' }: { character: StoryCharacter; fit?: 'contain' | 'cover'; className?: string }) {
  if (character.portrait) {
    return (
      <img
        src={character.portrait}
        alt={character.name}
        draggable={false}
        className={`${fit === 'cover' ? 'object-cover object-top' : 'object-contain object-bottom'} ${className}`}
      />
    )
  }
  return (
    <svg viewBox="0 0 200 260" className={className} role="img" aria-label={character.name}>
      <defs>
        <linearGradient id={`portrait-${character.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={character.accent} />
          <stop offset="1" stopColor="#12020a" />
        </linearGradient>
      </defs>
      <path d="M18 262 C 22 182, 60 142, 100 142 C 140 142, 178 182, 182 262 Z" fill={`url(#portrait-${character.id})`} />
      <circle cx="100" cy="82" r="46" fill={`url(#portrait-${character.id})`} />
      <circle cx="100" cy="82" r="46" fill="none" stroke="#d9bb82" strokeOpacity="0.45" />
      <text x="100" y="96" textAnchor="middle" className="font-script" fontSize="46" fill="#f6e7bf" fillOpacity="0.85">
        {character.name.charAt(0)}
      </text>
    </svg>
  )
}

function ChooseScreen({ onPick }: { onPick: (id: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.6 }}
      className="absolute inset-0 overflow-y-auto px-4 pt-20 pb-12"
    >
      <motion.h2
        initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1 }}
        className="text-gold text-center font-serif text-4xl italic"
      >
        {story.chooseTitle}
      </motion.h2>
      <Divider start="mount" delay={0.4} className="mx-auto mt-3 w-40" />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="mx-auto mt-3 max-w-xs text-center text-base leading-snug text-cream/75 italic"
      >
        {story.chooseWarning}
      </motion.p>

      <div className="mx-auto mt-7 grid max-w-md grid-cols-2 gap-3">
        {characters.map((c, i) => (
          <motion.button
            key={c.id}
            type="button"
            onClick={() => onPick(c.id)}
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ delay: 0.3 + i * 0.1, type: 'spring', stiffness: 140, damping: 16 }}
            className="relative aspect-3/4 overflow-hidden rounded-2xl border border-gold-500/40 text-left shadow-card"
            style={{ backgroundImage: `linear-gradient(180deg, ${c.accent} 0%, #12020a 100%)` }}
          >
            <div className="absolute inset-x-0 top-3 bottom-10 flex items-end justify-center">
              <Portrait character={c} className="h-full w-auto max-w-full" />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-night via-night/85 to-transparent px-3 pt-10 pb-3">
              <p className="font-serif text-xl leading-tight text-gold-200 italic">{c.name}</p>
              <p className="mt-0.5 text-xs leading-snug text-cream/70">{c.tagline}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

function ConfirmDialog({ character, onYes, onNo }: { character: StoryCharacter; onYes: () => void; onNo: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      onClick={onNo}
      className="absolute inset-0 z-20 flex items-center justify-center bg-night/80 px-6 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.85, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 18 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-gold-500/50 shadow-card"
        style={{ backgroundImage: `linear-gradient(180deg, ${character.accent} 0%, #12020a 70%)` }}
      >
        <div className="flex h-64 items-end justify-center pt-4">
          <Portrait character={character} className="h-full w-auto max-w-full" />
        </div>
        <div className="relative -mt-10 bg-linear-to-t from-night via-night/95 to-transparent px-6 pt-10 pb-6 text-center">
          <p className="text-xs tracking-widest text-gold-400 uppercase">{character.name}</p>
          <h3 className="text-gold mt-2 font-serif text-4xl italic">{story.confirmTitle}</h3>
          <p className="mt-2 text-base leading-snug text-cream/75 italic">{story.confirmText}</p>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onNo}
              className="flex-1 rounded-full border border-gold-500/50 bg-wine-900/70 px-4 py-3 text-base text-gold-200 active:bg-wine-800"
            >
              {story.confirmNo}
            </button>
            <button
              type="button"
              onClick={onYes}
              className="flex-1 rounded-full bg-linear-to-r from-gold-600 via-gold-300 to-gold-600 px-4 py-3 text-base font-medium text-wine-900 shadow-card"
            >
              {story.confirmYes}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function Choices({ choices, onChoose }: { choices: StoryChoice[]; onChoose: (choice: StoryChoice) => void }) {
  return (
    <div className="flex flex-col gap-2.5">
      {choices.map((choice, i) => (
        <motion.button
          key={choice.label}
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onChoose(choice)
          }}
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          whileTap={{ scale: 0.97 }}
          transition={{ delay: i * 0.12, duration: 0.45 }}
          className={
            choice.special
              ? 'relative flex items-center justify-center gap-2 overflow-hidden rounded-xl border border-gold-200/80 bg-linear-to-r from-gold-600 via-gold-300 to-gold-600 px-4 py-3.5 font-serif text-lg font-medium text-wine-900 shadow-card'
              : 'rounded-xl border border-gold-500/40 bg-wine-900/85 px-4 py-3.5 font-serif text-lg text-cream shadow-card backdrop-blur-md'
          }
        >
          {choice.special && (
            <>
              <svg viewBox="0 0 24 24" className="size-4 fill-wine-800">
                <path d="M6 3h12l4 6-10 12L2 9z" />
              </svg>
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-white/60 to-transparent"
                initial={{ x: '-120%' }}
                animate={{ x: '420%' }}
                transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.2 }}
              />
            </>
          )}
          <span className="relative">{choice.label}</span>
        </motion.button>
      ))}
    </div>
  )
}

function Typewriter({ text, onDone }: { text: string; onDone: (done: boolean) => void }) {
  const chars = useMemo(() => Array.from(text), [text])
  const [count, setCount] = useState(0)
  const done = count >= chars.length

  useEffect(() => {
    onDone(done)
    if (done) return
    const id = window.setTimeout(() => setCount((c) => c + 1), chars[count] === ' ' ? 18 : 30)
    return () => window.clearTimeout(id)
  }, [count, done, chars, onDone])

  useEffect(() => {
    const finish = () => setCount(chars.length)
    window.addEventListener('story:skip', finish)
    return () => window.removeEventListener('story:skip', finish)
  }, [chars.length])

  return (
    <p className="font-serif text-xl leading-relaxed text-cream">
      {chars.slice(0, count).join('')}
      <span className="opacity-0">{chars.slice(count).join('')}</span>
    </p>
  )
}

function Notice({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -24, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 220, damping: 20 }}
      className="pointer-events-none absolute inset-x-4 top-20 z-20 mx-auto flex max-w-sm items-center gap-3 rounded-2xl border border-gold-300/70 bg-night/90 px-4 py-3 shadow-card backdrop-blur-md"
    >
      <motion.svg
        viewBox="0 0 24 24"
        className="size-7 shrink-0 fill-gold-300"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.9, repeat: Infinity }}
      >
        <path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11z" />
      </motion.svg>
      <div>
        <p className="text-xs tracking-widest text-gold-300 uppercase">{story.noticeTitle}</p>
        <p className="mt-0.5 font-serif text-base leading-snug text-cream italic">{text}</p>
      </div>
    </motion.div>
  )
}

type SceneProps = { character: StoryCharacter; onReplay: () => void; onClose: () => void; onSwitch?: () => void }

function SceneView({ character, onReplay, onClose, onSwitch }: SceneProps) {
  const [steps, setSteps] = useState<Step[]>(() => character.lines.map((line) => ({ ...line })))
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<'title' | 'dialog' | 'end'>('title')
  const [typed, setTyped] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const step = steps[Math.min(index, steps.length - 1)]

  useEffect(() => {
    const id = window.setTimeout(() => setPhase('dialog'), 2200)
    return () => window.clearTimeout(id)
  }, [])

  useEffect(() => {
    if (!notice) return
    const id = window.setTimeout(() => setNotice(null), 4200)
    return () => window.clearTimeout(id)
  }, [notice])

  useEffect(() => {
    if (phase !== 'end') return
    const id = window.setTimeout(() => sparkle(0.5, 0.45, 70), 400)
    return () => window.clearTimeout(id)
  }, [phase])

  const advance = () => {
    if (phase !== 'dialog') return
    if (!typed) {
      window.dispatchEvent(new Event('story:skip'))
      return
    }
    if (step.choices) return
    if (index + 1 < steps.length) {
      setTyped(false)
      setIndex(index + 1)
    } else {
      setPhase('end')
    }
  }

  const choose = (choice: StoryChoice) => {
    if (choice.special) sparkle(0.5, 0.7, 40)
    if (choice.notice) setNotice(choice.notice)
    navigator.vibrate?.(10)
    setSteps((prev) => [...prev.slice(0, index), { ...prev[index], choices: undefined }, { text: choice.reply }, ...prev.slice(index + 1)])
    setTyped(false)
    setIndex(index + 1)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
      onClick={advance}
      className="absolute inset-0 overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ backgroundImage: `radial-gradient(ellipse at 50% 38%, ${character.accent}88 0%, transparent 62%)` }}
      />

      <AnimatePresence>{notice && <Notice key="notice" text={notice} />}</AnimatePresence>

      <AnimatePresence>
        {phase === 'title' && (
          <motion.div
            key="title"
            className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.08, filter: 'blur(6px)' }}
            transition={{ duration: 0.8 }}
          >
            <motion.p
              initial={{ opacity: 0, letterSpacing: '0.8em' }}
              animate={{ opacity: 1, letterSpacing: '0.35em' }}
              transition={{ duration: 1.4 }}
              className="text-xs text-gold-400 uppercase"
            >
              {story.chosenLabel}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 0.3, duration: 1 }}
              className="text-gold mt-4 font-serif text-5xl leading-tight italic"
            >
              {character.name}
            </motion.h2>
            <Divider start="mount" delay={0.7} className="mt-3 w-40" />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-3 max-w-xs text-lg text-cream/75 italic"
            >
              {character.tagline}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {phase !== 'title' && (
        <motion.div
          className="absolute inset-x-0 top-14 bottom-44 flex items-end justify-center"
          initial={{ opacity: 0, x: 90, filter: 'blur(6px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="h-full"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Portrait character={character} className="h-full w-auto max-w-full drop-shadow-2xl" />
          </motion.div>
        </motion.div>
      )}

      {phase === 'dialog' && (
        <div className="absolute inset-x-3 bottom-4 flex flex-col gap-3">
          <AnimatePresence>
            {typed && step.choices && (
              <motion.div key={`choices-${index}`} exit={{ opacity: 0, y: 10 }}>
                <Choices choices={step.choices} onChoose={choose} />
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative min-h-40 cursor-pointer rounded-2xl border border-gold-500/50 bg-night/85 px-5 pt-8 pb-6 shadow-card backdrop-blur-md"
          >
            <div className="pointer-events-none absolute inset-1 rounded-xl border border-gold-500/15" />
            <div
              className="absolute -top-4 left-4 rounded-full border border-gold-400/70 px-4 py-1 font-serif text-lg text-gold-200 italic shadow-card"
              style={{ backgroundImage: `linear-gradient(135deg, ${character.accent}, #22050d)` }}
            >
              {character.name}
            </div>
            <Typewriter key={index} text={step.text} onDone={setTyped} />
            {typed && !step.choices && (
              <motion.svg
                viewBox="0 0 24 24"
                className="absolute right-4 bottom-3 size-4 fill-gold-300"
                animate={{ y: [0, 4, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                <path d="M4 8h16l-8 9z" />
              </motion.svg>
            )}
          </motion.div>
        </div>
      )}

      {phase === 'end' && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-x-4 bottom-6 flex flex-col items-center text-center"
        >
          <Signature text={story.signature} start="mount" delay={0.4} speed={0.12} shine className="h-16 w-auto max-w-full" />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.6 }}
            className="mt-6 flex w-full max-w-sm gap-3"
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onReplay()
              }}
              className="flex-1 rounded-full border border-gold-500/50 bg-wine-900/70 px-4 py-3 text-base text-gold-200 backdrop-blur-md active:bg-wine-800"
            >
              {story.replay}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onClose()
              }}
              className="flex-1 rounded-full bg-linear-to-r from-gold-600 via-gold-300 to-gold-600 px-4 py-3 text-base font-medium text-wine-900 shadow-card"
            >
              {story.close}
            </button>
          </motion.div>
          {onSwitch && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onSwitch()
              }}
              className="mt-4 text-base text-gold-300 underline underline-offset-4"
            >
              {story.testSwitch}
            </button>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}

type OverlayProps = { favorite: string | null; onChoose: (id: string) => void; onClose: () => void; onSwitch?: () => void }

function StoryOverlay({ favorite, onChoose, onClose, onSwitch }: OverlayProps) {
  const [pending, setPending] = useState<string | null>(null)
  const [run, setRun] = useState(0)
  const chosen = favorite ? byId[favorite] : null
  const pendingCharacter = pending ? byId[pending] : null
  const scrollRef = useRef('')

  useEffect(() => {
    scrollRef.current = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const previous = scrollRef
    return () => {
      document.body.style.overflow = previous.current
    }
  }, [])

  const confirm = () => {
    if (!pending) return
    navigator.vibrate?.([15, 50, 25])
    onChoose(pending)
    setPending(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-50 overflow-hidden bg-night select-none"
    >
      <div className="pointer-events-none absolute inset-0 bg-radial from-wine-800/70 via-wine-950/60 to-night" />
      <AnimatePresence mode="wait">
        {chosen ? (
          <SceneView
            key={`${chosen.id}-${run}`}
            character={chosen}
            onReplay={() => setRun((r) => r + 1)}
            onClose={onClose}
            onSwitch={onSwitch}
          />
        ) : (
          <ChooseScreen key="choose" onPick={setPending} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {pendingCharacter && !chosen && (
          <ConfirmDialog key="confirm" character={pendingCharacter} onYes={confirm} onNo={() => setPending(null)} />
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={onClose}
        aria-label={story.close}
        className="safe-top absolute left-4 z-30 flex size-11 items-center justify-center rounded-full border border-gold-500/40 bg-wine-900/60 text-gold-300 backdrop-blur-md"
      >
        <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current" strokeWidth="1.6" strokeLinecap="round">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </motion.div>
  )
}

export function Story() {
  const [open, setOpen] = useState(false)
  const [favorite, setFavorite] = useState<string | null>(readFavorite)
  const chosen = favorite ? byId[favorite] : null

  const choose = (id: string) => {
    saveFavorite(id)
    setFavorite(id)
  }

  return (
    <section className="px-5 py-24">
      <SectionTitle eyebrow={story.eyebrow} title={story.title} />
      <p className="mx-auto mt-4 max-w-xs text-center text-lg text-cream/70 italic">
        {chosen ? story.chosenSubtitle : story.subtitle}
      </p>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileTap={{ scale: 0.96 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.8 }}
        className="mx-auto mt-10 flex flex-col items-center"
      >
        {chosen ? (
          <div className="flex flex-col items-center">
            <div
              className="size-28 overflow-hidden rounded-full border-2 border-gold-300 shadow-card"
              style={{ backgroundColor: chosen.accent }}
            >
              <Portrait character={chosen} fit="cover" className="size-full" />
            </div>
            <p className="mt-3 text-xs tracking-widest text-gold-400 uppercase">{story.chosenLabel}</p>
            <p className="text-gold font-serif text-3xl italic">{chosen.name}</p>
          </div>
        ) : (
          <div className="flex -space-x-4">
            {characters.map((c, i) => (
              <motion.div
                key={c.id}
                className="size-16 overflow-hidden rounded-full border-2 border-gold-400/80 shadow-card"
                style={{ backgroundColor: c.accent }}
                initial={{ opacity: 0, scale: 0.4 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.08, type: 'spring', stiffness: 200, damping: 14 }}
              >
                <Portrait character={c} fit="cover" className="size-full" />
              </motion.div>
            ))}
          </div>
        )}
        <span className="relative mt-7 overflow-hidden rounded-full bg-linear-to-r from-gold-600 via-gold-300 to-gold-600 px-10 py-3.5 text-lg font-medium tracking-wide text-wine-900 shadow-card">
          {chosen ? story.reopen : story.open}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-white/60 to-transparent"
            initial={{ x: '-120%' }}
            animate={{ x: '420%' }}
            transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 2 }}
          />
        </span>
      </motion.button>
      {createPortal(
        <AnimatePresence>
          {open && (
            <StoryOverlay
              favorite={favorite}
              onChoose={choose}
              onClose={() => setOpen(false)}
              onSwitch={testMode ? () => setFavorite(null) : undefined}
            />
          )}
        </AnimatePresence>,
        document.body,
      )}
    </section>
  )
}
