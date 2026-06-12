import { useState, useEffect } from 'react'

const COUNTDOWN_TOTAL = 7

const DIALOGUES = [
  "Gran trabajo, agente. Cada sección superada te acerca a ser un experto en ciberseguridad.",
  "Tú puedes. Prepárate para la siguiente sección.",
]

const LAST_DIALOGUES = [
  "¡Excelente trabajo, agente! Has completado todos los desafíos del entrenamiento.",
  "El juego ha finalizado. Ahora podrás ver tus resultados y descubrir tu nivel como detector de phishing.",
]

export default function SectionTransition({ sectionNum, sectionEarned, totalScore, totalSections, onNext }) {
  const [countdown, setCountdown] = useState(COUNTDOWN_TOTAL)
  const [dialogueIdx, setDialogueIdx] = useState(0)
  const isLast = sectionNum >= totalSections
  const activeDialogues = isLast ? LAST_DIALOGUES : DIALOGUES

  useEffect(() => {
    const t = setTimeout(() => {
      if (dialogueIdx < activeDialogues.length - 1) setDialogueIdx(d => d + 1)
    }, 2800)
    return () => clearTimeout(t)
  }, [dialogueIdx, activeDialogues.length])

  useEffect(() => {
    if (countdown <= 0) { onNext(); return }
    const t = setInterval(() => setCountdown(p => p - 1), 1000)
    return () => clearInterval(t)
  }, [countdown, onNext])

  const r = 34
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - countdown / COUNTDOWN_TOTAL)

  return (
    <div className="min-h-screen bg-[#0D0508] flex flex-col items-center justify-center px-6 relative overflow-hidden">

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #7A1930 0%, transparent 70%)' }}
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(#C9A84C 1px, transparent 1px), linear-gradient(90deg, #C9A84C 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Section badge */}
      <div className="animate-bounce-in mb-5">
        <div
          className="px-5 py-2 rounded-full text-xs font-black tracking-[0.25em] uppercase"
          style={{
            background: 'rgba(201,168,76,0.12)',
            border: '1px solid rgba(201,168,76,0.45)',
            color: '#C9A84C',
            boxShadow: '0 0 20px rgba(201,168,76,0.2)',
          }}
        >
          Sección {sectionNum} {isLast ? 'Completada' : 'Superada'}
        </div>
      </div>

      {/* Points earned */}
      {sectionEarned > 0 && (
        <div className="animate-fade-in-up mb-5 text-center" style={{ animationDelay: '150ms' }}>
          <div
            className="text-5xl font-black"
            style={{
              background: 'linear-gradient(135deg, #C9A84C, #F0D080)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            +{sectionEarned}
          </div>
          <div className="text-[#7A5060] text-xs mt-1 tracking-wider uppercase">
            puntos obtenidos
          </div>
        </div>
      )}
      {sectionEarned === 0 && (
        <div className="animate-fade-in-up mb-5 text-center" style={{ animationDelay: '150ms' }}>
          <div className="text-[#5A3040] text-sm">Sin puntos esta ronda — sigue aprendiendo</div>
        </div>
      )}

      {/* Dialogue bubble */}
      <div
        key={dialogueIdx}
        className="mb-4 max-w-xs w-full animate-bounce-in"
        style={{ animationDelay: '200ms' }}
      >
        <div
          className="rounded-2xl rounded-bl-sm px-5 py-4 text-sm text-white leading-relaxed"
          style={{
            background: 'linear-gradient(135deg, rgba(122,25,48,0.92), rgba(55,10,22,0.96))',
            border: '1px solid rgba(201,168,76,0.3)',
            boxShadow: '0 8px 24px rgba(122,25,48,0.3)',
          }}
        >
          <span className="text-[#C9A84C] text-lg mr-1">"</span>
          {activeDialogues[dialogueIdx]}
          <span className="text-[#C9A84C] text-lg ml-1">"</span>
        </div>
      </div>

      {/* Mascot */}
      <div className="animate-float mb-8">
        <img
          src="/img/mascota-puce.png"
          alt="FALCON"
          className="h-44 object-contain"
          style={{ filter: 'drop-shadow(0 8px 28px rgba(122,25,48,0.55))' }}
        />
      </div>

      {/* Countdown ring */}
      <div className="relative mb-6">
        <svg width="88" height="88" viewBox="0 0 88 88" className="-rotate-90">
          <circle
            cx="44" cy="44" r={r}
            fill="none"
            stroke="rgba(122,25,48,0.25)"
            strokeWidth="4"
          />
          <circle
            cx="44" cy="44" r={r}
            fill="none"
            stroke="#C9A84C"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.9s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black text-white leading-none">{countdown}</span>
          <span className="text-[9px] text-[#5A3040] tracking-widest uppercase mt-0.5">seg</span>
        </div>
      </div>

      {/* Manual next button */}
      <button onClick={onNext} className="group relative animate-fade-in-up">
        <div
          className="px-10 py-3.5 rounded-xl font-black tracking-wider text-[#1A0508] uppercase shimmer-btn shadow-xl transition-transform duration-200 group-hover:scale-105 group-active:scale-95"
        >
          {isLast ? 'Ver Resultados' : 'Siguiente Sección'}
        </div>
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-40 blur-xl bg-[#C9A84C] -z-10 transition-opacity duration-300" />
      </button>

      {/* Total score */}
      <div className="mt-6 text-center animate-fade-in">
        <span className="text-[#3A2030] text-xs">Puntaje acumulado: </span>
        <span className="text-[#C9A84C] text-sm font-black">{totalScore} pts</span>
      </div>
    </div>
  )
}
