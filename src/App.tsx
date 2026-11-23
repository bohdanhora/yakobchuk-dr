import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Atmosphere } from './components/Atmosphere'
import { Cake } from './components/Cake'
import { Countdown } from './components/Countdown'
import { Envelope } from './components/Envelope'
import { Hero } from './components/Hero'
import { Intro } from './components/Intro'
import { Letter } from './components/Letter'
import { MusicToggle, ScrollProgress } from './components/MusicToggle'
import { Polaroids } from './components/Polaroids'
import { Puzzle } from './components/Puzzle'
import { Reasons } from './components/Reasons'
import { SafariPrompt } from './components/SafariPrompt'
import { Story } from './components/Story'
import { content } from './content'
import { useCountdown } from './hooks/useCountdown'
import { useMusic } from './hooks/useMusic'

type Stage = 'envelope' | 'puzzle' | 'intro' | 'card'

export default function App() {
  const { isOpen, time } = useCountdown()
  const [stage, setStage] = useState<Stage>(() =>
    new URLSearchParams(window.location.search).get('preview') === 'card' ? 'card' : 'envelope',
  )
  const music = useMusic(content.music)
  const { switchTo } = music

  useEffect(() => {
    if (stage !== 'card') return
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.4) switchTo('scroll')
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [stage, switchTo])

  const showCard = () => {
    window.scrollTo(0, 0)
    setStage('card')
  }

  return (
    <MotionConfig reducedMotion="user">
      <Atmosphere rich={stage === 'card'} />
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <Countdown key="countdown" time={time} />
          ) : stage === 'envelope' ? (
            <Envelope key="envelope" onTap={music.start} onOpen={() => setStage('puzzle')} />
          ) : stage === 'puzzle' ? (
            <Puzzle key="puzzle" onSolved={() => setStage('intro')} />
          ) : stage === 'intro' ? (
            <Intro key="intro" onDone={showCard} />
          ) : (
            <motion.div key="card" className="overflow-x-clip" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>
              <Hero />
              <Letter />
              <Polaroids />
              <Reasons />
              <Story />
              <Cake onListenChange={music.duck} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      {isOpen && stage === 'envelope' && <SafariPrompt />}
      {stage === 'card' && <ScrollProgress />}
      {music.available &&<MusicToggle playing={music.playing} onToggle={music.toggle} />}
    </MotionConfig>
  )
}
