'use client'

import { useState, useEffect } from 'react'

interface SplashScreenProps {
  onComplete: () => void
  locale: string
  dict: any
}

export default function SplashScreen({ onComplete, locale, dict }: SplashScreenProps) {
  const [visible, setVisible] = useState(false)
  const [phraseVisible, setPhraseVisible] = useState(false)
  const [hintVisible, setHintVisible] = useState(false)
  const [fadingOut, setFadingOut] = useState(false)

  const phrases = dict?.site?.splashPhrases || []
  const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)]
  const subtitle = dict?.site?.splashSubtitle || ''

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 300)
    const t2 = setTimeout(() => setPhraseVisible(true), 1800)
    const t3 = setTimeout(() => setHintVisible(true), 3200)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  const handleEnter = () => {
    setFadingOut(true)
    setTimeout(onComplete, 800)
  }

  return (
    <div
      className={`splash-overlay ${fadingOut ? 'splash-fade-out' : ''}`}
      onClick={handleEnter}
    >
      <div className="splash-content">
        <div className={`splash-icon ${visible ? 'splash-visible' : ''}`}>
          <span className="text-6xl block mb-4">📖</span>
        </div>

        <h1 className={`splash-title ${visible ? 'splash-visible' : ''}`}>
          Codex Mundi
        </h1>

        <div className={`splash-divider ${visible ? 'splash-visible' : ''}`} />

        <p className={`splash-phrase ${phraseVisible ? 'splash-visible' : ''}`}>
          &ldquo;{randomPhrase}&rdquo;
        </p>

        <p className={`splash-hint ${hintVisible ? 'splash-visible' : ''}`}>
          {subtitle}
        </p>
      </div>

      <div className="splash-crt" />
    </div>
  )
}
