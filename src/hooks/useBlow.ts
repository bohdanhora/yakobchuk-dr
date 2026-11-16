import { useMotionValue } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'

export type BlowStatus = 'idle' | 'starting' | 'listening' | 'denied' | 'unsupported'

const LOW_BAND_HZ = 1200
const THRESHOLD = 0.45
const SUSTAIN_FRAMES = 8
const BLOW_INTERVAL_MS = 170

export function useBlow(onBlow: () => void) {
  const [status, setStatus] = useState<BlowStatus>(() =>
    typeof navigator.mediaDevices?.getUserMedia === 'function' ? 'idle' : 'unsupported',
  )
  const level = useMotionValue(0)
  const onBlowRef = useRef(onBlow)
  const cleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    onBlowRef.current = onBlow
  })

  const stop = useCallback(() => {
    cleanupRef.current?.()
    cleanupRef.current = null
    level.set(0)
    setStatus((s) => (s === 'listening' || s === 'starting' ? 'idle' : s))
  }, [level])

  const start = useCallback(async () => {
    if (cleanupRef.current) return
    setStatus('starting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: false, autoGainControl: false },
      })
      const ctx = new AudioContext()
      await ctx.resume()
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 512
      analyser.smoothingTimeConstant = 0.2
      ctx.createMediaStreamSource(stream).connect(analyser)

      const bins = new Uint8Array(analyser.frequencyBinCount)
      const top = Math.max(4, Math.round(LOW_BAND_HZ / (ctx.sampleRate / analyser.fftSize)))
      let frame = 0
      let strong = 0
      let lastBlow = 0

      const loop = (time: number) => {
        analyser.getByteFrequencyData(bins)
        let sum = 0
        for (let i = 1; i < top; i++) sum += bins[i]
        const value = sum / (top - 1) / 255
        level.set(value)
        strong = value > THRESHOLD ? strong + 1 : Math.max(0, strong - 2)
        if (strong >= SUSTAIN_FRAMES && time - lastBlow > BLOW_INTERVAL_MS) {
          lastBlow = time
          onBlowRef.current()
        }
        frame = requestAnimationFrame(loop)
      }
      frame = requestAnimationFrame(loop)

      cleanupRef.current = () => {
        cancelAnimationFrame(frame)
        stream.getTracks().forEach((track) => track.stop())
        ctx.close()
      }
      setStatus('listening')
    } catch {
      setStatus('denied')
    }
  }, [level])

  useEffect(() => () => cleanupRef.current?.(), [])

  return { status, level, start, stop }
}
