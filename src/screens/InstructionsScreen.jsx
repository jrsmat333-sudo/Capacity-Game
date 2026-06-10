import { useState, useEffect } from 'react'

const RULES = [
  {
    number: '01',
    title: 'Observa con atención',
    body: 'En cada ronda verás una situación real. Tu trabajo es identificar qué es sospechoso.'
  },
  {
    number: '02',
    title: 'El tiempo corre',
    body: 'Tienes tiempo limitado en cada ronda. Actúa rápido pero sin perder el detalle.'
  },
]

const PHISHING_FACTS = [
  "El término \"phishing\" viene de \"fishing\" (pescar en inglés). Los atacantes \"lanzan anzuelos\" digitales esperando que alguien muerda el cebo.",
  "El primer ataque de phishing registrado ocurrió en 1996, dirigido a usuarios de AOL. Usaban mensajes falsos para robar contraseñas.",
  "Más del 90% de los ciberataques comienzan con un correo de phishing. Es la puerta de entrada más usada por los hackers.",
  "Existe el \"spear phishing\": ataques dirigidos a una persona específica. Los criminales investigan a la víctima antes de atacar.",
  "Un ataque de phishing puede imitar perfectamente el logo, colores y dominio de tu banco o universidad. La diferencia suele estar en un carácter del URL.",
  "El \"smishing\" es phishing por SMS. El \"vishing\" es por llamada de voz. Son tan peligrosos como el correo electrónico.",
  "Se envían aproximadamente 3.4 billones de correos de phishing al día en todo el mundo.",
  "El 65% de los grupos de ciberataque utilizan phishing como vector principal de acceso a organizaciones.",
  "Pasar el cursor sobre un enlace sin hacer clic es una técnica clave: revela la URL real detrás del texto visible.",
  "HTTPS no garantiza que un sitio sea legítimo. Los atacantes también pueden obtener certificados SSL para sus páginas falsas.",
]

