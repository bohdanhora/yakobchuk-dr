import { AnimatePresence, motion } from 'motion/react'
import type { ReactNode } from 'react'
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { createPortal } from 'react-dom'
import { content } from '../content'
import { sparkle } from '../lib/celebrate'
import {
  gem,
  maxPieceSide,
  pieceById,
  pieces,
  shuffle,
  SIZE,
  type Piece,
  type Spot,
  type Tone,
} from '../lib/puzzle'

type Drag = {
  id: string
  x: number
  y: number
  fx: number
  fy: number
  lift: number
}

type Grab = (e: ReactPointerEvent<HTMLElement>, rect: DOMRect) => void

const TRAY_SLOT = 60
const HINT_MS = 4000
const CENTER = (SIZE - 1) / 2

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 rounded-full border border-gold-500/50 bg-wine-900/70 px-4 py-2 text-sm text-gold-200 shadow-card backdrop-blur-sm transition-transform active:scale-95"
    >
      {children}
      {label}
    </button>
  )
}

function ResetIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12a8 8 0 1 0 2.4-5.7" />
      <path d="M4 4v4.5h4.5" />
    </svg>
  )
}

function HintIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.2h5c0-.9.4-1.7 1.1-2.2A6 6 0 0 0 12 3z" />
    </svg>
  )
}

function Block({ tone, pitch, r, c, onGrab }: { tone: Tone; pitch: number; r: number; c: number; onGrab?: (e: ReactPointerEvent<HTMLElement>) => void }) {
  return (
    <div
      onPointerDown={onGrab}
      className={`absolute p-0.5 ${onGrab ? 'pointer-events-auto cursor-grab touch-none' : ''}`}
      style={{ left: c * pitch, top: r * pitch, width: pitch, height: pitch }}
    >
      <div className="size-full rounded-md" style={gem(tone)} />
    </div>
  )
}

function Shape({ piece, pitch, onGrab }: { piece: Piece; pitch: number; onGrab?: Grab }) {
  const ref = useRef<HTMLDivElement>(null)
  const grab = onGrab
    ? (e: ReactPointerEvent<HTMLElement>) => {
        if (ref.current) onGrab(e, ref.current.getBoundingClientRect())
      }
    : undefined

  return (
    <div
      ref={ref}
      data-piece={piece.id}
      className="pointer-events-none relative"
      style={{ width: piece.w * pitch, height: piece.h * pitch }}
    >
      {piece.cells.map(([r, c]) => (
        <Block key={`${r}-${c}`} tone={piece.tone} pitch={pitch} r={r} c={c} onGrab={grab} />
      ))}
    </div>
  )
}

function Burst({ grid, pitch }: { grid: (string | null)[][]; pitch: number }) {
  const cells = useMemo(
    () =>
      grid.flatMap((row, r) =>
        row.map((id, c) => ({
          r,
          c,
          tone: pieceById[id ?? 'A'].tone,
          dist: Math.hypot(r - CENTER, c - CENTER),
          spin: (Math.random() - 0.5) * 180,
          push: 0.6 + Math.random() * 0.8,
        })),
      ),
    [grid],
  )

  return (
    <>
      {cells.map((cell) => (
        <motion.div
          key={`${cell.r}-${cell.c}`}
          className="absolute p-0.5"
          style={{ left: cell.c * pitch, top: cell.r * pitch, width: pitch, height: pitch }}
          initial={{ scale: 1, opacity: 1 }}
          animate={{
            scale: [1, 1.15, 1.15, 0],
            opacity: [1, 1, 1, 0],
            rotate: [0, 0, 0, cell.spin],
            x: [0, 0, 0, (cell.c - CENTER) * pitch * cell.push],
            y: [0, -4, -4, (cell.r - CENTER) * pitch * cell.push],
          }}
          transition={{ duration: 1.3, delay: 0.4 + cell.dist * 0.1, times: [0, 0.25, 0.45, 1], ease: 'easeIn' }}
        >
          <div className="size-full rounded-md" style={gem(cell.tone)} />
        </motion.div>
      ))}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl bg-gold-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.55, 0] }}
        transition={{ duration: 0.7, delay: 0.25 }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 size-24 -translate-1/2 rounded-full border-2 border-gold-300"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 4.5], opacity: [1, 0] }}
        transition={{ duration: 1.2, delay: 0.7, ease: 'easeOut' }}
      />
    </>
  )
}

