import { useState, useEffect } from 'react'
import GameHeader from '../components/GameHeader'

const TOTAL_TIME = 50
const BASE_MAX = 150

const ZONES = [
  { id: 1, suspicious: true,  label: 'Remitente falso',              reason: 'El dominio "puce-becas-quito.com" no es el oficial. El correo institucional de becas usa @puce.edu.ec.' },
  { id: 2, suspicious: true,  label: 'Saludo genérico',              reason: '"Estimada/o Estudiante" revela que el atacante no conoce tu nombre. Los correos institucionales te nombran directamente.' },
  { id: 3, suspicious: true,  label: 'Solicitud de pago fraudulenta', reason: 'La PUCE nunca solicita pagos de "diferencial de IVA" ni valores adicionales para confirmar una beca. Esto es una táctica de estafa.' },
  { id: 4, suspicious: true,  label: 'URL maliciosa',                reason: '"becas-puce.pagos-seguros.net" no es un dominio oficial de la PUCE. Nunca ingreses datos bancarios en este sitio.' },
  { id: 5, suspicious: true,  label: 'Urgencia artificial',          reason: '"48 horas o tu beca será reasignada" busca que actúes impulsivamente sin verificar la información con la institución.' },
  { id: 6, suspicious: true,  label: 'Solicitud de datos sensibles', reason: 'Ninguna institución legítima pide tu contraseña del portal ni datos bancarios por correo electrónico. Nunca.' },
  { id: 7, suspicious: false, label: 'Tu correo institucional',      reason: 'Tu propia dirección en "Para:" es correcta. No hay señal de alerta aquí.' },
  { id: 8, suspicious: false, label: 'Firma del correo',             reason: 'Una firma genérica por sí sola no es phishing, aunque suma indicios de sospecha con los demás elementos.' },
]

const SUSPICIOUS_ZONES = ZONES.filter(z => z.suspicious)

function ZoneSpan({ id, zones, tappedIds, onTap, done, children }) {
  const zone = zones.find(z => z.id === id)
  const isTapped = tappedIds.has(id)
  const missedSuspicious = done && zone.suspicious && !isTapped

  const getBg = () => {
    if (missedSuspicious) return 'rgba(239,68,68,0.2)'
    if (!isTapped) return 'transparent'
    return zone.suspicious ? 'rgba(74,222,128,0.18)' : 'rgba(251,146,60,0.12)'
  }
  const getColor = () => {
    if (missedSuspicious) return '#FCA5A5'
    if (!isTapped) return 'inherit'
    return zone.suspicious ? '#86EFAC' : '#FBB040'
  }
  const getBorder = () => {
    if (missedSuspicious) return '1.5px solid rgba(239,68,68,0.5)'
    if (!isTapped && !done) return '1px dashed rgba(201,168,76,0.5)'
    if (isTapped) return `1px solid ${zone.suspicious ? 'rgba(74,222,128,0.35)' : 'rgba(251,146,60,0.3)'}`
    return 'none'
  }

  return (
    <span
      onClick={() => !done && !isTapped && onTap(zone)}
      className="rounded px-0.5 transition-all duration-300"
      style={{
        background: getBg(),
        color: getColor(),
        outline: getBorder(),
        cursor: !done && !isTapped ? 'pointer' : 'default',
        display: 'inline',
      }}
    >
      {children}
    </span>
  )
}

