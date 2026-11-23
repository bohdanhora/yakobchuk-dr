import { useEffect, useMemo, useRef, type CSSProperties } from 'react'

const SPRITE = 64
const FRAME_MS = 1000 / 61

function glowSprite() {
  const sprite = document.createElement('canvas')
  sprite.width = SPRITE
  sprite.height = SPRITE
  const ctx = sprite.getContext('2d')
  if (!ctx) return sprite
  const half = SPRITE / 2
  const glow = ctx.createRadialGradient(half, half, 0, half, half, half)
  glow.addColorStop(0, 'rgba(248, 228, 180, 1)')
  glow.addColorStop(0.3, 'rgba(217, 187, 130, 0.45)')
  glow.addColorStop(1, 'rgba(217, 187, 130, 0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, SPRITE, SPRITE)
  return sprite
}

function GoldDust({ count }: { count: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const sprite = glowSprite()
    let width = 0
    let height = 0
    let frame = 0

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 0.5 + Math.random() * 1.6,
      vy: 0.06 + Math.random() * 0.22,
      vx: (Math.random() - 0.5) * 0.12,
      phase: Math.random() * Math.PI * 2,
      twinkle: 0.008 + Math.random() * 0.03,
    }))

    let last = 0
    const draw = (time: number) => {
      frame = requestAnimationFrame(draw)
      if (time - last < FRAME_MS) return
      last = time
      ctx.clearRect(0, 0, width, height)
      for (const p of particles) {
        p.y -= p.vy
        p.x += p.vx
        p.phase += p.twinkle
        if (p.y < -12) {
          p.y = height + 12
          p.x = Math.random() * width
        }
        const size = p.r * 10
        ctx.globalAlpha = 0.15 + 0.85 * (0.5 + 0.5 * Math.sin(p.phase))
        ctx.drawImage(sprite, p.x - size / 2, p.y - size / 2, size, size)
      }
      ctx.globalAlpha = 1
    }
    frame = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
    }
  }, [count])

  return <canvas ref={ref} className="absolute inset-0 size-full" />
}

function Petals({ count }: { count: number }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const far = i % 3 === 0
        return {
          id: i,
          far,
          left: Math.random() * 100,
          size: far ? 8 + Math.random() * 6 : 14 + Math.random() * 12,
          duration: far ? 22 + Math.random() * 10 : 13 + Math.random() * 9,
          delay: -Math.random() * 25,
          sway: (Math.random() - 0.5) * 180,
          spin: 200 + Math.random() * 500,
          alpha: far ? 0.3 : 0.85,
        }
      }),
    [count],
  )

  return (
    <>
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="petal-fill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#c9495e" />
            <stop offset="0.6" stopColor="#8e2436" />
            <stop offset="1" stopColor="#4a0a18" />
          </linearGradient>
        </defs>
      </svg>
      {petals.map((p) => (
        <svg
          key={p.id}
          viewBox="0 0 20 24"
          className="absolute top-0 opacity-0 motion-reduce:hidden"
          style={
            {
              left: `${p.left}%`,
              width: p.size,
              height: p.size * 1.2,
              animation: `petal-fall ${p.duration}s linear ${p.delay}s infinite`,
              '--sway': `${p.sway}px`,
              '--spin': `${p.spin}deg`,
              '--alpha': p.alpha,
            } as CSSProperties
          }
        >
          <path d="M10 0C16 4 20 11 17 18C15 22 12 24 10 24C8 24 5 22 3 18C0 11 4 4 10 0Z" fill="url(#petal-fill)" />
          <path d="M10 3C11 9 11 16 10 22" fill="none" stroke="#2a0610" strokeOpacity="0.25" strokeWidth="0.7" />
          <path d="M6 6C8 4 10 3 11 3" fill="none" stroke="#fff" strokeOpacity="0.25" strokeWidth="1" strokeLinecap="round" />
        </svg>
      ))}
    </>
  )
}

export function Atmosphere({ rich }: { rich: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute -top-48 -left-40 size-128 animate-drift-a rounded-full bg-radial from-wine-600/45 to-transparent to-70%" />
      <div className="absolute top-1/4 -right-56 size-128 animate-drift-b rounded-full bg-radial from-wine-500/25 to-transparent to-70%" />
      <div className="absolute -bottom-56 -left-20 size-128 animate-drift-c rounded-full bg-radial from-gold-600/15 to-transparent to-70%" />
      <GoldDust count={rich ? 60 : 34} />
      <Petals count={rich ? 12 : 5} />
      <div className="absolute inset-0 bg-radial from-transparent from-45% to-night/85" />
    </div>
  )
}