export function Puzzle({ onSolved }: { onSolved: () => void }) {
  const { eyebrow, title, subtitle, hint, hintNote, reset, solved: solvedText } = content.puzzle
  const boardRef = useRef<HTMLDivElement>(null)
  const [pitch, setPitch] = useState(56)
  const [placed, setPlaced] = useState<Record<string, Spot>>({})
  const [order] = useState(() => shuffle(pieces.map((p) => p.id)))
  const [drag, setDrag] = useState<Drag | null>(null)
  const [hinting, setHinting] = useState(false)
  const dragRef = useRef<Drag | null>(null)
  const targetRef = useRef<Spot | null>(null)
  const doneRef = useRef(onSolved)
  const solved = pieces.every((p) => placed[p.id])
  const trayPitch = Math.floor(Math.min(pitch * 0.42, TRAY_SLOT / maxPieceSide))

  useEffect(() => {
    doneRef.current = onSolved
  })

  useLayoutEffect(() => {
    const el = boardRef.current
    if (!el) return
    const measure = () => setPitch(el.clientWidth / SIZE)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const grid = useMemo(() => {
    const g: (string | null)[][] = Array.from({ length: SIZE }, () => Array<string | null>(SIZE).fill(null))
    for (const [id, spot] of Object.entries(placed)) {
      for (const [r, c] of pieceById[id].cells) g[spot.r + r][spot.c + c] = id
    }
    return g
  }, [placed])

  const target = useMemo(() => {
    const board = boardRef.current
    if (!drag || !board) return null
    const piece = pieceById[drag.id]
    const rect = board.getBoundingClientRect()
    const left = drag.x - drag.fx * piece.w * pitch
    const top = drag.y - drag.fy * piece.h * pitch - drag.lift
    const spot = { r: Math.round((top - rect.top) / pitch), c: Math.round((left - rect.left) / pitch) }
    const fits = piece.cells.every(([r, c]) => {
      const rr = spot.r + r
      const cc = spot.c + c
      return rr >= 0 && cc >= 0 && rr < SIZE && cc < SIZE && (grid[rr][cc] === null || grid[rr][cc] === drag.id)
    })
    return fits ? spot : null
  }, [drag, pitch, grid])

  useEffect(() => {
    dragRef.current = drag
    targetRef.current = target
  })

  useEffect(() => {
    if (!hinting) return
    const id = window.setTimeout(() => setHinting(false), HINT_MS)
    return () => window.clearTimeout(id)
  }, [hinting])

  const dragId = drag?.id

  useEffect(() => {
    if (!dragId) return
    const move = (e: PointerEvent) => setDrag((d) => (d ? { ...d, x: e.clientX, y: e.clientY } : d))
    const up = () => {
      const d = dragRef.current
      const t = targetRef.current
      if (d) {
        setPlaced((prev) => {
          const next = { ...prev }
          if (t) next[d.id] = t
          else delete next[d.id]
          return next
        })
        if (t) navigator.vibrate?.(8)
      }
      setDrag(null)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
  }, [dragId])

  useEffect(() => {
    if (!solved) return
    navigator.vibrate?.([15, 60, 15, 60, 40])
    const rect = boardRef.current?.getBoundingClientRect()
    const burst = window.setTimeout(() => {
      if (rect) sparkle((rect.left + rect.width / 2) / window.innerWidth, (rect.top + rect.height / 2) / window.innerHeight, 90)
    }, 800)
    const done = window.setTimeout(() => doneRef.current(), 3600)
    return () => {
      window.clearTimeout(burst)
      window.clearTimeout(done)
    }
  }, [solved])

  const grab =
    (id: string): Grab =>
    (e, rect) => {
      if (solved) return
      e.preventDefault()
      setHinting(false)
      setDrag({
        id,
        x: e.clientX,
        y: e.clientY,
        fx: Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)),
        fy: Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height)),
        lift: e.pointerType === 'touch' ? pitch * 1.2 : 0,
      })
    }

  const showHint = () => {
    setPlaced({})
    setHinting(true)
  }

  const dragPiece = drag ? pieceById[drag.id] : null

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
      transition={{ duration: 1 }}
      className="flex min-h-svh flex-col items-center px-4 pt-6 pb-6 select-none"
    >
      <motion.p
        initial={{ opacity: 0, letterSpacing: '0.7em' }}
        animate={{ opacity: 1, letterSpacing: '0.3em' }}
        transition={{ delay: 0.2, duration: 1.6 }}
        className="text-xs text-gold-400 uppercase"
      >
        {eyebrow}
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ delay: 0.4, duration: 1.2 }}
        className="text-gold mt-2 font-serif text-4xl italic"
      >
        {solved ? solvedText : title}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: solved ? 0 : 1 }}
        transition={{ delay: solved ? 0 : 0.8, duration: 0.8 }}
        className="mt-2 max-w-xs text-center text-base leading-snug text-cream/70 italic"
      >
        {hinting ? hintNote : subtitle}
      </motion.p>

      {!solved && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-3 flex items-center justify-center gap-3"
        >
          <IconButton label={hint} onClick={showHint}>
            <HintIcon />
          </IconButton>
          <IconButton label={reset} onClick={() => setPlaced({})}>
            <ResetIcon />
          </IconButton>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="puzzle-board relative mt-4 rounded-3xl border border-gold-500/40 bg-linear-to-b from-wine-800/80 to-wine-950/90 p-2.5 shadow-card backdrop-blur-sm"
      >
        <div ref={boardRef} className="relative aspect-square w-full">
          {Array.from({ length: SIZE * SIZE }, (_, i) => (
            <div
              key={i}
              className="absolute p-0.5"
              style={{ left: (i % SIZE) * pitch, top: Math.floor(i / SIZE) * pitch, width: pitch, height: pitch }}
            >
              <div className="size-full rounded-md bg-night/55 shadow-inner" />
            </div>
          ))}

          {!solved &&
            Object.entries(placed).map(([id, spot]) =>
              id === dragId ? null : (
                <motion.div
                  key={id}
                  className="pointer-events-none absolute"
                  style={{ left: spot.c * pitch, top: spot.r * pitch }}
                  initial={{ scale: 1.12 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                >
                  <Shape piece={pieceById[id]} pitch={pitch} onGrab={grab(id)} />
                </motion.div>
              ),
            )}

          <AnimatePresence>
            {hinting &&
              pieces.flatMap((piece) =>
                piece.cells.map(([r, c]) => (
                  <motion.div
                    key={`hint-${piece.id}-${r}-${c}`}
                    className="pointer-events-none absolute z-10 p-0.5"
                    style={{
                      left: (piece.solution.c + c) * pitch,
                      top: (piece.solution.r + r) * pitch,
                      width: pitch,
                      height: pitch,
                    }}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: [0.65, 1, 0.65], scale: [0.95, 1, 0.95] }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  >
                    <div
                      className="size-full rounded-md border-2 border-white/80"
                      style={{
                        backgroundColor: `${piece.tone.light}bb`,
                        boxShadow: `0 0 12px 1px ${piece.tone.light}, inset 0 0 8px rgb(255 255 255 / 0.5)`,
                      }}
                    />
                  </motion.div>
                )),
              )}
          </AnimatePresence>

          {dragPiece &&
            target &&
            dragPiece.cells.map(([r, c]) => (
              <div
                key={`preview-${r}-${c}`}
                className="absolute p-0.5"
                style={{ left: (target.c + c) * pitch, top: (target.r + r) * pitch, width: pitch, height: pitch }}
              >
                <div className="size-full rounded-md border-2 border-gold-300/90 bg-gold-300/20" />
              </div>
            ))}

          {solved && <Burst grid={grid} pitch={pitch} />}
        </div>
      </motion.div>

      <AnimatePresence>
        {!solved && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-4 grid w-full max-w-sm grid-cols-5 gap-1.5"
          >
            {order.map((id) => {
              const hidden = Boolean(placed[id]) || id === dragId
              return (
                <div
                  key={id}
                  onPointerDown={(e) => {
                    const shape = e.currentTarget.querySelector('[data-piece]')
                    if (!hidden && shape) grab(id)(e, shape.getBoundingClientRect())
                  }}
                  className={`flex h-16 touch-none items-center justify-center rounded-xl bg-night/25 ${hidden ? '' : 'cursor-grab'}`}
                >
                  <div className={hidden ? 'invisible' : ''}>
                    <Shape piece={pieceById[id]} pitch={trayPitch} />
                  </div>
                </div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {drag &&
        dragPiece &&
        createPortal(
          <div
            className="pointer-events-none fixed z-50 drop-shadow-2xl"
            style={{
              left: drag.x - drag.fx * dragPiece.w * pitch,
              top: drag.y - drag.fy * dragPiece.h * pitch - drag.lift,
              transform: 'scale(1.06)',
            }}
          >
            <Shape piece={dragPiece} pitch={pitch} />
          </div>,
          document.body,
        )}
    </motion.section>
  )
}
