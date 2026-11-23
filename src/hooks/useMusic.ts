import { useCallback, useEffect, useRef, useState } from 'react'

export type TrackKey = 'main' | 'scroll'
export type Tracks = Record<TrackKey, string>

const gestures = ['pointerup', 'touchend', 'click', 'keydown'] as const
const MASTER = 0.7
const DUCKED = 0.1

const level = (ducked: boolean) => (ducked ? DUCKED : MASTER)

function supportsVolume() {
  const probe = new Audio()
  probe.volume = 0.5
  return probe.volume === 0.5
}

export function useMusic(tracks: Tracks | null) {
  const elements = useRef<Record<TrackKey, HTMLAudioElement> | null>(null)
  const fades = useRef(new Map<HTMLAudioElement, number>())
  const volumeControl = useRef(false)
  const current = useRef<TrackKey>('main')
  const started = useRef(false)
  const starting = useRef(false)
  const paused = useRef(false)
  const ducked = useRef(false)
  const [available, setAvailable] = useState(Boolean(tracks))
  const [playing, setPlaying] = useState(false)
  const mainSrc = tracks?.main
  const scrollSrc = tracks?.scroll

  const fade = useCallback((audio: HTMLAudioElement, to: number, ms: number, then?: () => void) => {
    const running = fades.current.get(audio)
    if (running) window.clearInterval(running)
    fades.current.delete(audio)
    if (!volumeControl.current) {
      then?.()
      return
    }
    const from = audio.volume
    const begin = performance.now()
    const id = window.setInterval(() => {
      const t = Math.min(1, (performance.now() - begin) / ms)
      audio.volume = from + (to - from) * t
      if (t < 1) return
      window.clearInterval(id)
      fades.current.delete(audio)
      then?.()
    }, 50)
    fades.current.set(audio, id)
  }, [])

  const begin = useCallback(
    (fromGesture: boolean) => {
      const els = elements.current
      if (!els || started.current || starting.current) return
      starting.current = true

      if (fromGesture) {
        const other = els[current.current === 'main' ? 'scroll' : 'main']
        other.muted = true
        other
          .play()
          .then(() => {
            other.pause()
            other.currentTime = 0
            other.muted = false
          })
          .catch(() => {
            other.muted = false
          })
      }

      const audio = els[current.current]
      if (volumeControl.current) audio.volume = 0
      audio
        .play()
        .then(() => {
          started.current = true
          paused.current = false
          fade(audio, level(ducked.current), 2500)
          setPlaying(true)
        })
        .catch(() => {})
        .finally(() => {
          starting.current = false
        })
    },
    [fade],
  )

  useEffect(() => {
    if (!mainSrc || !scrollSrc) return
    volumeControl.current = supportsVolume()
    const created = { main: new Audio(mainSrc), scroll: new Audio(scrollSrc) }
    const onError = () => setAvailable(false)
    for (const audio of Object.values(created)) {
      audio.loop = true
      audio.preload = 'auto'
      audio.setAttribute('playsinline', '')
      audio.addEventListener('error', onError)
    }
    elements.current = created
    const running = fades.current

    const onGesture = () => {
      if (started.current) {
        for (const type of gestures) window.removeEventListener(type, onGesture, true)
        return
      }
      if (!paused.current) begin(true)
    }
    for (const type of gestures) window.addEventListener(type, onGesture, true)
    begin(false)

    return () => {
      for (const type of gestures) window.removeEventListener(type, onGesture, true)
      for (const id of running.values()) window.clearInterval(id)
      running.clear()
      for (const audio of Object.values(created)) {
        audio.pause()
        audio.removeEventListener('error', onError)
      }
      elements.current = null
      started.current = false
      starting.current = false
    }
  }, [mainSrc, scrollSrc, begin])

  const start = useCallback(() => begin(true), [begin])

  const switchTo = useCallback(
    (key: TrackKey) => {
      const els = elements.current
      if (!els || current.current === key) return
      const prev = els[current.current]
      current.current = key
      if (!started.current || paused.current) return

      const next = els[key]
      next.currentTime = 0
      next.muted = ducked.current && !volumeControl.current
      if (volumeControl.current) next.volume = 0
      next.play().catch(() => {})
      fade(next, level(ducked.current), 3000)
      fade(prev, 0, 2500, () => prev.pause())
    },
    [fade],
  )

  const toggle = useCallback(() => {
    const els = elements.current
    if (!els) return
    if (!started.current) {
      paused.current = false
      begin(true)
      return
    }
    const audio = els[current.current]
    if (paused.current) {
      paused.current = false
      if (volumeControl.current) audio.volume = level(ducked.current)
      audio.play().catch(() => {})
      setPlaying(true)
    } else {
      paused.current = true
      audio.pause()
      setPlaying(false)
    }
  }, [begin])

  const duck = useCallback(
    (on: boolean) => {
      ducked.current = on
      const els = elements.current
      if (!els) return
      const audio = els[current.current]
      if (volumeControl.current) fade(audio, on ? DUCKED : MASTER, 500)
      else audio.muted = on
    },
    [fade],
  )

  return { available, playing, start, switchTo, toggle, duck }
}
