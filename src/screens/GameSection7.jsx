import { useState, useEffect } from 'react'
import GameHeader from '../components/GameHeader'

const TOTAL_TIME = 60
const BASE_MAX = 150

const ZONES = [
  { id: 1, suspicious: true,  label: 'Logo falso',                    reason: 'El logo en la cabecera no es el oficial de la PUCE. Los documentos institucionales siempre usan el logo y colores oficiales verificados.' },
  { id: 3, suspicious: true,  label: 'Urgencia artificial',           reason: '"Solo 24 horas" es una táctica de presión para que actúes sin verificar. Los procesos de selección oficiales publican plazos de días o semanas, no horas.' },
  { id: 4, suspicious: true,  label: 'Solicitud de datos sensibles',  reason: 'Ningún proceso de contratación legítimo solicita número de cuenta bancaria ni contraseñas antes de ser contratado. Esta es una señal de estafa grave.' },
  { id: 5, suspicious: true,  label: 'Correo con dominio falso',      reason: '"puce-empleos.net" no es un dominio oficial de la PUCE. El dominio institucional es @puce.edu.ec. Nunca envíes datos personales a esta dirección.' },
  { id: 6, suspicious: true,  label: 'Enlace malicioso',              reason: '"puce-talento.postulaciones-online.net" no pertenece a la PUCE. Es un dominio fraudulento diseñado para robar tus datos personales y bancarios.' },
  { id: 7, suspicious: false, label: 'Descripción de vacantes',       reason: 'Anunciar las posiciones disponibles y sus requisitos generales es parte normal de una convocatoria. Por sí solo no constituye una señal de alerta.' },
  { id: 8, suspicious: false, label: 'Cargo de la firmante',          reason: 'El cargo de Directora de Talento Humano existe en la institución. Un cargo real no valida el documento si el resto contiene señales de alerta.' },
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

export default function GameSection7({ score, onComplete }) {
  const [phase, setPhase] = useState('notification')
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME)
  const [tappedIds, setTappedIds] = useState(new Set())
  const [foundCount, setFoundCount] = useState(0)
  const [activeZone, setActiveZone] = useState(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (phase !== 'reading') return
    if (done) return
    if (timeLeft <= 0) { setDone(true); return }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000)
    return () => clearInterval(t)
  }, [timeLeft, done, phase])

  const handleOpen = () => setPhase('reading')

  const handleTap = (zone) => {
    if (done || tappedIds.has(zone.id)) return
    setTappedIds(prev => new Set([...prev, zone.id]))
    if (zone.suspicious) setFoundCount(p => p + 1)
    setActiveZone(zone)
  }

  const handleDone = () => setDone(true)

  const handleNext = () => {
    const base = Math.round((foundCount / SUSPICIOUS_ZONES.length) * BASE_MAX)
    const allFound = foundCount >= SUSPICIOUS_ZONES.length
    const speed = allFound && timeLeft > TOTAL_TIME / 2 ? 50 : 0
    onComplete(base + speed)
  }

  const earnedPreview = Math.round((foundCount / SUSPICIOUS_ZONES.length) * BASE_MAX)
    + (foundCount >= SUSPICIOUS_ZONES.length && timeLeft > TOTAL_TIME / 2 ? 50 : 0)

  const zProps = { zones: ZONES, tappedIds, onTap: handleTap, done }

  // ── Notification entry screen ─────────────────────────────────
  if (phase === 'notification') {
    return (
      <div className="min-h-screen bg-[#0A0C14] flex flex-col items-center justify-center px-6 relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#1A2A6A] opacity-15 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#C9A84C 1px,transparent 1px),linear-gradient(90deg,#C9A84C 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        <div
          className="w-full max-w-sm rounded-2xl p-6 animate-bounce-in text-center"
          style={{
            background: 'linear-gradient(160deg,rgba(16,18,32,0.97),rgba(12,14,26,0.99))',
            border: '1px solid rgba(201,168,76,0.2)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
          }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
            style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)' }}
          >
            📄
          </div>

          <p className="text-[#9A8898] text-xs font-semibold uppercase tracking-widest mb-1">
            Nuevo mensaje recibido
          </p>
          <p className="text-white font-black text-xl mb-1" style={{ letterSpacing: '0.05em' }}>
            OFICIO-PUCE
          </p>
          <p className="text-[#C9A84C] font-mono text-xs mb-1">
            PUCE-RECT/2025/04.7-ADM
          </p>
          <p className="text-[#7A8090] text-xs mb-1">
            Quito, D.M., 15 de junio del 2025
          </p>
          <p className="text-[#C9A84C] text-xs font-semibold mb-5">
            Convocatoria — Nuevas Vacantes Institucionales
          </p>

          <div className="h-px bg-gradient-to-r from-transparent via-[rgba(201,168,76,0.2)] to-transparent mb-5" />

          <p className="text-[#C8A8B8] text-xs leading-relaxed mb-5">
            Abre el documento y toca todo lo que te parezca sospechoso.
            ¿Puedes encontrar las{' '}
            <span className="text-[#C9A84C] font-bold">5 señales de alerta</span>?
          </p>

          <button onClick={handleOpen} className="w-full group relative">
            <div className="w-full py-3.5 rounded-xl font-black tracking-wider text-[#1A0508] uppercase shimmer-btn shadow-xl text-center transition-transform duration-200 group-hover:scale-[1.02] group-active:scale-[0.98]">
              Abrir documento
            </div>
          </button>
        </div>
      </div>
    )
  }

  // ── Reading / result screen ───────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0A0C14] flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-80 h-80 bg-[#1A2A6A] opacity-15 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#C9A84C 1px,transparent 1px),linear-gradient(90deg,#C9A84C 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <GameHeader
        section={7}
        timeLeft={timeLeft}
        totalTime={TOTAL_TIME}
        instruction="Toca todo lo que te parezca sospechoso en este oficio"
        score={score}
      />

      <div className="px-3 pt-1 pb-2 max-w-xl mx-auto w-full">
        <p className="text-[#A08898] text-xs text-center">
          Las zonas interactivas tienen subrayado punteado — tócalas para evaluarlas
        </p>
      </div>

      <div className="flex-1 px-4 pb-4 max-w-xl mx-auto w-full overflow-y-auto">

        {/* Oficio document card */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(160deg,rgba(22,24,38,0.97),rgba(16,18,30,0.99))',
            border: '1px solid rgba(201,168,76,0.12)',
          }}
        >
          {/* Card top bar */}
          <div
            className="flex items-center gap-3 px-4 py-3"
            style={{ borderBottom: '1px solid rgba(201,168,76,0.07)' }}
          >
            <div
              className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-base"
              style={{ background: 'linear-gradient(135deg,#1A2A6A,#2A3A8A)' }}
            >
              📄
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">Oficio Institucional — PUCE</p>
              <p className="text-[#9A8890] text-xs">Quito, D.M., 10 de junio del 2025</p>
            </div>
            <span className="text-[10px] text-red-400 bg-red-950/40 border border-red-900/40 px-2 py-0.5 rounded-full">
              No verificado
            </span>
          </div>

          {/* Document body */}
          <div className="px-4 py-4 space-y-3 text-sm leading-relaxed text-[#D8C8D4]">

            {/* Logo zone (special block-level handling) */}
            <div
              className="flex justify-center py-3"
              style={{ borderBottom: '1px solid rgba(201,168,76,0.07)' }}
            >
              <span
                onClick={() => !done && !tappedIds.has(1) && handleTap(ZONES.find(z => z.id === 1))}
                className="rounded-lg p-1 transition-all duration-300 inline-block"
                style={{
                  outline: done && !tappedIds.has(1)
                    ? '1.5px solid rgba(239,68,68,0.5)'
                    : !tappedIds.has(1) && !done
                    ? '1px dashed rgba(201,168,76,0.5)'
                    : tappedIds.has(1)
                    ? '1px solid rgba(74,222,128,0.35)'
                    : 'none',
                  background: done && !tappedIds.has(1)
                    ? 'rgba(239,68,68,0.15)'
                    : tappedIds.has(1)
                    ? 'rgba(74,222,128,0.12)'
                    : 'transparent',
                  cursor: !done && !tappedIds.has(1) ? 'pointer' : 'default',
                }}
              >
                <img
                  src="./img/nuevo-modulo.png"
                  alt="Logo"
                  className="h-16 object-contain"
                />
              </span>
            </div>

            {/* Institution heading */}
            <div
              className="text-center py-1"
              style={{ borderBottom: '1px solid rgba(201,168,76,0.05)' }}
            >
              <p className="text-white font-bold text-sm">
                PONTIFICIA UNIVERSIDAD CATÓLICA DEL ECUADOR
              </p>
              <p className="text-[#C9A84C] text-xs font-semibold tracking-wider">
                DIRECCIÓN DE TALENTO HUMANO
              </p>
            </div>

            {/* Oficio number */}
            <p className="text-[#D8C8D4] text-xs font-mono">
              Oficio No. PUCE-RECT/2025/04.7-ADM
            </p>

            <p className="text-[#B0A8C0] text-xs">Quito, D.M., 15 de junio del 2025</p>

            <p className="text-white font-bold text-xs tracking-wider uppercase pt-1">
              Convocatoria — Nuevas Vacantes Institucionales
            </p>

            {/* Vacancies description zone (not suspicious) */}
            <p>
              <ZoneSpan id={7} {...zProps}>
                <span>
                  La Dirección de Talento Humano de la Pontificia Universidad Católica del
                  Ecuador informa la apertura de un proceso de
                  selección de personal para cubrir las siguientes vacantes:{' '}
                  <span className="text-[#C9A84C]">
                    Asistente Administrativo (2 puestos), Técnico en Soporte Informático
                    (1 puesto) y Coordinador de Proyectos Académicos (1 puesto).
                  </span>
                </span>
              </ZoneSpan>
            </p>

            <p>
              Los interesados deberán contar con título de tercer nivel afín al área,
              experiencia mínima de un año en funciones similares y disponibilidad a
              tiempo completo.
            </p>

            {/* Urgency zone */}
            <p>
              <ZoneSpan id={3} {...zProps}>
                <span>
                  Las postulaciones serán recibidas{' '}
                  <strong className="text-[#E0C0D0]">únicamente durante las próximas 24 horas</strong>.
                  Los candidatos que no completen su registro dentro de este plazo quedarán
                  automáticamente descalificados del proceso de selección.
                </span>
              </ZoneSpan>
            </p>

            {/* Sensitive data request zone */}
            <p>
              Para inscribirse,{' '}
              <ZoneSpan id={4} {...zProps}>
                <span>
                  el postulante deberá enviar su hoja de vida, número de cuenta bancaria
                  para el pago de haberes y{' '}
                  <strong className="text-[#E0C0D0]">contraseña temporal del portal de postulaciones</strong>
                </span>
              </ZoneSpan>
              {' '}al siguiente correo:{' '}
              {/* Fake email zone */}
              <ZoneSpan id={5} {...zProps}>
                <span className="font-mono text-blue-400 underline">
                  vacantes@puce-empleos.net
                </span>
              </ZoneSpan>
            </p>

            {/* Malicious link zone */}
            <p>
              o registrarse directamente en la plataforma:{' '}
              <ZoneSpan id={6} {...zProps}>
                <span className="font-mono text-blue-400 underline">
                  puce-talento.postulaciones-online.net/registro
                </span>
              </ZoneSpan>
            </p>

            <p className="text-[#B0A8C0] text-xs italic">
              La PUCE se reserva el derecho de declarar desierto el proceso si ningún
              candidato cumple con el perfil requerido.
            </p>

            {/* Signature zone (not suspicious) */}
            <div className="pt-2" style={{ borderTop: '1px solid rgba(201,168,76,0.05)' }}>
              <p className="text-[#B0A0A8] text-xs mb-2">Atentamente,</p>
              <ZoneSpan id={8} {...zProps}>
                <span className="text-[#C8B8C4] text-xs">
                  Lcda. Patricia Morales Vega<br />
                  Directora de Talento Humano<br />
                  Pontificia Universidad Católica del Ecuador
                </span>
              </ZoneSpan>
            </div>
          </div>
        </div>

        {/* Active zone detail */}
        {activeZone && !done && (
          <div
            key={activeZone.id}
            className="mt-3 rounded-xl p-4 animate-bounce-in"
            style={{
              background: activeZone.suspicious ? 'rgba(239,68,68,0.08)' : 'rgba(251,146,60,0.08)',
              border: `1px solid ${activeZone.suspicious ? 'rgba(239,68,68,0.3)' : 'rgba(251,146,60,0.3)'}`,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  activeZone.suspicious
                    ? 'text-red-300 bg-red-950/60 border border-red-800/50'
                    : 'text-orange-300 bg-orange-950/60 border border-orange-800/50'
                }`}
              >
                {activeZone.suspicious ? 'Sospechoso — bien detectado' : 'No es una señal crítica aquí'}
              </span>
              <button
                onClick={() => setActiveZone(null)}
                className="ml-auto text-[#9A8090] hover:text-[#C9A84C] text-xs"
              >
                ✕
              </button>
            </div>
            <p className="text-xs font-bold text-[#C9A84C] mb-1">{activeZone.label}</p>
            <p
              className={`text-xs leading-relaxed ${
                activeZone.suspicious ? 'text-red-300/80' : 'text-orange-300/80'
              }`}
            >
              {activeZone.reason}
            </p>
          </div>
        )}

        {/* Progress indicator */}
        {!done && tappedIds.size > 0 && (
          <div className="mt-3 animate-fade-in text-center">
            <p className="text-[#C9A84C] text-xs">
              {foundCount}/{SUSPICIOUS_ZONES.length} señales de alerta encontradas
            </p>
          </div>
        )}

        {/* Manual done button */}
        {!done && tappedIds.size > 0 && (
          <button
            onClick={handleDone}
            className="w-full mt-3 py-3 rounded-xl font-bold text-sm text-[#9A8898] hover:text-[#C9A84C] transition-colors"
            style={{ border: '1px solid rgba(201,168,76,0.2)', background: 'rgba(40,16,24,0.6)' }}
          >
            Listo — revisar resultado
          </button>
        )}

        {/* Done result */}
        {done && (
          <div className="mt-3 animate-fade-in-up space-y-2">
            {SUSPICIOUS_ZONES.filter(z => !tappedIds.has(z.id)).length > 0 && (
              <div
                className="px-4 py-3 rounded-xl"
                style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)' }}
              >
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

            <div
              className="rounded-xl p-4 text-center"
              style={{
                background: foundCount >= SUSPICIOUS_ZONES.length ? 'rgba(74,222,128,0.07)' : 'rgba(201,168,76,0.07)',
                border: `1px solid ${foundCount >= SUSPICIOUS_ZONES.length ? 'rgba(74,222,128,0.25)' : 'rgba(201,168,76,0.25)'}`,
              }}
            >
              <p
                className={`font-bold text-base ${
                  foundCount >= SUSPICIOUS_ZONES.length ? 'text-green-400' : 'text-[#C9A84C]'
                }`}
              >
                {foundCount >= SUSPICIOUS_ZONES.length
                  ? 'Perfecto — encontraste todas las señales'
                  : `Detectaste ${foundCount}/${SUSPICIOUS_ZONES.length} señales de alerta`}
              </p>
              {earnedPreview > 0 && (
                <p className="text-[#C9A84C] text-sm mt-1 font-bold">+{earnedPreview} puntos</p>
              )}
            </div>

            <button onClick={handleNext} className="w-full group relative">
              <div className="w-full py-4 rounded-xl font-black tracking-wider text-[#1A0508] uppercase shimmer-btn shadow-2xl text-center transition-transform duration-200 group-hover:scale-[1.02]">
                Ver mis resultados
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
