import { useEffect, useState } from 'react'
import { content } from '../content'

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

function birthdayStart() {
  const { year, month, day } = content.birthday
  return new Date(year, month - 1, day, 0, 0, 0, 0).getTime()
}

function isPreview() {
  return new URLSearchParams(window.location.search).has('preview')
}

export type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function useCountdown() {
  const [preview] = useState(isPreview)
  const [now, setNow] = useState(() => Date.now())
  const remaining = Math.max(0, birthdayStart() - now)
  const done = preview || remaining === 0

  useEffect(() => {
    if (done) return
    const id = window.setInterval(() => setNow(Date.now()), SECOND)
    return () => window.clearInterval(id)
  }, [done])

  const time: TimeLeft = {
    days: Math.floor(remaining / DAY),
    hours: Math.floor((remaining % DAY) / HOUR),
    minutes: Math.floor((remaining % HOUR) / MINUTE),
    seconds: Math.floor((remaining % MINUTE) / SECOND),
  }

  return { isOpen: done, time }
}
