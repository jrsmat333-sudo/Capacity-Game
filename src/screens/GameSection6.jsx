import { useState, useEffect } from 'react'
import GameHeader from '../components/GameHeader'

const TOTAL_TIME = 50

// phase: 'incoming' | 'round1' | 'round2' | 'result'
// earned is set when a final choice is made

const CALLER = {
  name: 'Soporte TI — PUCE',
  number: '+593 2 299-1700',
  subtitle: 'Número no registrado',
}

const SCRIPT = {
  incoming: {
    prompt: 'Tienes una llamada entrante de alguien que dice ser del departamento de Tecnologías de la Información de la PUCE.',
    question: '¿Qué haces?',
    options: [
      {
        id: 'decline',
        text: 'No contestar — verificar primero',
        detail: 'Colgar y buscar el contacto oficial en el directorio PUCE.',
        earned: 150,
        next: 'result',
        correct: true,
        feedback: 'Respuesta ideal. Ante una llamada no esperada de soporte técnico, siempre lo correcto es no contestar y verificar el número de forma independiente en el directorio oficial.',
      },
      {
        id: 'answer',
        text: 'Sí, contestar',
        detail: null,
        earned: null,
        next: 'round1',
        correct: false,
        feedback: null,
      },
    ],
  },
  round1: {
    caller: '"Buenos días, somos del departamento de TI de la PUCE. Estamos actualizando el sistema y necesitamos que nos confirme su usuario y contraseña para que no pierda acceso."',
    question: '¿Qué respondes?',
    options: [
      {
        id: 'give_creds',
        text: 'Claro, mi usuario es... y mi clave es...',
        detail: 'Proporcionar credenciales al instante.',
        earned: 0,
        next: 'result',
        correct: false,
        feedback: 'Gravísimo error. Nunca, bajo ninguna circunstancia, compartas tus credenciales por teléfono. Ningún departamento de TI legítimo las pedirá así.',
      },
      {
        id: 'verify',
        text: 'Espere, voy a verificar llamando directamente a TI',
        detail: 'Colgar y llamar al número oficial del directorio PUCE.',
        earned: 100,
        next: 'result',
        correct: true,
        feedback: 'Muy bien. Verificar de forma independiente es la respuesta correcta. Siempre cuelga y llama al número oficial que tú buscas, no al que te dieron.',
      },
      {
        id: 'ticket',
        text: '¿Puede darme un número de ticket o referencia?',
        detail: 'Pedir comprobante antes de dar información.',
        earned: null,
        next: 'round2',
        correct: null,
        feedback: 'Precaución: el atacante puede inventar un número de ticket. Pedir referencia es mejor que dar datos, pero la respuesta ideal es colgar y verificar de forma independiente.',
      },
    ],
  },
  round2: {
    caller: '"Claro, el ticket es #TI-2025-447. Como verá, es urgente — si no verificamos ahora, su cuenta queda bloqueada en 10 minutos. ¿Me confirma sus datos?"',
    question: '¿Ahora qué haces?',
    options: [
      {
        id: 'give_creds',
        text: 'Está bien, le doy mis datos...',
        detail: 'Proporcionar usuario y contraseña.',
        earned: 0,
        next: 'result',
        correct: false,
        feedback: 'Incorrecto. El número de ticket puede ser completamente inventado. La urgencia añadida ("10 minutos") es otra señal de ingeniería social.',
      },
      {
        id: 'hang_up',
        text: 'Voy a colgar y contactar TI por el directorio oficial',
        detail: 'Colgar y verificar de forma independiente.',
        earned: 75,
        next: 'result',
        correct: true,
        feedback: 'Correcto. Cuelgas y verificas de manera independiente. Lo ideal era no contestar desde el inicio, pero reconociste la manipulación a tiempo.',
      },
    ],
  },
}

