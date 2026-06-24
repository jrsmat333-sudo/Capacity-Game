import { useState, useEffect } from 'react'
import GameHeader from '../components/GameHeader'

const TOTAL_TIME = 45

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
    points: 0,
    fullContent: {
      heading: 'COMUNICADO INSTITUCIONAL',
      subheading: 'Pontificia Universidad Católica del Ecuador',
      date: 'Quito, 01 de junio de 2026',
      body: 'La Pontificia Universidad Católica del Ecuador (PUCE) informa que se identificaron cuentas falsas que están difundiendo publicaciones sobre supuestas vacantes laborales.\n\nAnte esta situación, aclaramos que los procesos de convocatorias y contrataciones laborales de la PUCE se comunican únicamente a través de nuestra cuenta oficial de LinkedIn.\n\nPor ello, exhortamos a la ciudadanía a informarse a través de los medios oficiales y verificados de la Universidad.',
    },
    feedback: 'Correo oficial con dominio verificable @puce.edu.ec. Comunica un aviso institucional sin solicitar datos personales ni redirigir a sitios sospechosos. No es phishing.',
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
    points: 100,
    fullMessage: 'PUCE ADMISIONES: Tu cupo vence HOY a las 23:59. Confirma tu matrícula ahora antes de que sea asignado a otro estudiante:\n\nconfirma-puce.cupos-matricula.net\n\nSi ya confirmaste, ignora este mensaje.',
    feedback: '3 señales de alerta: (1) número desconocido que no es contacto oficial de la PUCE, (2) urgencia artificial ("vence HOY"), (3) URL con dominio falso "cupos-matricula.net" — la PUCE nunca envía SMS desde números privados con links externos.',
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
    points: 0,
    fullMessage: '¡Hola estudiante PUCE! Te invitamos a solicitar tu tarjeta de crédito DISCOVER-PUCE. Sin costo de emisión, con beneficios exclusivos en el campus. Sin codeudor. Llama al 1800-DISCOVER o visita la sucursal más cercana.',
    feedback: 'Publicidad comercial de una tarjeta de crédito. No solicita credenciales ni redirige a sitios maliciosos. Puede ser molesta, pero no es un intento de phishing.',
  },
]

