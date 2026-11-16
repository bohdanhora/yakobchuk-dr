import confetti from 'canvas-confetti'

const gold = ['#fbf0d0', '#e3c88f', '#c9a66b', '#a8834a']
const festive = ['#7a1f2e', '#b23a4c', '#f6ebdd', ...gold]

export function sparkle(x = 0.5, y = 0.5, amount = 40) {
  confetti({
    particleCount: amount,
    spread: 360,
    startVelocity: 14,
    gravity: 0.3,
    decay: 0.92,
    ticks: 170,
    scalar: 0.6,
    shapes: ['star', 'circle'],
    colors: gold,
    origin: { x, y },
    disableForReducedMotion: true,
  })
}

export function fireworks() {
  const end = Date.now() + 2800
  const burst = () =>
    confetti({
      particleCount: 45,
      spread: 360,
      startVelocity: 26,
      gravity: 0.55,
      ticks: 220,
      scalar: 0.9,
      shapes: ['star', 'circle'],
      colors: festive,
      origin: { x: 0.15 + Math.random() * 0.7, y: 0.12 + Math.random() * 0.35 },
      disableForReducedMotion: true,
    })

  burst()
  const id = window.setInterval(() => {
    if (Date.now() > end) {
      window.clearInterval(id)
      return
    }
    burst()
  }, 380)

  const sides = () => {
    confetti({ particleCount: 2, angle: 60, spread: 55, origin: { x: 0, y: 0.8 }, colors: festive, disableForReducedMotion: true })
    confetti({ particleCount: 2, angle: 120, spread: 55, origin: { x: 1, y: 0.8 }, colors: festive, disableForReducedMotion: true })
    if (Date.now() < end - 1000) requestAnimationFrame(sides)
  }
  sides()
}

export function plural(n: number, forms: [string, string, string]) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return forms[0]
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1]
  return forms[2]
}
