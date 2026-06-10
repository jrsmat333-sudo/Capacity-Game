import { useState, useEffect } from 'react'
import GameHeader from '../components/GameHeader'

const TOTAL_TIME = 35

const ITEMS = [
  {
    id: 'puce-email',
    type: 'email',
    name: 'PUCE Institucional',
    fromEmail: 'ANUNCIOS@puce.edu.ec',
    preview: 'Comunicado: Cuentas falsas difunden vacantes laborales de la PUCE',
    time: '11:20',
    unread: false,
    suspicious: false,
    feedbackType: 'safe',
    points: 0,
    fullContent: {
      heading: 'COMUNICADO INSTITUCIONAL',
      date: 'Quito, 01 de junio de 2026',
      body: 'La Pontificia Universidad Católica del Ecuador (PUCE) informa que se identificaron cuentas falsas que están difundiendo publicaciones sobre supuestas vacantes laborales.\n\nAnte esta situación, aclaramos que los procesos de convocatorias y contrataciones laborales de la PUCE se comunican únicamente a través de nuestra cuenta oficial de LinkedIn.\n\nPor ello, exhortamos a la ciudadanía a informarse a través de los medios oficiales y verificados de la Universidad.',
    },
    feedback: 'Correo oficial con dominio verificable @puce.edu.ec. No solicita datos personales ni contiene enlaces sospechosos. Un comunicado institucional válido.',
  },
  {
    id: 'puce-sms',
    type: 'sms',
    name: 'PUCE Admisiones',
    avatar: 'P',
    avatarBg: '#7A1930',
    number: '+593 98 412 7823',
    preview: 'Tu cupo vence HOY. Confirma: confirma-puce.cupos-matricula.net',
    time: '09:13',
    unread: true,
    suspicious: true,
    feedbackType: 'suspicious',
    points: 100,
    fullMessage: 'PUCE ADMISIONES: Tu cupo vence HOY a las 23:59. Confirma tu matrícula ahora antes de que sea asignado a otro estudiante:\n\nconfirma-puce.cupos-matricula.net\n\nSi ya confirmaste, ignora este mensaje.',
    feedback: '3 señales de alerta claras: (1) número desconocido no registrado como contacto oficial de la PUCE, (2) urgencia artificial ("vence HOY"), (3) URL con dominio falso "cupos-matricula.net" que imita a la PUCE sin ser el sitio oficial. La PUCE siempre se comunica por canales verificables.',
  },
  {
    id: 'discover',
    type: 'phone',
    name: 'Promociones',
    avatar: '📞',
    avatarBg: '#2A4A6A',
    number: '+593 99 678 9012',
    preview: 'DISCOVER-PUCE: ¡Solicita tu tarjeta estudiantil sin costo de emisión!',
    time: '08:30',
    unread: false,
    suspicious: false,
    feedbackType: 'safe',
    points: 0,
    fullMessage: '¡Hola estudiante PUCE! Te invitamos a solicitar tu tarjeta de crédito DISCOVER-PUCE. Sin costo de emisión, con beneficios exclusivos en el campus. Sin codeudor. Llama al 1800-DISCOVER o visita la sucursal más cercana.',
    feedback: 'Publicidad comercial de una tarjeta de crédito. Aunque puede resultar molesta, no solicita credenciales ni redirige a sitios maliciosos. No es un intento de phishing.',
  },
]