export default function GameSection5({ score, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME)
  const [openedId, setOpenedId] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [reported, setReported] = useState(null)

  useEffect(() => {
    if (answered) return
    if (timeLeft <= 0) { setAnswered(true); return }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000)
    return () => clearInterval(t)
  }, [timeLeft, answered])

  const openedItem = ITEMS.find(i => i.id === openedId) ?? null

  const handleOpen = (item) => {
    if (answered) return
    setOpenedId(item.id)
  }

  const handleBack = () => setOpenedId(null)

  const handleReport = (item) => {
    setReported(item)
    setAnswered(true)
    setOpenedId(null)
  }

  const handleNext = () => {
    if (!reported) { onComplete(0); return }
    let pts = reported.points
    if (pts > 0 && timeLeft > TOTAL_TIME / 2) pts += 50
    onComplete(pts)
  }

  const timedOut = answered && !reported

  // ── Detail view ──────────────────────────────────────────────
  if (openedId && !answered) {
    const item = openedItem
    return (
      <div className="min-h-screen bg-[#080C10] flex flex-col relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#1A4A6A] opacity-15 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#C9A84C 1px,transparent 1px),linear-gradient(90deg,#C9A84C 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        <GameHeader section={5} timeLeft={timeLeft} totalTime={TOTAL_TIME} instruction="Analiza el contenido — ¿es phishing?" score={score} />

        {/* Back button */}
        <div className="px-4 pt-2 pb-1 max-w-md mx-auto w-full">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-[#C9A84C] text-sm font-semibold py-1"
          >
            <span className="text-base">←</span> Volver a mensajes
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 px-4 pb-4 max-w-md mx-auto w-full overflow-y-auto">
          <div className="rounded-2xl overflow-hidden mb-4" style={{ background: 'rgba(15,6,10,0.98)', border: '1px solid rgba(201,168,76,0.12)' }}>

            {/* Item header */}
            <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid rgba(201,168,76,0.08)' }}>
              {item.type === 'email' ? (
                <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0" style={{ background: '#1A2A3A' }}>
                  <img src="./img/logo-verdadero.png" alt="PUCE" className="w-8 h-8 object-contain" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-lg text-white flex-shrink-0" style={{ background: item.avatarBg }}>
                  {item.avatar}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-bold">{item.name}</p>
                {item.type === 'email' && <p className="text-[#A08898] text-xs font-mono">{item.fromEmail}</p>}
                {(item.type === 'sms' || item.type === 'phone') && item.number && (
                  <p className="text-[#A08898] text-xs font-mono">{item.number}</p>
                )}
              </div>
              <span className="text-[#9A8090] text-xs">{item.time}</span>
            </div>

            {/* Full content */}
            <div className="px-4 py-4">
              {item.type === 'email' && item.fullContent ? (
                <div>
                  <div className="flex items-center gap-3 mb-4 pb-3" style={{ borderBottom: '1px solid rgba(201,168,76,0.07)' }}>
                    <img src="./img/logo-verdadero.png" alt="PUCE" className="h-8 object-contain" />
                    <div>
                      <p className="text-white text-xs font-black">PUCE</p>
                      <p className="text-[#9A8090] text-[10px]">{item.fullContent.subheading}</p>
                    </div>
                  </div>
                  <p className="text-[#C9A84C] text-xs font-bold uppercase tracking-wider mb-1">{item.fullContent.heading}</p>
                  <p className="text-[#8A9090] text-xs mb-3">{item.fullContent.date}</p>
                  <p className="text-[#D0C8D8] text-sm leading-relaxed whitespace-pre-line">{item.fullContent.body}</p>
                </div>
              ) : item.type === 'sms' ? (
                <div className="space-y-2">
                  <div className="inline-block max-w-[85%] px-4 py-3 rounded-2xl rounded-tl-sm text-sm leading-relaxed text-white whitespace-pre-line" style={{ background: 'rgba(122,25,48,0.4)', border: '1px solid rgba(201,168,76,0.1)' }}>
                    {item.fullMessage}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl p-4" style={{ background: 'rgba(42,74,106,0.2)', border: '1px solid rgba(42,74,106,0.4)' }}>
                  <p className="text-[#C9A84C] text-xs font-bold uppercase tracking-wider mb-2">📞 Mensaje de voz / Promoción</p>
                  <p className="text-[#D0C8D8] text-sm leading-relaxed">{item.fullMessage}</p>
                </div>
              )}
            </div>
          </div>

          {/* Report button */}
          <button
            onClick={() => handleReport(item)}
            className="w-full group relative mb-3"
          >
            <div className="w-full py-4 rounded-xl font-black text-base tracking-wider text-white uppercase text-center transition-transform duration-200 group-hover:scale-[1.02] group-active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #8B1010, #C01820)', border: '1px solid rgba(239,68,68,0.4)', boxShadow: '0 4px 20px rgba(192,24,32,0.3)' }}
            >
              🚩 ¡Reportar phishing!
            </div>
          </button>

          <button onClick={handleBack} className="w-full py-3 rounded-xl text-sm text-[#9A8090] hover:text-[#C9A84C] transition-colors" style={{ border: '1px solid rgba(201,168,76,0.12)' }}>
            Este mensaje parece seguro — volver
          </button>
        </div>
      </div>
    )
  }

  // ── List view / Result view ───────────────────────────────────
  return (
    <div className="min-h-screen bg-[#080C10] flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#1A4A6A] opacity-15 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#C9A84C 1px,transparent 1px),linear-gradient(90deg,#C9A84C 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <GameHeader section={5} timeLeft={timeLeft} totalTime={TOTAL_TIME} instruction="¿Cuál de estos mensajes es un intento de phishing? Tócalo" score={score} />

      <div className="flex-1 px-4 py-3 max-w-md mx-auto w-full flex flex-col">

        {!answered && (
          <p className="text-[#9A8090] text-xs text-center mb-2">Toca un mensaje para ver su contenido</p>
        )}

        {/* App header bar */}
        <div className="rounded-t-2xl px-4 py-3 flex items-center gap-2" style={{ background: 'rgba(20,8,14,0.98)', border: '1px solid rgba(201,168,76,0.1)', borderBottom: '1px solid rgba(201,168,76,0.06)' }}>
          <div className="w-2 h-2 rounded-full bg-green-400 animate-[blink_2s_ease-in-out_infinite]" />
          <span className="text-white text-sm font-semibold flex-1">Mensajes</span>
          <span className="text-[#9A8090] text-xs">{ITEMS.filter(c => c.unread).length} nuevo</span>
        </div>

        {/* Item list */}
        <div className="flex-1 overflow-y-auto rounded-b-2xl" style={{ background: 'rgba(15,6,10,0.98)', border: '1px solid rgba(201,168,76,0.1)', borderTop: 'none' }}>
          {ITEMS.map((item, i) => {
            const isReported = reported?.id === item.id

            return (
              <div
                key={item.id}
                onClick={() => !answered && handleOpen(item)}
                className={`flex items-start gap-3 px-4 py-4 transition-all duration-300 animate-fade-in-up ${!answered ? 'cursor-pointer hover:bg-[rgba(201,168,76,0.04)] active:bg-[rgba(201,168,76,0.08)]' : 'cursor-default'}`}
                style={{
                  borderBottom: i < ITEMS.length - 1 ? '1px solid rgba(201,168,76,0.05)' : 'none',
                  background: answered
                    ? isReported
                      ? item.suspicious ? 'rgba(74,222,128,0.06)' : 'rgba(239,68,68,0.06)'
                      : item.suspicious ? 'rgba(239,68,68,0.04)' : 'transparent'
                    : 'transparent',
                  animationDelay: `${i * 80}ms`,
                }}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  {item.type === 'email' ? (
                    <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center" style={{ background: '#1A2A3A' }}>
                      <img src="./img/logo-verdadero.png" alt="PUCE" className="w-10 h-10 object-contain" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-lg text-white" style={{ background: item.avatarBg }}>
                      {item.avatar}
                    </div>
                  )}
                  {item.unread && !answered && (
                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#C9A84C] border-2 border-[#0F060A]" />
                  )}
                  {answered && item.suspicious && (
                    <div className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 border-2 border-[#0F060A] flex items-center justify-center">
                      <span className="text-white text-[8px] font-black">!</span>
                    </div>
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
                  <p className={`text-xs leading-snug truncate ${item.unread && !answered ? 'text-[#ECD8DC] font-medium' : 'text-[#C8A8B8]'}`}>
                    {item.preview}
                  </p>

                  {/* Post-answer: result tags */}
                  {answered && (
                    <div className="mt-2 flex flex-wrap gap-1.5 animate-fade-in">
                      {isReported && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.suspicious ? 'text-green-300 bg-green-950/60 border border-green-800/40' : 'text-red-300 bg-red-950/60 border border-red-800/40'}`}>
                          {item.suspicious ? '✓ Correcto — era phishing' : '✗ Incorrecto — no era phishing'}
                        </span>
                      )}
                      {!isReported && item.suspicious && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-red-300 bg-red-950/60 border border-red-800/40">
                          Este era el phishing
                        </span>
                      )}
                      {answered && (
                        <p className={`w-full text-[10px] leading-snug mt-0.5 ${item.suspicious ? 'text-red-300/70' : 'text-green-300/70'}`}>
                          {item.feedback}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Pre-answer: tap hint */}
                  {!answered && (
                    <p className="text-[#6A5068] text-[10px] mt-1">Toca para abrir →</p>
                  )}
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
                background: reported?.suspicious ? 'rgba(74,222,128,0.07)' : 'rgba(239,68,68,0.07)',
                border: `1px solid ${reported?.suspicious ? 'rgba(74,222,128,0.25)' : 'rgba(239,68,68,0.25)'}`,
              }}>
                <p className={`font-bold text-sm ${reported?.suspicious ? 'text-green-400' : 'text-red-400'}`}>
                  {reported?.suspicious ? 'Correcto — identificaste el phishing' : 'Incorrecto — ese era un mensaje legítimo'}
                </p>
                {reported && reported.points > 0 && (
                  <p className="text-[#C9A84C] text-sm mt-1 font-bold">
                    +{reported.points + (timeLeft > TOTAL_TIME / 2 ? 50 : 0)} puntos
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
