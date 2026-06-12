import { useState } from 'react'
import WelcomeScreen from './screens/WelcomeScreen'
import InstructionsScreen from './screens/InstructionsScreen'
import SectionTransition from './screens/SectionTransition'
import GameSection1 from './screens/GameSection1'
import GameSection2 from './screens/GameSection2'
import GameSection3 from './screens/GameSection3'
import GameSection4 from './screens/GameSection4'
import GameSection5 from './screens/GameSection5'
import GameSection6 from './screens/GameSection6'
import GameSection7 from './screens/GameSection7'
import ResultsScreen from './screens/ResultsScreen'

const TOTAL_SECTIONS = 7

const SECTION_MAX = [100, 100, 100, 150, 100, 150, 150]

export default function App() {
  const [phase, setPhase] = useState('welcome')
  const [currentSection, setCurrentSection] = useState(1)
  const [score, setScore] = useState(0)
  const [lastEarned, setLastEarned] = useState(0)
  const [sectionResults, setSectionResults] = useState([])

  const handleSectionComplete = (earned) => {
    setLastEarned(earned)
    setScore(prev => prev + earned)
    setSectionResults(prev => [
      ...prev,
      { section: currentSection, earned, max: SECTION_MAX[currentSection - 1] },
    ])
    setPhase('transition')
  }

  const handleNextSection = () => {
    if (currentSection >= TOTAL_SECTIONS) {
      setPhase('results')
    } else {
      setCurrentSection(prev => prev + 1)
      setPhase('playing')
    }
  }

  const handleRestart = () => {
    setPhase('playing')
    setCurrentSection(1)
    setScore(0)
    setLastEarned(0)
    setSectionResults([])
  }

  const handleHome = () => {
    setPhase('welcome')
    setCurrentSection(1)
    setScore(0)
    setLastEarned(0)
    setSectionResults([])
  }

  if (phase === 'welcome') {
    return <WelcomeScreen onStart={() => setPhase('instructions')} />
  }

  if (phase === 'instructions') {
    return <InstructionsScreen onReady={() => { setCurrentSection(1); setSectionResults([]); setScore(0); setPhase('playing') }} />
  }

  if (phase === 'transition') {
    return (
      <SectionTransition
        sectionNum={currentSection}
        sectionEarned={lastEarned}
        totalScore={score}
        totalSections={TOTAL_SECTIONS}
        onNext={handleNextSection}
      />
    )
  }

  if (phase === 'results') {
    return (
      <ResultsScreen
        score={score}
        sectionResults={sectionResults}
        onRestart={handleRestart}
        onHome={handleHome}
      />
    )
  }

  if (phase === 'playing') {
    const props = { score, onComplete: handleSectionComplete }
    if (currentSection === 1) return <GameSection1 {...props} />
    if (currentSection === 2) return <GameSection2 {...props} />
    if (currentSection === 3) return <GameSection3 {...props} />
    if (currentSection === 4) return <GameSection4 {...props} />
    if (currentSection === 5) return <GameSection5 {...props} />
    if (currentSection === 6) return <GameSection6 {...props} />
    if (currentSection === 7) return <GameSection7 {...props} />
  }

  return null
}