export default function GameSection5({ score, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)

  useEffect(() => {
    if (answered) return
    if (timeLeft <= 0) { setAnswered(true); return }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000)
    return () => clearInterval(t)
  }, [timeLeft, answered])

  const handleSelect = (item) => {
    if (answered) return
    setSelected(item)
    setAnswered(true)
  }

  const handleNext = () => {
    if (!selected) { onComplete(0); return }
    let pts = selected.points
    if (pts > 0 && timeLeft > TOTAL_TIME / 2) pts += 50
    onComplete(pts)
  }

  const timedOut = answered && !selected

  return (
    <div className="min-h-screen bg-[#080C10] flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#1A4A6A] opacity-15 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#C9A84C 1px,transparent 1px),linear-gradient(90deg,#C9A84C 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <GameHeader section={5} timeLeft={timeLeft} totalTime={TOTAL_TIME} instruction="¿Cuál de estos mensajes es un intento de phishing? Tócalo" score={score} />

      <div className="flex-1 px-4 py-3 max-w-md mx-auto w-full flex flex-col">

        {/* App header bar */}
        <div className="rounded-t-2xl px-4 py-3 flex items-center gap-2" style={{ background: 'rgba(20,8,14,0.98)', border: '1px solid rgba(201,168,76,0.1)', borderBottom: '1px solid rgba(201,168,76,0.06)' }}>
          <div className="w-2 h-2 rounded-full bg-green-400 animate-[blink_2s_ease-in-out_infinite]" />
          <span className="text-white text-sm font-semibold flex-1">Mensajes</span>
          <span className="text-[#9A8090] text-xs">{ITEMS.filter(c => c.unread).length} nuevo</span>
        </div>

        {/* Item list */}
        <div className="flex-1 overflow-y-auto rounded-b-2xl" style={{ background: 'rgba(15,6,10,0.98)', border: '1px solid rgba(201,168,76,0.1)', borderTop: 'none' }}>
          {ITEMS.map((item, i) => {
            const isSelected = selected?.id === item.id

            return (
              <div key={item.id}>
                <div
                  onClick={() => handleSelect(item)}
                  className={`flex items-start gap-3 px-4 py-4 cursor-pointer transition-all duration-300 ${!answered ? 'hover:bg-[rgba(201,168,76,0.04)] active:bg-[rgba(201,168,76,0.08)]' : ''} animate-fade-in-up`}
                  style={{
                    borderBottom: i < ITEMS.length - 1 ? '1px solid rgba(201,168,76,0.05)' : 'none',
                    background: isSelected
                      ? item.suspicious
                        ? 'rgba(239,68,68,0.08)'
                        : 'rgba(74,222,128,0.05)'
                      : 'transparent',
                    animationDelay: `${i * 100}ms`,
                  }}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    {item.type === 'email' ? (
                      <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center" style={{ background: '#1A2A3A' }}>
                        <img src="/img/logo-verdadero.png" alt="PUCE" className="w-10 h-10 object-contain" />
                      </div>
                    ) : (
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center font-black text-lg text-white"
                        style={{ background: item.avatarBg }}
                      >
                        {item.avatar}
                      </div>
                    )}
                    {item.unread && (
                      <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#C9A84C] border-2 border-[#0F060A]" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-white font-semibold text-sm">{item.name}</span>
                      <span className="text-[#9A8090] text-xs flex-shrink-0">{item.time}</span>
                    </div>

                    {item.type === 'email' && (
                      <p className="text-[#A08898] text-xs font-mono mb-0.5">{item.fromEmail}</p>
                    )}
                    {(item.type === 'sms' || item.type === 'phone') && item.number && (
                      <p className="text-[#A08898] text-xs font-mono mb-0.5">{item.number}</p>
                    )}

                    <p className={`text-xs leading-snug truncate ${item.unread ? 'text-[#ECD8DC] font-medium' : 'text-[#C8A8B8]'}`}>
                      {item.preview}
                    </p>

                    {/* Expanded content after selection */}
                    {isSelected && (
                      <div className="mt-3 animate-fade-in-up">
                        {item.type === 'email' && item.fullContent ? (
                          <div className="rounded-xl p-3 mb-2" style={{ background: 'rgba(26,42,58,0.6)', border: '1px solid rgba(74,222,128,0.2)' }}>
                            <div className="flex items-center gap-2 mb-2">
                              <img src="/img/logo-verdadero.png" alt="PUCE" className="h-6 object-contain" />
                              <span className="text-[#C9A84C] text-[10px] font-bold uppercase tracking-wider">PUCE</span>
                            </div>
                            <p className="text-white text-xs font-bold mb-1">{item.fullContent.heading}</p>
                            <p className="text-[#A0B0C0] text-[10px] mb-2">{item.fullContent.date}</p>
                            <p className="text-[#D0C8D8] text-xs leading-relaxed whitespace-pre-line">{item.fullContent.body}</p>
                          </div>
                        ) : (
                          <div className="rounded-xl p-3 mb-2 text-xs leading-relaxed whitespace-pre-line text-white" style={{ background: 'rgba(30,15,20,0.8)', border: '1px solid rgba(201,168,76,0.15)' }}>
                            {item.fullMessage}
                          </div>
                        )}
                        <div className="rounded-xl p-3" style={{
                          background: item.suspicious ? 'rgba(239,68,68,0.1)' : 'rgba(74,222,128,0.1)',
                          border: `1px solid ${item.suspicious ? 'rgba(239,68,68,0.3)' : 'rgba(74,222,128,0.3)'}`,
                        }}>
                          <p className={`text-xs font-black mb-1 ${item.suspicious ? 'text-red-400' : 'text-green-400'}`}>
                            {item.suspicious ? 'Phishing — Correcto' : 'No es phishing — Incorrecto'}
                          </p>
                          <p className={`text-xs leading-relaxed ${item.suspicious ? 'text-red-300/80' : 'text-green-300/80'}`}>
                            {item.feedback}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Result + next */}
        {answered && (
          <div className="mt-4 animate-fade-in-up">
            {timedOut ? (
              <div className="rounded-xl p-4 mb-3 text-center" style={{ background: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,168,76,0.25)' }}>
                <p className="text-[#C9A84C] font-bold">Tiempo agotado — sin puntos esta ronda</p>
              </div>
            ) : (
              <div className="rounded-xl p-4 mb-3 text-center" style={{
                background: selected?.suspicious ? 'rgba(74,222,128,0.07)' : 'rgba(239,68,68,0.07)',
                border: `1px solid ${selected?.suspicious ? 'rgba(74,222,128,0.25)' : 'rgba(239,68,68,0.25)'}`,
              }}>
                <p className={`font-bold text-sm ${selected?.suspicious ? 'text-green-400' : 'text-red-400'}`}>
                  {selected?.suspicious ? 'Correcto — identificaste el phishing' : 'Incorrecto — ese era un mensaje legítimo'}
                </p>
                {selected && selected.points > 0 && (
                  <p className="text-[#C9A84C] text-sm mt-1 font-bold">
                    +{selected.points + (timeLeft > TOTAL_TIME / 2 ? 50 : 0)} puntos
                    {timeLeft > TOTAL_TIME / 2 && <span className="text-xs text-[#A08040] ml-1 font-normal">+ bono velocidad</span>}
                  </p>
                )}
              </div>
            )}
            <button onClick={handleNext} className="w-full group relative">
              <div className="w-full py-4 rounded-xl font-black tracking-wider text-[#1A0508] uppercase shimmer-btn shadow-2xl text-center transition-transform duration-200 group-hover:scale-[1.02]">Siguiente Sección</div>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