export default function InstructionsScreen({ onReady }) {
  const [visibleRules, setVisibleRules] = useState([])
  const [nekoExpanded, setNekoExpanded] = useState(false)
  const [factIndex, setFactIndex] = useState(0)
  const [factVisible, setFactVisible] = useState(true)
  const [nekoPulsed, setNekoPulsed] = useState(false)
  const [autoNeko, setAutoNeko] = useState(false)

  // Staggered reveal of rules
  useEffect(() => {
    RULES.forEach((_, i) => {
      setTimeout(() => {
        setVisibleRules(prev => [...prev, i])
      }, 300 + i * 250)
    })
  }, [])

  // Auto-open neko hint after 2 seconds
  useEffect(() => {
    const t = setTimeout(() => setAutoNeko(true), 2000)
    return () => clearTimeout(t)
  }, [])

  const handleNekoClick = () => {
    if (!nekoExpanded) {
      setNekoExpanded(true)
      setAutoNeko(false)
      return
    }
    setFactVisible(false)
    setTimeout(() => {
      setFactIndex(prev => (prev + 1) % PHISHING_FACTS.length)
      setFactVisible(true)
    }, 200)
    setNekoPulsed(true)
    setTimeout(() => setNekoPulsed(false), 500)
  }

  return (
    <div className="min-h-screen bg-[#0D0508] relative overflow-hidden flex flex-col">

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#7A1930] opacity-10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(#C9A84C 1px, transparent 1px), linear-gradient(90deg, #C9A84C 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Header */}
      <header className="w-full flex justify-center pt-8 pb-2 z-10 animate-fade-in">
        <img src="/img/logo-puce.png" alt="Logo PUCE" className="h-10 object-contain opacity-70" />
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center px-6 py-4 z-10 max-w-2xl mx-auto w-full">

        {/* Title */}
        <div className="text-center mb-8 animate-fade-in-up">
          <p className="text-[#C9A84C] text-xs font-semibold tracking-[0.35em] uppercase mb-2">
            Antes de empezar
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-white">
            Como se{' '}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #C9A84C, #F0D080)' }}>
              juega
            </span>
          </h2>
        </div>

        {/* Rules */}
        <div className="w-full space-y-3 mb-8">
          {RULES.map((rule, i) => (
            <div
              key={i}
              className={`transition-all duration-500 ${visibleRules.includes(i) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
            >
              <div
                className="flex gap-4 p-4 rounded-xl items-start"
                style={{
                  background: 'linear-gradient(135deg, rgba(122,25,48,0.2), rgba(40,10,20,0.6))',
                  border: '1px solid rgba(201,168,76,0.15)',
                  boxShadow: 'inset 0 1px 0 rgba(201,168,76,0.08)'
                }}
              >
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-black text-sm"
                  style={{
                    background: 'linear-gradient(135deg, #7A1930, #A02040)',
                    color: '#C9A84C',
                    boxShadow: '0 4px 12px rgba(122,25,48,0.4)'
                  }}
                >
                  {rule.number}
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm mb-0.5">{rule.title}</h3>
                  <p className="text-[#A08090] text-sm leading-relaxed">{rule.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Points system */}
        <div
          className="w-full mb-8 p-4 rounded-xl animate-fade-in-up delay-500"
          style={{
            background: 'linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.03))',
            border: '1px solid rgba(201,168,76,0.2)',
          }}
        >
          <p className="text-[#C9A84C] text-xs font-semibold tracking-[0.2em] uppercase mb-3 text-center">
            Sistema de Puntos
          </p>
          <div className="flex gap-3">
            <div
              className="flex-1 rounded-lg p-3 text-center"
              style={{ background: 'rgba(40,160,80,0.12)', border: '1px solid rgba(40,160,80,0.25)' }}
            >
              <div className="text-green-400 font-black text-lg">+100</div>
              <div className="text-[#A0B090] text-xs mt-0.5">Correcto</div>
            </div>
            <div
              className="flex-1 rounded-lg p-3 text-center"
              style={{ background: 'rgba(200,50,50,0.12)', border: '1px solid rgba(200,50,50,0.25)' }}
            >
              <div className="text-red-400 font-black text-lg">0</div>
              <div className="text-[#B09090] text-xs mt-0.5">Incorrecto</div>
            </div>
            <div
              className="flex-1 rounded-lg p-3 text-center"
              style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)' }}
            >
              <div className="text-[#C9A84C] font-black text-lg">+50</div>
              <div className="text-[#A09070] text-xs mt-0.5">Rapido</div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onReady}
          className="w-full relative group animate-fade-in-up delay-700 mb-36"
        >
          <div
            className="w-full py-4 rounded-xl font-black text-lg tracking-wider text-[#1A0508] uppercase shimmer-btn shadow-2xl transition-transform duration-200 group-hover:scale-[1.02] group-active:scale-98 text-center"
          >
            Estoy listo — Comenzar
          </div>
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300 blur-xl bg-[#C9A84C] -z-10" />
        </button>
      </div>

      {/* Neko-puce — sticky bottom character */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-start px-4 pb-0 pointer-events-none">
        <div className="pointer-events-auto flex flex-col items-start max-w-sm">

          {/* Fact bubble */}
          {nekoExpanded && (
            <div
              className="mb-2 ml-2 rounded-2xl rounded-bl-sm p-4 shadow-2xl animate-bounce-in max-w-xs"
              style={{
                background: 'linear-gradient(135deg, rgba(15,5,10,0.97), rgba(30,10,20,0.98))',
                border: '1px solid rgba(201,168,76,0.3)',
                boxShadow: '0 -4px 24px rgba(122,25,48,0.3)'
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="px-2 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase"
                  style={{ background: 'rgba(201,168,76,0.15)', color: '#C9A84C' }}
                >
                  Dato curioso {factIndex + 1}/10
                </div>
              </div>
              <p
                className={`text-[#D0B0C0] text-xs leading-relaxed transition-opacity duration-200 ${factVisible ? 'opacity-100' : 'opacity-0'}`}
              >
                {PHISHING_FACTS[factIndex]}
              </p>
              <div className="mt-2 pt-2 border-t border-[#C9A84C] border-opacity-10">
                <span className="text-[#C9A84C] text-[10px] opacity-60">Toca para el siguiente dato</span>
              </div>
            </div>
          )}

          {/* Auto hint */}
          {autoNeko && !nekoExpanded && (
            <div
              className="mb-2 ml-14 px-3 py-1.5 rounded-full text-xs font-medium animate-bounce-in"
              style={{
                background: 'rgba(122,25,48,0.9)',
                border: '1px solid rgba(201,168,76,0.4)',
                color: '#C9A84C'
              }}
            >
              Tocame para saber mas
            </div>
          )}

          {/* Neko character */}
          <div
            onClick={handleNekoClick}
            className={`cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95 ${nekoPulsed ? 'animate-wiggle' : ''}`}
          >
            <img
              src="/img/neko-puce.png"
              alt="Neko PUCE"
              className="h-24 object-contain"
              style={{ filter: 'drop-shadow(0 -4px 16px rgba(122,25,48,0.6))', marginBottom: '-40px' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
