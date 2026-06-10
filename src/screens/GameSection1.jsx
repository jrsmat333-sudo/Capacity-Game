import { useState, useEffect } from 'react'
import GameHeader from '../components/GameHeader'

const TOTAL_TIME = 40

const DATE = 'Lun 9 Jun 2025 · 10:32'

const CARDS = [
  {
    id: 'real',
    senderName: 'Dirección de Informática',
    senderEmail: 'soporte@puce.edu.ec',
    subject: 'Recordatorio: Actualización de contraseña institucional',
    body: 'Estimado/a miembro de la comunidad PUCE, le informamos que su contraseña de acceso al portal institucional debe ser actualizada antes del viernes 13 de junio. Ingrese a su portal académico y siga las instrucciones en la sección Seguridad de cuenta. Atentamente, Dirección de Informática — PUCE.',
    logo: '/img/logo-verdadero.png',
    isFake: false,
    explanation: 'Dominio oficial @puce.edu.ec y logo institucional verificado. Este es el remitente legítimo de la universidad.',
  },
  {
    id: 'fake',
    senderName: 'Direccion de Informatica PUCE',
    senderEmail: 'soporte@puce.edu.ec.secure-alerts.com',
    subject: 'Recordatorio: Actualizacion de contrasena institucional',
    body: 'Estimado/a miembro de la comunidad PUCE, le informamos que su contrasena de acceso al portal institucional debe ser actualizada antes del viernes 13 de junio. Ingrese a su portal academico y siga las instrucciones en la seccion Seguridad de cuenta. Atentamente, Direccion de Informatica — PUCE.',
    logo: '/img/logo-falso.png',
    isFake: true,
    explanation: 'El dominio real es "secure-alerts.com". La PUCE aparece como subdominio para engañarte. Además, el logo no es el oficial y el texto carece de tildes.',
  },
]

function SenderEmail({ email }) {
  const at = email.indexOf('@')
  const user = email.slice(0, at)
  const domain = email.slice(at + 1)
  return (
    <span className="font-mono text-sm leading-snug break-all">
      <span className="text-[#E0CED4]">{user}</span>
      <span className="text-[#C9A84C]">@</span>
      <span className="text-[#F8F0F4] font-semibold">{domain}</span>
    </span>
  )
}

