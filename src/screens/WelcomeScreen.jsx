import { useState, useEffect } from 'react'

const DIALOGUES = [
  "¡Bienvenido, agente! Soy FALCON, uno de los guardianes de la información de la PUCE. Vigilo cada rincón de la red para proteger a nuestra comunidad.",
  "Los atacantes son astutos... usan correos falsos, enlaces trampa y mensajes engañosos. A eso se le llama phishing, y es más común de lo que crees.",
  "Es hora de poner a prueba tus conocimientos. ¿Tienes el ojo de águila para detectarlos? ¡Demuéstralo!"
]

const STAGES = [
  { label: 'Correo', icon: '✉' },
  { label: 'Alias', icon: '🔗' },
  { label: 'Enlace', icon: '💬' },
  { label: 'E-mail', icon: '🌐' },
  { label: 'Mensaje', icon: '📞' },
  { label: 'Llamada', icon: '📱' },
  { label: 'Oficio', icon: '📄' },
]

export default function WelcomeScreen({ onStart }) {
  const [dialogueIndex, setDialogueIndex] = useState(-1)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [logoLoaded, setLogoLoaded] = useState(false)
  const [mascotLoaded, setMascotLoaded] = useState(false)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => {
      setLogoLoaded(true)
    }, 100)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => {
      setMascotLoaded(true)
      setTimeout(() => setShowHint(true), 800)
    }, 400)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (dialogueIndex < 0) return
    const text = DIALOGUES[dialogueIndex]
    setDisplayedText('')
    setIsTyping(true)
    let i = 0
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1))
      i++
      if (i >= text.length) {
        clearInterval(interval)
        setIsTyping(false)
      }
    }, 28)
    return () => clearInterval(interval)
  }, [dialogueIndex])

  const handleMascotClick = () => {
    if (isTyping) {
      setDisplayedText(DIALOGUES[dialogueIndex])
      setIsTyping(false)
      return
    }
    if (dialogueIndex < DIALOGUES.length - 1) {
      setDialogueIndex(prev => prev + 1)
      setShowHint(false)
    }
  }

  const showDialogue = dialogueIndex >= 0
  const isLastDialogue = dialogueIndex === DIALOGUES.length - 1 && !isTyping

  return (
    <div className="min-h-screen bg-[#0D0508] relative overflow-hidden flex flex-col items-center">

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#7A1930] opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#C9A84C] opacity-8 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 border border-[#7A1930] opacity-5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 border border-[#C9A84C] opacity-5 rounded-full" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#C9A84C 1px, transparent 1px), linear-gradient(90deg, #C9A84C 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Header — Logo */}
      <header className="w-full flex justify-center pt-8 pb-4 z-10">
        <div
          className={`transition-all duration-700 ${logoLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
          style={{ transitionDelay: '100ms' }}
        >
          <img
            src="./img/logo-puce.png"
            alt="Logo PUCE"
            className="h-16 object-contain drop-shadow-lg"
          />
        </div>
      </header>

      {/* Divider line */}
      <div
        className={`w-48 h-px bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent transition-all duration-1000 ${logoLoaded ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}
        style={{ transitionDelay: '400ms' }}
      />

      {/* Game title */}
      <div
        className={`text-center mt-6 z-10 transition-all duration-700 ${logoLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        style={{ transitionDelay: '300ms' }}
      >
        <p className="text-[#C9A84C] text-xs font-semibold tracking-[0.35em] uppercase mb-2">
          Dirección de Informática - Seguridad de la Información
        </p>
        <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
          Guardián {' '}
          <span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: 'linear-gradient(135deg, #C9A84C, #F0D080, #A07830)' }}
          >
            de la Información
          </span>
        </h1>
        <p className="text-[#C9A84C] text-sm font-light mt-1 tracking-wider">
          Pon a prueba tu ojo para detectar ataques de phishing
        </p>
      </div>

      {/* Central mascot area */}
      <div className="flex-1 flex flex-col items-center justify-center z-10 mt-4 px-6 w-full max-w-xl">

        {/* Dialogue bubble */}
        {showDialogue && (
          <div
            key={dialogueIndex}
            className="relative mb-4 animate-bounce-in w-full max-w-md"
          >
            <div
              className="rounded-2xl px-5 py-4 text-white text-sm leading-relaxed shadow-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(122,25,48,0.95), rgba(80,15,30,0.98))',
                border: '1px solid rgba(201,168,76,0.4)',
                boxShadow: '0 8px 32px rgba(122,25,48,0.4), inset 0 1px 0 rgba(201,168,76,0.2)'
              }}
            >
              <div className="flex items-start gap-3">
                <div className="text-[#C9A84C] text-lg mt-0.5 flex-shrink-0">"</div>
                <p className="flex-1">
                  {displayedText}
                  {isTyping && (
                    <span className="inline-block w-0.5 h-4 bg-[#C9A84C] ml-0.5 animate-[blink_0.7s_step-end_infinite]" />
                  )}
                </p>
              </div>

              {/* Navigation indicator */}
              {!isTyping && (
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#C9A84C] border-opacity-20">
                  <div className="flex gap-1.5">
                    {DIALOGUES.map((_, i) => (
                      <div
                        key={i}
                        className="h-1.5 rounded-full transition-all duration-300"
                        style={{
                          width: i === dialogueIndex ? '20px' : '6px',
                          background: i <= dialogueIndex ? '#C9A84C' : 'rgba(201,168,76,0.25)'
                        }}
                      />
                    ))}
                  </div>
                  {!isLastDialogue && (
                    <span className="text-[#C9A84C] text-xs opacity-70 animate-[blink_1.2s_ease-in-out_infinite]">
                      Clic para continuar
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Bubble tail */}
            <div
              className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-3 overflow-hidden"
            >
              <div
                className="w-4 h-4 rotate-45 mx-auto"
                style={{ background: 'rgba(80,15,30,0.98)', border: '1px solid rgba(201,168,76,0.4)' }}
              />
            </div>
          </div>
        )}

        {/* Mascot */}
        <div className="relative cursor-pointer group" onClick={handleMascotClick}>

          {/* Glow ring */}
          <div
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ boxShadow: '0 0 40px rgba(201,168,76,0.35)' }}
          />

          {/* Click hint */}
          {showHint && dialogueIndex < 0 && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[#C9A84C] text-xs font-medium animate-[blink_1.4s_ease-in-out_infinite] whitespace-nowrap">
              Toca para conocer a FALCON
            </div>
          )}

          <div
            className={`transition-all duration-700 ${mascotLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'} animate-float`}
          >
            <img
              src="./img/mascota-puce.png"
              alt="FALCON mascota PUCE"
              className="h-52 md:h-64 object-contain drop-shadow-2xl transition-transform duration-200 group-hover:scale-105 group-active:scale-95"
              style={{ filter: 'drop-shadow(0 8px 24px rgba(122,25,48,0.5))' }}
            />
          </div>
        </div>

        {/* Mascot name badge */}
        <div
          className={`mt-3 px-5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-700 ${mascotLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{
            background: 'linear-gradient(135deg, rgba(122,25,48,0.8), rgba(160,25,50,0.6))',
            border: '1px solid rgba(201,168,76,0.5)',
            color: '#C9A84C',
            transitionDelay: '600ms'
          }}
        >
          FALCON — Guardián de la Información
        </div>

        {/* Start button — only after last dialogue */}
        {isLastDialogue && (
          <button
            onClick={onStart}
            className="mt-8 relative group animate-bounce-in"
          >
            <div
              className="px-12 py-4 rounded-xl font-black text-lg tracking-wider text-[#1A0508] uppercase shimmer-btn animate-glow shadow-2xl transition-transform duration-200 group-hover:scale-105 group-active:scale-95"
            >
              Comenzar
            </div>
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-[#C9A84C] -z-10" />
          </button>
        )}

        {/* If no dialogue yet, show start CTA after a delay */}
        {dialogueIndex < 0 && !showHint && (
          <div className="mt-6 text-[#7A7080] text-xs text-center animate-fade-in">
            Habla con FALCON para comenzar
          </div>
        )}
      </div>

      {/* Stage progress bar */}
      <div
        className={`w-full max-w-xl px-6 pb-8 z-10 transition-all duration-700 ${mascotLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        style={{ transitionDelay: '800ms' }}
      >
        <p className="text-[#C9A84C] text-xs font-semibold tracking-[0.2em] uppercase text-center mb-3">
          7 Secciones de Desafio
        </p>
        <div className="flex gap-2 justify-center">
          {STAGES.map((stage, i) => (
            <div
              key={i}
              className="flex-1 flex flex-col items-center gap-1 group"
              style={{ animationDelay: `${800 + i * 80}ms` }}
            >
              <div
                className="w-full h-8 rounded-lg flex items-center justify-center text-base transition-all duration-300 group-hover:scale-110"
                style={{
                  background: 'rgba(122,25,48,0.25)',
                  border: '1px solid rgba(201,168,76,0.2)',
                }}
              >
                {stage.icon}
              </div>
              <span className="text-[#7A5060] text-[9px] font-medium tracking-wide">
                {stage.label}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-2 h-1 bg-[#2A1018] rounded-full overflow-hidden">
          <div className="h-full w-0 bg-gradient-to-r from-[#7A1930] to-[#C9A84C] rounded-full" />
        </div>
      </div>
    </div>
  )
}
