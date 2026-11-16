import { useCallback, useEffect, useRef, useState } from 'react'

export type TrackKey = 'main' | 'scroll'
export type Tracks = Record<TrackKey, string>

type Graph = {
  ctx: AudioContext
  master: GainNode
  gains: Record<TrackKey, GainNode>
}

const keys: TrackKey[] = ['main', 'scroll']
const MASTER = 0.7
const DUCKED = 0.1

function ramp(ctx: AudioContext, param: AudioParam, to: number, seconds: number) {
  const now = ctx.currentTime
  param.cancelScheduledValues(now)
  param.setValueAtTime(param.value, now)
  param.linearRampToValueAtTime(to, now + seconds)
}

export function useMusic(tracks: Tracks | null) {
  const elements = useRef<Record<TrackKey, HTMLAudioElement> | null>(null)
  const graph = useRef<Graph | null>(null)
  const current = useRef<TrackKey>('main')
  const paused = useRef(false)
  const [available, setAvailable] = useState(Boolean(tracks))
  const [playing, setPlaying] = useState(false)
  const mainSrc = tracks?.main
  const scrollSrc = tracks?.scroll

  useEffect(() => {
    if (!mainSrc || !scrollSrc) return
    const created = { main: new Audio(mainSrc), scroll: new Audio(scrollSrc) }
    const onError = () => setAvailable(false)
    for (const audio of Object.values(created)) {
      audio.loop = true
      audio.preload = 'auto'
      audio.setAttribute('playsinline', '')
      audio.addEventListener('error', onError)
    }
    elements.current = created
    return () => {
      for (const audio of Object.values(created)) {
        audio.pause()
        audio.removeEventListener('error', onError)
      }
      graph.current?.ctx.close()
      graph.current = null
      elements.current = null
    }
  }, [mainSrc, scrollSrc])

  const start = useCallback(() => {
    const els = elements.current
    if (!els || graph.current) return
    const ctx = new AudioContext()
    const master = ctx.createGain()
    master.gain.value = MASTER
    master.connect(ctx.destination)
    const gains = {} as Record<TrackKey, GainNode>
    for (const key of keys) {
      const gain = ctx.createGain()
      gain.gain.value = 0
      ctx.createMediaElementSource(els[key]).connect(gain).connect(master)
      gains[key] = gain
    }
    graph.current = { ctx, master, gains }
    ctx.resume()

    els.scroll
      .play()
      .then(() => {
        if (current.current !== 'scroll') els.scroll.pause()
      })
      .catch(() => {})
    els.main.play().catch(() => setPlaying(false))
    ramp(ctx, gains.main.gain, 1, 2.5)
    paused.current = false
    setPlaying(true)
  }, [])

  const switchTo = useCallback((key: TrackKey) => {
    const g = graph.current
    const els = elements.current
    if (!g || !els || current.current === key) return
    const prev = current.current
    current.current = key
    if (paused.current) return

    ramp(g.ctx, g.gains[prev].gain, 0, 2.5)
    window.setTimeout(() => {
      if (current.current !== prev) els[prev].pause()
    }, 2600)
    els[key].play().catch(() => {})
    ramp(g.ctx, g.gains[key].gain, 1, 3)
  }, [])

  const toggle = useCallback(() => {
    const g = graph.current
    const els = elements.current
    if (!g || !els) return
    const audio = els[current.current]
    if (paused.current) {
      paused.current = false
      g.gains[current.current].gain.value = 1
      audio.play().catch(() => {})
      setPlaying(true)
    } else {
      paused.current = true
      audio.pause()
      setPlaying(false)
    }
  }, [])

  const duck = useCallback((on: boolean) => {
    const g = graph.current
    if (g) ramp(g.ctx, g.master.gain, on ? DUCKED : MASTER, 0.5)
  }, [])

  return { available, playing, start, switchTo, toggle, duck }
}