export default function GameSection1({ score, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME)
  const [answered, setAnswered] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [cards] = useState(() =>
    Math.random() > 0.5 ? [CARDS[0], CARDS[1]] : [CARDS[1], CARDS[0]]
  )
  const [shakeId, setShakeId] = useState(null)

  useEffect(() => {
    if (answered) return
    if (timeLeft <= 0) { setAnswered(true); return }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000)
    return () => clearInterval(t)
  }, [timeLeft, answered])

  const handleSelect = (card) => {
    if (answered) return
    setSelectedId(card.id)
    setAnswered(true)
    if (!card.isFake) {
      setShakeId(card.id)
      setTimeout(() => setShakeId(null), 600)
    }
  }

  const handleNext = () => {
    const isCorrect = CARDS.find(c => c.id === selectedId)?.isFake === true
    let earned = 0
    if (isCorrect) {
      earned = 100
      if (timeLeft > TOTAL_TIME / 2) earned += 50
    }
    onComplete(earned)
  }

  const timedOut = answered && selectedId === null
  const isCorrect = selectedId && CARDS.find(c => c.id === selectedId)?.isFake === true
  const earnedPreview = isCorrect ? (timeLeft > TOTAL_TIME / 2 ? 150 : 100) : 0

  const cardBorderStyle = (card) => {
    if (!answered) return '1px solid rgba(201,168,76,0.12)'
    return card.isFake ? '1.5px solid #EF4444' : '1.5px solid #4ADE80'
  }
  const cardGlow = (card) => {
    if (!answered) return 'none'
    return card.isFake
      ? '0 0 28px rgba(239,68,68,0.22)'
      : '0 0 28px rgba(74,222,128,0.22)'
  }

  return (
    <div className="min-h-screen bg-[#080C14] flex flex-col relative overflow-hidden">

      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#1A3A7A] opacity-15 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(#C9A84C 1px, transparent 1px), linear-gradient(90deg, #C9A84C 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Header */}
      <GameHeader
        section={1}
        timeLeft={timeLeft}
        totalTime={TOTAL_TIME}
        instruction="Toca el correo con el remitente falso"
        score={score}
      />

      {/* Cards */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 px-4 py-4 items-stretch max-w-3xl mx-auto w-full">
        {cards.map((card, i) => (
          <div
            key={card.id}
            onClick={() => handleSelect(card)}
            className={`flex-1 rounded-2xl overflow-hidden cursor-pointer transition-all duration-350 animate-fade-in-up
              ${!answered ? 'hover:brightness-110 hover:-translate-y-0.5 active:scale-[0.98]' : ''}
              ${shakeId === card.id ? 'animate-[wiggle_0.5s_ease-in-out]' : ''}
            `}
            style={{
              border: cardBorderStyle(card),
              boxShadow: cardGlow(card),
              background:
                'linear-gradient(160deg, rgba(22,14,32,0.97), rgba(16,10,26,0.99))',
              animationDelay: `${i * 120}ms`,
              transition:
                'border-color 0.4s ease, box-shadow 0.4s ease, transform 0.2s ease, filter 0.2s ease',
            }}
          >
            {/* Card top bar */}
            <div
              className="flex items-center gap-3 px-4 py-3"
              style={{ borderBottom: '1px solid rgba(201,168,76,0.07)' }}
            >
              <div
                className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-base"
                style={{ background: 'linear-gradient(135deg, #7A1930, #A02040)' }}
              >
                ✉
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold leading-tight truncate">
                  {card.senderName}
                </p>
                <p className="text-[#9A8088] text-xs mt-0.5">{DATE}</p>
              </div>
              {/* Unread dot */}
              {!answered && (
                <div className="w-2 h-2 rounded-full bg-[#C9A84C] flex-shrink-0 animate-[blink_2s_ease-in-out_infinite]" />
              )}
            </div>

            {/* Logo institucional */}
            <div
              className="px-4 py-3 flex justify-center"
              style={{ borderBottom: '1px solid rgba(201,168,76,0.05)' }}
            >
              <img src={card.logo} alt="Logo institucional" className="h-12 object-contain" />
            </div>

            {/* From field */}
            <div
              className="px-4 py-3"
              style={{ borderBottom: '1px solid rgba(201,168,76,0.05)' }}
            >
              <div className="flex gap-2 items-start">
                <span
                  className="text-[#B09098] text-xs font-bold mt-0.5 flex-shrink-0 uppercase tracking-wider"
                >
                  De:
                </span>
                <SenderEmail email={card.senderEmail} />
              </div>
            </div>

            {/* Subject */}
            <div
              className="px-4 py-2.5"
              style={{ borderBottom: '1px solid rgba(201,168,76,0.05)' }}
            >
              <div className="flex gap-2 items-start">
                <span className="text-[#B09098] text-xs font-bold mt-0.5 flex-shrink-0 uppercase tracking-wider">
                  Asunto:
                </span>
                <span className="text-[#ECD8DC] text-sm leading-snug">{card.subject}</span>
              </div>
            </div>

            {/* Body */}
            <div className="px-4 py-3">
              <p className="text-[#D8C4CC] text-sm leading-relaxed line-clamp-4">{card.body}</p>
            </div>

            {/* Feedback panel */}
            {answered && (
              <div
                className="px-4 py-3 animate-fade-in-up"
                style={{
                  borderTop: `1px solid ${card.isFake ? 'rgba(239,68,68,0.18)' : 'rgba(74,222,128,0.18)'}`,
                  background: card.isFake
                    ? 'rgba(239,68,68,0.07)'
                    : 'rgba(74,222,128,0.07)',
                }}
              >
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span
                    className={`text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      card.isFake
                        ? 'text-red-300 bg-red-950/60 border border-red-800/50'
                        : 'text-green-300 bg-green-950/60 border border-green-800/50'
                    }`}
                  >
                    {card.isFake ? 'Falso' : 'Legitimo'}
                  </span>
                  {card.id === selectedId && (
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        card.isFake
                          ? 'text-[#C9A84C] bg-amber-950/50 border border-amber-800/40'
                          : 'text-orange-400 bg-orange-950/50 border border-orange-800/40'
                      }`}
                    >
                      {card.isFake ? 'Tu seleccion — Correcto' : 'Tu seleccion — Incorrecto'}
                    </span>
                  )}
                </div>
                <p
                  className={`text-xs leading-relaxed ${
                    card.isFake ? 'text-red-300/80' : 'text-green-300/80'
                  }`}
                >
                  {card.explanation}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Result + Next button */}
      {answered && (
        <div className="px-4 pb-6 max-w-3xl mx-auto w-full animate-fade-in-up">
          <div
            className="rounded-xl p-4 mb-4 text-center"
            style={{
              background: isCorrect
                ? 'rgba(74,222,128,0.07)'
                : 'rgba(239,68,68,0.07)',
              border: `1px solid ${
                isCorrect ? 'rgba(74,222,128,0.25)' : 'rgba(239,68,68,0.25)'
              }`,
            }}
          >
            <p
              className={`font-bold text-base ${
                isCorrect ? 'text-green-400' : timedOut ? 'text-[#C9A84C]' : 'text-red-400'
              }`}
            >
              {timedOut
                ? 'Tiempo agotado — sin puntos esta ronda'
                : isCorrect
                ? 'Correcto — detectaste el phishing'
                : 'Incorrecto — ese era el remitente legitimo'}
            </p>
            {isCorrect && (
              <p className="text-[#C9A84C] text-sm mt-1 font-bold">
                +{earnedPreview} puntos
                {earnedPreview > 100 && (
                  <span className="text-xs text-[#A08040] ml-2 font-normal">
                    incluye bono de velocidad +50
                  </span>
                )}
              </p>
            )}
          </div>
          <button onClick={handleNext} className="w-full group relative">
            <div className="w-full py-4 rounded-xl font-black tracking-wider text-[#1A0508] uppercase shimmer-btn shadow-2xl text-center transition-transform duration-200 group-hover:scale-[1.02] group-active:scale-[0.98]">
              Siguiente Seccion
            </div>
          </button>
        </div>
      )}
    </div>
  )
}