export default function GameSection4({ score, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME)
  const [tappedIds, setTappedIds] = useState(new Set())
  const [foundCount, setFoundCount] = useState(0)
  const [activeZone, setActiveZone] = useState(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (done) return
    if (timeLeft <= 0) { setDone(true); return }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000)
    return () => clearInterval(t)
  }, [timeLeft, done])

  const handleTap = (zone) => {
    if (done || tappedIds.has(zone.id)) return
    setTappedIds(prev => new Set([...prev, zone.id]))
    if (zone.suspicious) setFoundCount(p => p + 1)
    setActiveZone(zone)
  }

  const handleDone = () => { setDone(true) }

  const handleNext = () => {
    const base = Math.round((foundCount / SUSPICIOUS_ZONES.length) * BASE_MAX)
    const allFound = foundCount >= SUSPICIOUS_ZONES.length
    const speed = allFound && timeLeft > TOTAL_TIME / 2 ? 50 : 0
    onComplete(base + speed)
  }

  const earnedPreview = Math.round((foundCount / SUSPICIOUS_ZONES.length) * BASE_MAX)
    + (foundCount >= SUSPICIOUS_ZONES.length && timeLeft > TOTAL_TIME / 2 ? 50 : 0)

  const zProps = { zones: ZONES, tappedIds, onTap: handleTap, done }

  return (
    <div className="min-h-screen bg-[#140808] flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#8A1818] opacity-15 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#C9A84C 1px,transparent 1px),linear-gradient(90deg,#C9A84C 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <GameHeader section={4} timeLeft={timeLeft} totalTime={TOTAL_TIME} instruction="Toca todo lo que te parezca sospechoso en este correo" score={score} />

      <div className="px-3 pt-1 pb-2 max-w-xl mx-auto w-full">
        <p className="text-[#A08898] text-xs text-center">Las zonas interactivas tienen subrayado punteado — tócalas para evaluarlas</p>
      </div>

      <div className="flex-1 px-4 pb-4 max-w-xl mx-auto w-full overflow-y-auto">
        {/* Phishing email */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(160deg,rgba(28,10,12,0.97),rgba(22,8,8,0.99))', border: '1px solid rgba(201,168,76,0.12)' }}>

          {/* Header bar */}
          <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid rgba(201,168,76,0.07)' }}>
            <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-base" style={{ background: 'linear-gradient(135deg,#7A1930,#A02040)' }}>✉</div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">Becas PUCE</p>
              <p className="text-[#9A8890] text-xs">Mar 10 Jun 2025 · 09:47</p>
            </div>
            <span className="text-[10px] text-red-400 bg-red-950/40 border border-red-900/40 px-2 py-0.5 rounded-full">No verificado</span>
          </div>

          {/* Meta fields */}
          <div className="px-4 py-3 space-y-1.5" style={{ borderBottom: '1px solid rgba(201,168,76,0.05)' }}>
            <div className="flex gap-2 items-start">
              <span className="text-[#B09098] text-xs font-bold uppercase tracking-wider flex-shrink-0 mt-0.5">De:</span>
              <ZoneSpan id={1} {...zProps}>
                <span className="font-mono text-xs text-[#F0D0D0]">BECASQUITO@puce-becas-quito.com</span>
              </ZoneSpan>
            </div>
            <div className="flex gap-2 items-start">
              <span className="text-[#B09098] text-xs font-bold uppercase tracking-wider flex-shrink-0 mt-0.5">Para:</span>
              <ZoneSpan id={7} {...zProps}>
                <span className="font-mono text-xs text-[#C8A8BC]">pjsanchez@puce.edu.ec</span>
              </ZoneSpan>
            </div>
            <div className="flex gap-2 items-start">
              <span className="text-[#B09098] text-xs font-bold uppercase tracking-wider flex-shrink-0 mt-0.5">Asunto:</span>
              <span className="text-[#ECD8DC] text-xs">RESULTADOS POSTULACION BECA SOLIDARIDAD</span>
            </div>
          </div>

          {/* Body */}
          <div className="px-4 py-4 space-y-3 text-sm leading-relaxed text-[#D8C4CC]">
            <p>
              <ZoneSpan id={2} {...zProps}><span className="font-semibold text-[#D0B0C0]">Estimada/o Estudiante</span></ZoneSpan>,
            </p>
            <p>
              Recibe un cordial saludo. Esperamos que te encuentres muy bien.
              Tras concluir el proceso de cierre y verificación de notas, nos complace informarte que tu solicitud para la Beca Solidaridad ha sido <strong className="text-[#E8D0D8]">aprobada</strong> para el periodo 2026-01. Para nosotros es un honor apoyarte en tu formación universitaria.
            </p>
            <p>
              Una vez completes tu proceso de automatrícula y generes tu prefactura, verás reflejado automáticamente el descuento del 35% correspondiente a tu beca.
            </p>
            <p>
              <ZoneSpan id={3} {...zProps}>
                <span>Sin embargo, para formalizar la aceptación de tu beca, es necesario que realices un pago único de <strong>$24.80</strong> correspondiente al diferencial de IVA administrativo del periodo. Para completar este proceso, accede al siguiente enlace e ingresa tus datos:</span>
              </ZoneSpan>
            </p>
            <p>
              <ZoneSpan id={4} {...zProps}>
                <span className="font-mono text-blue-400 underline">becas-puce.pagos-seguros.net/aceptacion</span>
              </ZoneSpan>
            </p>
            <p>
              <ZoneSpan id={5} {...zProps}>
                <span>Este trámite debe completarse en las próximas 48 horas, de lo contrario, tu beca será reasignada a otro estudiante de la lista de espera.</span>
              </ZoneSpan>
            </p>
            <p>
              <ZoneSpan id={6} {...zProps}>
                <span>En el formulario de pago deberás ingresar tu número de cédula, datos de tu tarjeta bancaria y tu contraseña del portal institucional para verificar tu identidad.</span>
              </ZoneSpan>
            </p>
            <p>
              Mantente muy atento/a a tu correo institucional. Próximamente te enviaremos las instrucciones para el proceso de aceptación del acta de beca, el cual se habilitará de forma digital.
            </p>
            <p>
              Si tienes alguna duda, recuerda que nuestro equipo está listo para ayudarte. Puedes responder a este correo o visitarnos en las oficinas del área de becas. Cuentas con nosotros para seguir adelante con tus estudios.
            </p>
            <p className="text-[#B0A0A8] text-xs pt-1">
              <ZoneSpan id={8} {...zProps}>
                <span>Atentamente, el Equipo de Becas PUCE</span>
              </ZoneSpan>
            </p>
          </div>
        </div>

        {/* Active zone detail */}
        {activeZone && !done && (
          <div key={activeZone.id} className="mt-3 rounded-xl p-4 animate-bounce-in" style={{ background: activeZone.suspicious ? 'rgba(239,68,68,0.08)' : 'rgba(251,146,60,0.08)', border: `1px solid ${activeZone.suspicious ? 'rgba(239,68,68,0.3)' : 'rgba(251,146,60,0.3)'}` }}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${activeZone.suspicious ? 'text-red-300 bg-red-950/60 border border-red-800/50' : 'text-orange-300 bg-orange-950/60 border border-orange-800/50'}`}>
                {activeZone.suspicious ? 'Sospechoso — bien detectado' : 'No es una señal critica aqui'}
              </span>
              <button onClick={() => setActiveZone(null)} className="ml-auto text-[#9A8090] hover:text-[#C9A84C] text-xs">✕</button>
            </div>
            <p className="text-xs font-bold text-[#C9A84C] mb-1">{activeZone.label}</p>
            <p className={`text-xs leading-relaxed ${activeZone.suspicious ? 'text-red-300/80' : 'text-orange-300/80'}`}>{activeZone.reason}</p>
          </div>
        )}

        {/* Progress indicator */}
        {!done && tappedIds.size > 0 && (
          <div className="mt-3 animate-fade-in text-center">
            <p className="text-[#C9A84C] text-xs">{foundCount}/{SUSPICIOUS_ZONES.length} señales de alerta encontradas</p>
          </div>
        )}

        {/* Manual done */}
        {!done && tappedIds.size > 0 && (
          <button onClick={handleDone} className="w-full mt-3 py-3 rounded-xl font-bold text-sm text-[#9A8898] hover:text-[#C9A84C] transition-colors" style={{ border: '1px solid rgba(201,168,76,0.2)', background: 'rgba(40,16,24,0.6)' }}>
            Listo — revisar resultado
          </button>
        )}

        {/* Done result */}
        {done && (
          <div className="mt-3 animate-fade-in-up space-y-2">
            {/* Missed zones */}
            {SUSPICIOUS_ZONES.filter(z => !tappedIds.has(z.id)).length > 0 && (
              <div className="px-4 py-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <p className="text-red-400 text-xs font-bold mb-2">Señales que no detectaste:</p>
                {SUSPICIOUS_ZONES.filter(z => !tappedIds.has(z.id)).map(z => (
                  <div key={z.id} className="flex gap-2 items-start mb-1.5">
                    <span className="text-red-500 text-xs flex-shrink-0 mt-0.5">✗</span>
                    <div>
                      <p className="text-red-300 text-xs font-semibold">{z.label}</p>
                      <p className="text-red-400/60 text-[10px] leading-snug">{z.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="rounded-xl p-4 text-center" style={{ background: foundCount >= SUSPICIOUS_ZONES.length ? 'rgba(74,222,128,0.07)' : 'rgba(201,168,76,0.07)', border: `1px solid ${foundCount >= SUSPICIOUS_ZONES.length ? 'rgba(74,222,128,0.25)' : 'rgba(201,168,76,0.25)'}` }}>
              <p className={`font-bold text-base ${foundCount >= SUSPICIOUS_ZONES.length ? 'text-green-400' : 'text-[#C9A84C]'}`}>
                {foundCount >= SUSPICIOUS_ZONES.length ? 'Perfecto — encontraste todas las señales' : `Detectaste ${foundCount}/${SUSPICIOUS_ZONES.length} señales de alerta`}
              </p>
              {earnedPreview > 0 && <p className="text-[#C9A84C] text-sm mt-1 font-bold">+{earnedPreview} puntos</p>}
            </div>
            <button onClick={handleNext} className="w-full group relative">
              <div className="w-full py-4 rounded-xl font-black tracking-wider text-[#1A0508] uppercase shimmer-btn shadow-2xl text-center transition-transform duration-200 group-hover:scale-[1.02]">Siguiente Seccion</div>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
