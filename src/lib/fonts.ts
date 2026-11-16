import cyrillicUrl from '@fontsource/great-vibes/files/great-vibes-cyrillic-400-normal.woff?url'
import latinUrl from '@fontsource/great-vibes/files/great-vibes-latin-400-normal.woff?url'
import type { Font, Glyph as FontGlyph } from 'opentype.js'

export type Glyph = {
  d: string
  cx: number
  cy: number
}

export type TextLayout = {
  glyphs: Glyph[]
  x: number
  y: number
  width: number
  height: number
  viewBox: string
}

const SIZE = 100
const PAD = 8
const WORD_GAP = 20

let fontsPromise: Promise<Font[]> | null = null

export function loadScriptFonts() {
  fontsPromise ??= import('opentype.js').then(({ parse }) =>
    Promise.all([cyrillicUrl, latinUrl].map(async (url) => parse(await (await fetch(url)).arrayBuffer()))),
  )
  return fontsPromise
}

type PathCommand = {
  type: string
  x?: number
  y?: number
  x1?: number
  y1?: number
  x2?: number
  y2?: number
}

const n = (v: number | undefined) => (v ?? 0).toFixed(2)

function toPathData(commands: PathCommand[]) {
  return commands
    .map((c) => {
      if (c.type === 'M' || c.type === 'L') return `${c.type}${n(c.x)} ${n(c.y)}`
      if (c.type === 'Q') return `Q${n(c.x1)} ${n(c.y1)} ${n(c.x)} ${n(c.y)}`
      if (c.type === 'C') return `C${n(c.x1)} ${n(c.y1)} ${n(c.x2)} ${n(c.y2)} ${n(c.x)} ${n(c.y)}`
      return 'Z'
    })
    .join('')
}

function kerning(font: Font, left: FontGlyph, right: FontGlyph) {
  try {
    return font.getKerningValue(left, right)
  } catch {
    return 0
  }
}

export function layoutText(fonts: Font[], text: string): TextLayout {
  const glyphs: Glyph[] = []
  let x = 0
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  let prev: { font: Font; glyph: FontGlyph } | null = null

  for (const char of text) {
    const font = fonts.find((f) => f.hasChar(char)) ?? fonts[0]
    const scale = SIZE / font.unitsPerEm
    const glyph = font.charToGlyph(char)
    if (prev && prev.font === font) x += kerning(font, prev.glyph, glyph) * scale

    if (char.trim()) {
      const path = glyph.getPath(x, 0, SIZE)
      const box = path.getBoundingBox()
      if (box.x2 > box.x1) {
        glyphs.push({ d: toPathData(path.commands as PathCommand[]), cx: (box.x1 + box.x2) / 2, cy: (box.y1 + box.y2) / 2 })
        minX = Math.min(minX, box.x1)
        minY = Math.min(minY, box.y1)
        maxX = Math.max(maxX, box.x2)
        maxY = Math.max(maxY, box.y2)
      }
    }

    x += (glyph.advanceWidth ?? 0) * scale + (char.trim() ? 0 : WORD_GAP)
    prev = { font, glyph }
  }

  const left = minX - PAD
  const top = minY - PAD
  const width = maxX - minX + PAD * 2
  const height = maxY - minY + PAD * 2

  return { glyphs, x: left, y: top, width, height, viewBox: `${left} ${top} ${width} ${height}` }
}
