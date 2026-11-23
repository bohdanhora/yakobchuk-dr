import type { CSSProperties } from 'react'

export const SIZE = 4

const layout = ['AAAB', 'CCDB', 'CCDB', 'EEEE']

export type Tone = { light: string; dark: string }

const tones: Tone[] = [
  { light: '#e0677c', dark: '#7a1f2e' },
  { light: '#f6dfa4', dark: '#b08843' },
  { light: '#b86a9a', dark: '#4e1f44' },
  { light: '#f2c4c4', dark: '#b06a74' },
  { light: '#c4475b', dark: '#3a0a16' },
  { light: '#e8a877', dark: '#8a4a2a' },
  { light: '#f8efe2', dark: '#c4a982' },
  { light: '#d9849a', dark: '#8e2436' },
  { light: '#e3c88f', dark: '#7d5f30' },
]

export type Cell = [number, number]
export type Spot = { r: number; c: number }

export type Piece = {
  id: string
  cells: Cell[]
  w: number
  h: number
  tone: Tone
  solution: Spot
}

export const pieces: Piece[] = (() => {
  const groups = new Map<string, Cell[]>()
  layout.forEach((row, r) =>
    [...row].forEach((id, c) => {
      const list = groups.get(id) ?? []
      list.push([r, c])
      groups.set(id, list)
    }),
  )
  return [...groups.entries()].map(([id, absolute], i) => {
    const minR = Math.min(...absolute.map(([r]) => r))
    const minC = Math.min(...absolute.map(([, c]) => c))
    const cells = absolute.map(([r, c]) => [r - minR, c - minC] as Cell)
    return {
      id,
      cells,
      w: Math.max(...cells.map(([, c]) => c)) + 1,
      h: Math.max(...cells.map(([r]) => r)) + 1,
      tone: tones[i % tones.length],
      solution: { r: minR, c: minC },
    }
  })
})()

export const pieceById = Object.fromEntries(pieces.map((p) => [p.id, p])) as Record<string, Piece>

export const maxPieceSide = Math.max(...pieces.map((p) => Math.max(p.w, p.h)))

const signature = (piece: Piece) => JSON.stringify(piece.cells)

export function isCorrectSpot(piece: Piece, spot: Spot) {
  return pieces.some((q) => signature(q) === signature(piece) && q.solution.r === spot.r && q.solution.c === spot.c)
}

export function shuffle<T>(items: T[]) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function gem(tone: Tone): CSSProperties {
  return {
    backgroundImage: `linear-gradient(145deg, ${tone.light} 0%, ${tone.dark} 100%)`,
    boxShadow:
      'inset 0 2px 0 rgb(255 255 255 / 0.4), inset 0 -3px 0 rgb(0 0 0 / 0.28), inset 2px 0 0 rgb(255 255 255 / 0.12), 0 3px 6px rgb(0 0 0 / 0.45)',
  }
}
