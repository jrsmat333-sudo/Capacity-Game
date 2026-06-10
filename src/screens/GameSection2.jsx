import { useState, useEffect } from 'react'
import GameHeader from '../components/GameHeader'

const TOTAL_TIME = 35

const ADDRESSES = [
  {
    id: 1,
    alias: 'anuncios',
    email: 'anuncios@puce.edu.ec',
    isSuspicious: false,
    reason: 'Alias oficial e institucional, reconocido en comunicaciones PUCE.',
  },
  {
    id: 2,
    alias: 'soporte1234',
    email: 'soporte1234@puce.edu.ec',
    isSuspicious: true,
    reason: 'Los numeros aleatorios al final delatan una cuenta automatizada o falsa.',
  },
  {
    id: 3,
    alias: 'incidentesinformacion',
    email: 'incidentesinformacion@puce.edu.ec',
    isSuspicious: false,
    reason: 'Alias largo pero descriptivo, coherente con una unidad institucional real.',
  },
  {
    id: 4,
    alias: 'urgente_matriculas',
    email: 'urgente_matriculas@puce.edu.ec',
    isSuspicious: true,
    reason:
      'El prefijo "urgente" y el guion bajo generan alarma artificial. Tactica clasica de ingenieria social.',
  },
]

export default function GameSection2({ score, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME)
  const [selected, setSelected] = useState(new Set())
  const [confirmed, setConfirmed] = useState(false)
  const [timedOut, setTimedOut] = useState(false)
  const [confirmedTimeLeft, setConfirmedTimeLeft] = useState(TOTAL_TIME)

  useEffect(() => {
    if (confirmed) return
    if (timeLeft <= 0) {
      setTimedOut(true)
      setConfirmed(true)
      return
    }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000)
    return () => clearInterval(t)
  }, [timeLeft, confirmed])

  const toggleSelect = (id) => {
    if (confirmed) return
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleConfirm = () => {
    if (confirmed) return
    setConfirmedTimeLeft(timeLeft)
    setConfirmed(true)
  }

  const computeEarned = () => {
    let correct = 0
    ADDRESSES.forEach(a => {
      if (a.isSuspicious && selected.has(a.id)) correct++
      if (!a.isSuspicious && !selected.has(a.id)) correct++
    })
    const base = correct * 25
    const allCorrect = correct === ADDRESSES.length
    const speed = allCorrect && confirmedTimeLeft > TOTAL_TIME / 2 ? 50 : 0
    return { base, speed, total: base + speed, correct }
  }

  const handleNext = () => {
    onComplete(computeEarned().total)
  }

  const { correct: correctCount, total: earnedPreview } = confirmed
    ? computeEarned()
    : { correct: 0, total: 0 }

  const getItemStyle = (addr) => {
    const isSel = selected.has(addr.id)
    if (!confirmed) {
      if (isSel) return {
        border: '1.5px solid #C9A84C',
        background: 'rgba(201,168,76,0.1)',
        boxShadow: '0 0 14px rgba(201,168,76,0.18)',
      }
      return {
        border: '1px solid rgba(201,168,76,0.1)',
        background: 'rgba(22,8,14,0.9)',
      }
    }
    if (addr.isSuspicious) return {
      border: '1.5px solid #EF4444',
      background: 'rgba(239,68,68,0.07)',
      boxShadow: '0 0 18px rgba(239,68,68,0.18)',
    }
    return {
      border: '1.5px solid #4ADE80',
      background: 'rgba(74,222,128,0.05)',
      boxShadow: '0 0 18px rgba(74,222,128,0.12)',
    }
  }

  const selectionLabel = (addr) => {
    if (!confirmed) return null
    if (addr.isSuspicious && selected.has(addr.id))
      return <span className="text-green-400 text-[10px] font-bold">Bien detectado</span>
    if (addr.isSuspicious && !selected.has(addr.id))
      return <span className="text-orange-400 text-[10px] font-bold">No lo detectaste</span>
    if (!addr.isSuspicious && selected.has(addr.id))
      return <span className="text-orange-400 text-[10px] font-bold">Falsa alarma</span>
    return <span className="text-green-400 text-[10px] font-bold">Correcto</span>
  }

  return (
    <div className="min-h-screen bg-[#0C0814] flex flex-col relative overflow-hidden">

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-80 h-80 bg-[#3A1A7A] opacity-15 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />
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
        section={2}
        timeLeft={timeLeft}
        totalTime={TOTAL_TIME}
        instruction="Selecciona todas las direcciones con un alias sospechoso"
        score={score}
      />

      {/* Context note */}
      <div className="px-4 pt-1 pb-3 max-w-xl mx-auto w-full">
        <p className="text-[#A08898] text-xs text-center leading-relaxed">
          Todas usan el dominio{' '}
          <span className="text-[#C8A8B8] font-mono font-semibold">@puce.edu.ec</span>
          {' '}— analiza el alias (parte antes del @)
        </p>
      </div>

      {/* Address list */}
      <div className="flex-1 flex flex-col gap-3 px-4 pb-4 max-w-xl mx-auto w-full">
        {ADDRESSES.map((addr, i) => (
          <div
            key={addr.id}
            onClick={() => toggleSelect(addr.id)}
            className={`rounded-xl overflow-hidden cursor-pointer transition-all duration-300 animate-fade-in-up ${!confirmed ? 'hover:brightness-110 active:scale-[0.98]' : ''}`}
            style={{ ...getItemStyle(addr), animationDelay: `${i * 90}ms` }}
          >
            {/* Main row */}
            <div className="flex items-center gap-3 px-4 py-4">

              {/* Checkbox */}
              <div
                className="w-5 h-5 rounded flex-shrink-0 flex items-center justify-center transition-all duration-200 border-2"
                style={{
                  borderColor: selected.has(addr.id) ? '#C9A84C' : 'rgba(90,48,64,0.6)',
                  background: selected.has(addr.id) ? '#C9A84C' : 'transparent',
                }}
              >
                {selected.has(addr.id) && (
                  <span className="text-[#1A0508] text-xs font-black leading-none">✓</span>
                )}
              </div>

              {/* Email address display */}
              <div className="flex-1 min-w-0">
                <div className="font-mono text-sm break-all leading-snug">
                  <span
                    className="font-bold transition-colors duration-300"
                    style={{
                      color: confirmed
                        ? addr.isSuspicious ? '#F87171' : '#4ADE80'
                        : selected.has(addr.id) ? '#C9A84C' : '#D0A0B0',
                    }}
                  >
                    {addr.alias}
                  </span>
                  <span className="text-[#9A8090]">@</span>
                  <span className="text-[#B8A0AC]">puce.edu.ec</span>
                </div>
              </div>

              {/* Status badge after confirm */}
              {confirmed && (
                <span
                  className={`flex-shrink-0 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    addr.isSuspicious
                      ? 'text-red-300 bg-red-950/60 border border-red-800/40'
                      : 'text-green-300 bg-green-950/60 border border-green-800/40'
                  }`}
                >
                  {addr.isSuspicious ? 'Sospechoso' : 'Legitimo'}
                </span>
              )}
            </div>

            {/* Feedback row */}
            {confirmed && (
              <div
                className="px-4 pb-3 -mt-1 animate-fade-in-up"
                style={{ borderTop: '1px solid rgba(201,168,76,0.07)' }}
              >
                <div className="flex items-center gap-2 mb-1">
                  {selectionLabel(addr)}
                </div>
                <p
                  className={`text-xs leading-relaxed ${
                    addr.isSuspicious ? 'text-red-300/70' : 'text-green-300/70'
                  }`}
                >
                  {addr.reason}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Confirm / Result + Next */}
      <div className="px-4 pb-6 max-w-xl mx-auto w-full">
        {!confirmed ? (
          <button
            onClick={handleConfirm}
            disabled={selected.size === 0}
            className="w-full group relative animate-fade-in-up"
          >
            <div
              className="w-full py-4 rounded-xl font-black tracking-wider uppercase shadow-xl text-center transition-all duration-300 group-hover:scale-[1.02] group-active:scale-[0.98]"
              style={{
                background:
                  selected.size > 0
                    ? 'linear-gradient(90deg, #C9A84C 0%, #F0D080 50%, #A07830 100%)'
                    : 'rgba(40,16,24,0.7)',
                border:
                  selected.size > 0 ? 'none' : '1px solid rgba(201,168,76,0.15)',
                color: selected.size > 0 ? '#1A0508' : '#7A6070',
              }}
            >
              Confirmar seleccion
              {selected.size > 0 && (
                <span className="ml-2 text-xs font-normal opacity-70">
                  ({selected.size} seleccionada{selected.size !== 1 ? 's' : ''})
                </span>
              )}
            </div>
          </button>
        ) : (
          <div className="animate-fade-in-up">
            <div
              className="rounded-xl p-4 mb-4 text-center"
              style={{
                background:
                  correctCount === ADDRESSES.length
                    ? 'rgba(74,222,128,0.07)'
                    : 'rgba(201,168,76,0.07)',
                border: `1px solid ${
                  correctCount === ADDRESSES.length
                    ? 'rgba(74,222,128,0.25)'
                    : 'rgba(201,168,76,0.25)'
                }`,
              }}
            >
              <p
                className={`font-bold text-base ${
                  correctCount === ADDRESSES.length ? 'text-green-400' : 'text-[#C9A84C]'
                }`}
              >
                {timedOut
                  ? 'Tiempo agotado'
                  : correctCount === ADDRESSES.length
                  ? 'Perfecto — detectaste todo'
                  : `${correctCount}/${ADDRESSES.length} correctas`}
              </p>
              {earnedPreview > 0 && (
                <p className="text-[#C9A84C] text-sm mt-1 font-bold">
                  +{earnedPreview} puntos
                  {earnedPreview > correctCount * 25 && (
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
    </div>
  )
}