export default function GameSection6({ score, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME)
  const [phase, setPhase] = useState('incoming')
  const [earned, setEarned] = useState(null)
  const [chosenOption, setChosenOption] = useState(null)
  const [ringing, setRinging] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setRinging(false), 2000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (phase === 'result') return
    if (timeLeft <= 0) {
      setEarned(0)
      setChosenOption({ feedback: 'Tiempo agotado — no respondiste a tiempo.' })
      setPhase('result')
      return
    }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000)
    return () => clearInterval(t)
  }, [timeLeft, phase])

  const handleChoice = (option) => {
    setChosenOption(option)
    if (option.next === 'result') {
      setEarned(option.earned ?? 0)
      setPhase('result')
    } else {
      setPhase(option.next)
    }
  }

  const handleNext = () => onComplete(earned ?? 0)

  const currentScript = phase !== 'result' ? SCRIPT[phase] : null

  return (
    <div className="min-h-screen bg-[#080810] flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#1A2A7A] opacity-15 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#C9A84C 1px,transparent 1px),linear-gradient(90deg,#C9A84C 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <GameHeader section={6} timeLeft={timeLeft} totalTime={TOTAL_TIME} instruction="Escenario de llamada — ¿cómo respondes?" score={score} />

      <div className="flex-1 flex flex-col items-center justify-start px-6 pb-6 max-w-lg mx-auto w-full">

        {/* Caller card */}
        <div
          className="w-full rounded-2xl p-5 mb-5 flex flex-col items-center animate-fade-in-up"
          style={{ background: 'linear-gradient(160deg,rgba(14,14,30,0.97),rgba(10,10,24,0.99))', border: '1px solid rgba(201,168,76,0.12)' }}
        >
          {/* Phone icon with animation */}
          <div className={`relative mb-4 ${phase === 'incoming' ? 'animate-float' : ''}`}>
            {ringing && (
              <>
                <div className="absolute inset-0 rounded-full animate-[pulse-ring_1.5s_ease-out_infinite]" style={{ background: 'rgba(122,25,48,0.3)' }} />
                <div className="absolute inset-0 rounded-full animate-[pulse-ring_1.5s_ease-out_0.5s_infinite]" style={{ background: 'rgba(122,25,48,0.2)' }} />
              </>
            )}
            <div
              className="relative w-16 h-16 rounded-full flex items-center justify-center text-2xl z-10"
              style={{ background: 'linear-gradient(135deg,#7A1930,#A02040)', boxShadow: '0 8px 24px rgba(122,25,48,0.5)' }}
            >
              {phase === 'result' && chosenOption?.id !== 'answer' && earned === 0 ? '📵' : '📞'}
            </div>
          </div>

          <p className="text-white font-black text-lg">{CALLER.name}</p>
          <p className="text-[#C9A84C] font-mono text-sm mt-0.5">{CALLER.number}</p>
          <span className="mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-red-300" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}>
            {CALLER.subtitle}
          </span>
        </div>

        {/* Context / prompt for current phase */}
        {phase !== 'result' && currentScript && (
          <div className="w-full space-y-4 animate-fade-in-up">

            {/* Context / caller speech */}
            {phase === 'incoming' && (
              <div className="px-4 py-3 rounded-xl text-sm text-[#DCC8D4] leading-relaxed" style={{ background: 'rgba(20,16,36,0.8)', border: '1px solid rgba(201,168,76,0.1)' }}>
                {currentScript.prompt}
              </div>
            )}
            {(phase === 'round1' || phase === 'round2') && (
              <div className="px-4 py-3 rounded-xl text-sm leading-relaxed" style={{ background: 'rgba(122,25,48,0.15)', border: '1px solid rgba(122,25,48,0.3)' }}>
                <p className="text-[#B09098] text-xs font-bold uppercase tracking-wider mb-1">El llamante dice:</p>
                <p className="text-[#E0C0D0] italic leading-relaxed">{currentScript.caller}</p>
              </div>
            )}

            {/* Question */}
            <p className="text-white font-semibold text-center text-sm">{currentScript.question}</p>

            {/* Options */}
            <div className="space-y-3">
              {currentScript.options.map((opt, i) => (
                <button
                  key={opt.id}
                  onClick={() => handleChoice(opt)}
                  className="w-full text-left group animate-fade-in-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div
                    className="px-4 py-3.5 rounded-xl transition-all duration-200 group-hover:brightness-125 group-active:scale-[0.98]"
                    style={{ background: 'rgba(16,14,32,0.9)', border: '1px solid rgba(201,168,76,0.18)', boxShadow: 'inset 0 1px 0 rgba(201,168,76,0.06)' }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5"
                        style={{ background: 'rgba(201,168,76,0.15)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.3)' }}
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium leading-snug">{opt.text}</p>
                        {opt.detail && <p className="text-[#A09098] text-xs mt-0.5 leading-snug">{opt.detail}</p>}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Result */}
        {phase === 'result' && chosenOption && (
          <div className="w-full animate-fade-in-up space-y-4">
            {/* Score */}
            <div
              className="rounded-xl p-4 text-center"
              style={{
                background: earned > 0 ? 'rgba(74,222,128,0.07)' : 'rgba(239,68,68,0.07)',
                border: `1px solid ${earned > 0 ? 'rgba(74,222,128,0.25)' : 'rgba(239,68,68,0.25)'}`,
              }}
            >
              <p className={`font-bold text-base ${earned > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {earned === 150 ? 'Decisión perfecta — no contestaste' :
                 earned === 100 ? 'Bien hecho — verificaste de forma independiente' :
                 earned === 75  ? 'Buen instinto — colgaste a tiempo' :
                 earned === 0   ? 'Decisión incorrecta' : 'Tiempo agotado'}
              </p>
              {earned > 0 && <p className="text-[#C9A84C] text-sm mt-1 font-bold">+{earned} puntos</p>}
            </div>

            {/* Feedback explanation */}
            <div className="px-4 py-4 rounded-xl" style={{ background: 'rgba(122,25,48,0.12)', border: '1px solid rgba(201,168,76,0.15)' }}>
              <p className="text-[#C9A84C] text-xs font-bold uppercase tracking-wider mb-2">¿Por qué?</p>
              <p className="text-[#DCC8D4] text-sm leading-relaxed">{chosenOption.feedback}</p>
            </div>

            {/* Key rule */}
            <div className="px-4 py-3 rounded-xl" style={{ background: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,168,76,0.2)' }}>
              <p className="text-[#C9A84C] text-xs font-black uppercase tracking-wider mb-1">Regla de oro</p>
              <p className="text-white text-xs leading-relaxed">
                Ninguna entidad legítima — banco, universidad, operadora — pedirá tu contraseña por teléfono. La respuesta siempre es colgar y verificar llamando al número oficial que TÚ buscas.
              </p>
            </div>

            <button onClick={handleNext} className="w-full group relative">
              <div className="w-full py-4 rounded-xl font-black tracking-wider text-[#1A0508] uppercase shimmer-btn shadow-2xl text-center transition-transform duration-200 group-hover:scale-[1.02]">Ver mis resultados</div>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
