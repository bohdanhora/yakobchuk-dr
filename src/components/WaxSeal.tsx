import { useId } from 'react'
import { content } from '../content'

const blob =
  'M50 3 C62 2 71 7 79 12 C88 18 95 26 97 37 C99 47 95 55 97 64 C96 76 88 85 78 91 C68 97 58 98 47 97 C36 97 26 93 17 86 C9 79 4 69 3 58 C2 47 3 37 7 27 C13 17 22 9 33 5 C39 3 44 3 50 3 Z'

export function WaxSeal({ className = '' }: { className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')

  return (
    <svg viewBox="0 0 100 100" aria-hidden className={className}>
      <defs>
        <radialGradient id={`${uid}wax`} cx="36%" cy="30%" r="78%">
          <stop offset="0" stopColor="#c9495e" />
          <stop offset="0.45" stopColor="#8e2436" />
          <stop offset="0.85" stopColor="#5a0e1e" />
          <stop offset="1" stopColor="#3a0a16" />
        </radialGradient>
        <radialGradient id={`${uid}inner`} cx="50%" cy="50%" r="50%">
          <stop offset="0.7" stopColor="#7a1f2e" />
          <stop offset="1" stopColor="#4a0a18" />
        </radialGradient>
        <linearGradient id={`${uid}gold`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbf0d0" />
          <stop offset="0.55" stopColor="#d9bb82" />
          <stop offset="1" stopColor="#a8834a" />
        </linearGradient>
      </defs>
      <path d={blob} fill={`url(#${uid}wax)`} />
      <circle cx="50" cy="50" r="33" fill={`url(#${uid}inner)`} />
      <circle cx="50" cy="50" r="33" fill="none" stroke="#2a0610" strokeOpacity="0.55" strokeWidth="2.5" />
      <circle cx="49.3" cy="49.3" r="33" fill="none" stroke="#f0a7b0" strokeOpacity="0.28" strokeWidth="0.8" />
      <circle cx="50" cy="50" r="27" fill="none" stroke={`url(#${uid}gold)`} strokeOpacity="0.55" strokeWidth="0.6" />
      <text
        x="50"
        y="53"
        textAnchor="middle"
        dominantBaseline="middle"
        className="font-script"
        fontSize="30"
        fill="#2a0610"
        fillOpacity="0.6"
      >
        {content.initials}
      </text>
      <text x="49.4" y="52" textAnchor="middle" dominantBaseline="middle" className="font-script" fontSize="30" fill={`url(#${uid}gold)`}>
        {content.initials}
      </text>
      <ellipse cx="34" cy="24" rx="13" ry="6" fill="#fff" opacity="0.16" transform="rotate(-28 34 24)" />
    </svg>
  )
}
