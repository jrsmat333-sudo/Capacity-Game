const SECTION_DATA = [
  { section: 1, name: '¿Quién te escribe?',       icon: '✉',  max: 100, tip: 'Examina siempre el dominio del remitente, no solo el nombre visible.' },
  { section: 2, name: 'El alias sospechoso',       icon: '🔗', max: 100, tip: 'Los alias sospechosos usan urgencia, números aleatorios o guiones bajos.' },
  { section: 3, name: 'El enlace trampa',           icon: '💬', max: 100, tip: 'Nunca hagas clic en URLs acortadas o con dominios no reconocidos.' },
  { section: 4, name: 'El correo trampa completo', icon: '🌐', max: 150, tip: 'Desconfía de correos con urgencia, saludos genéricos o solicitud de datos.' },
  { section: 5, name: 'El mensaje sospechoso',     icon: '📞', max: 100, tip: 'Los SMS legítimos no piden hacer clic en links para ingresar credenciales.' },
  { section: 6, name: 'La llamada inesperada',     icon: '📱', max: 150, tip: 'Ninguna entidad legítima pedirá tu contraseña por teléfono. Siempre cuelga y verifica.' },
  { section: 7, name: 'El oficio falso',           icon: '📄', max: 150, tip: 'Los oficios institucionales nunca piden contraseñas ni datos bancarios. Verifica siempre el dominio y el logo oficial.' },
]

const TOTAL_BASE_MAX = 850

const LEVELS = [
  { min: 0,   max: 40,  label: 'Aún en entrenamiento',           desc: 'Repasa el material antes de seguir — los atacantes cuentan con esto.',       color: '#EF4444' },
  { min: 41,  max: 70,  label: 'Vas por buen camino',            desc: 'Refuerza los temas donde fallaste y vuelve a intentarlo.',                    color: '#F59E0B' },
  { min: 71,  max: 90,  label: 'Buen detector',                   desc: 'Estás casi listo para proteger a tu entorno digital.',                        color: '#4ADE80' },
  { min: 91,  max: 100, label: 'Guardián de la Información nivel experto', desc: 'Eres la primera línea de defensa de la PUCE.',                       color: '#C9A84C' },
]

function getLevel(pct) {
  return LEVELS.find(l => pct >= l.min && pct <= l.max) ?? LEVELS[0]
}

export default function ResultsScreen({ score, sectionResults, onRestart, onHome }) {
  const baseScore = sectionResults.reduce((acc, r) => acc + Math.min(r.earned, r.max), 0)
  const pct = Math.min(Math.round((baseScore / TOTAL_BASE_MAX) * 100), 100)
  const level = getLevel(pct)
  const speedBonus = score - baseScore

  // Merge sectionData with earned results
  const sections = SECTION_DATA.map(sd => {
    const result = sectionResults.find(r => r.section === sd.section)
    return { ...sd, earned: result?.earned ?? 0, played: !!result }
  })

  const failedSections = sections.filter(s => s.played && s.earned < s.max * 0.5)

  return (
    <div className="min-h-screen bg-[#0C0A14] flex flex-col relative overflow-hidden pb-8">

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #7A1930 0%, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'linear-gradient(#C9A84C 1px,transparent 1px),linear-gradient(90deg,#C9A84C 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      {/* Header */}
      <div className="flex flex-col items-center pt-8 pb-4 px-6 z-10 animate-fade-in">
        <img src="/img/logo-puce.png" alt="PUCE" className="h-10 object-contain opacity-70 mb-6" />

        <p className="text-[#C9A84C] text-xs font-semibold tracking-[0.35em] uppercase mb-2">Resultados finales</p>

        {/* Score */}
        <div className="text-center mb-4 animate-bounce-in">
          <div
            className="text-6xl font-black leading-none"
            style={{ background: 'linear-gradient(135deg,#C9A84C,#F0D080)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            {score}
          </div>
          <p className="text-[#9A8898] text-sm mt-1">
            puntos de {TOTAL_BASE_MAX} posibles
            {speedBonus > 0 && <span className="text-[#C9A84C] ml-1">(+{speedBonus} bono velocidad)</span>}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-xs h-2 bg-[#2A1018] rounded-full overflow-hidden mb-4">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${pct}%`, background: `linear-gradient(to right, #7A1930, ${level.color})` }}
          />
        </div>

        {/* Level badge */}
        <div
          className="w-full max-w-sm px-5 py-4 rounded-xl text-center mb-2 animate-scale-in"
          style={{ background: `${level.color}12`, border: `1px solid ${level.color}40` }}
        >
          <p className="font-black text-lg" style={{ color: level.color }}>{level.label}</p>
          <p className="text-[#C8B0BC] text-xs mt-1 leading-relaxed">{level.desc}</p>
          <p className="font-bold text-sm mt-1.5" style={{ color: level.color }}>{pct}% de efectividad</p>
        </div>
      </div>

      {/* Section breakdown */}
      <div className="px-4 mb-6 max-w-lg mx-auto w-full z-10 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <p className="text-[#C9A84C] text-xs font-semibold tracking-[0.2em] uppercase mb-3 text-center">Resumen por sección</p>
        <div className="space-y-2">
          {sections.map((s, i) => {
            const sectionPct = s.played ? Math.min(Math.round((s.earned / s.max) * 100), 100) : null
            const passed = s.played && s.earned >= s.max * 0.5
            const color = !s.played ? '#3A2030' : passed ? '#4ADE80' : '#EF4444'

            return (
              <div
                key={s.section}
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 animate-fade-in-up"
                style={{
                  background: s.played ? (passed ? 'rgba(74,222,128,0.05)' : 'rgba(239,68,68,0.05)') : 'rgba(40,16,24,0.4)',
                  border: `1px solid ${s.played ? (passed ? 'rgba(74,222,128,0.15)' : 'rgba(239,68,68,0.15)') : 'rgba(40,16,24,0.6)'}`,
                  animationDelay: `${300 + i * 60}ms`,
                }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0" style={{ background: 'rgba(122,25,48,0.3)' }}>
                  {s.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-semibold leading-tight">{s.name}</p>
                  <p className="text-[#9A8090] text-[10px] mt-0.5">Sec. {s.section}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  {s.played ? (
                    <>
                      <p className="font-black text-sm" style={{ color }}>{s.earned}</p>
                      <p className="text-[#7A7088] text-[10px]">/ {s.max}</p>
                    </>
                  ) : (
                    <p className="text-[#7A7088] text-xs">—</p>
                  )}
                </div>
                <div className="flex-shrink-0 ml-1">
                  {s.played ? (
                    <span className="text-base" style={{ color }}>{passed ? '✓' : '✗'}</span>
                  ) : (
                    <span className="text-[#7A7088] text-sm">○</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Tips for failed sections */}
      {failedSections.length > 0 && (
        <div className="px-4 mb-6 max-w-lg mx-auto w-full z-10 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
          <p className="text-[#C9A84C] text-xs font-semibold tracking-[0.2em] uppercase mb-3 text-center">Qué reforzar</p>
          <div className="space-y-2">
            {failedSections.map(s => (
              <div key={s.section} className="flex gap-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
                <span className="text-red-500 text-xs flex-shrink-0 mt-0.5">→</span>
                <div>
                  <p className="text-red-300 text-xs font-bold">{s.name}</p>
                  <p className="text-[#C8A8B4] text-xs mt-0.5 leading-relaxed">{s.tip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact reminder */}
      <div className="px-4 mb-6 max-w-lg mx-auto w-full z-10 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
        <div className="px-4 py-3 rounded-xl text-center" style={{ background: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,168,76,0.2)' }}>
          <p className="text-[#C9A84C] text-xs font-bold uppercase tracking-wider mb-1">Reporta incidentes</p>
          <p className="text-[#C8B0BC] text-xs mb-1">Si sospechas de un ataque real, contáctanos en:</p>
          <p className="font-mono text-sm font-bold" style={{ color: '#C9A84C' }}>incidentesinformacion@puce.edu.ec</p>
        </div>
      </div>

      {/* Mascot */}
      <div className="flex justify-center mb-6 z-10">
        <div className="animate-float-slow">
          <img src="/img/mascota-puce.png" alt="FALCON" className="h-28 object-contain" style={{ filter: 'drop-shadow(0 6px 16px rgba(122,25,48,0.4))' }} />
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-4 space-y-3 max-w-lg mx-auto w-full z-10 animate-fade-in-up" style={{ animationDelay: '700ms' }}>
        <button onClick={onRestart} className="w-full group relative">
          <div className="w-full py-4 rounded-xl font-black tracking-wider text-[#1A0508] uppercase shimmer-btn shadow-2xl text-center transition-transform duration-200 group-hover:scale-[1.02] group-active:scale-[0.98]">
            Repetir el juego
          </div>
        </button>
        <button onClick={onHome} className="w-full group">
          <div
            className="w-full py-3.5 rounded-xl font-black tracking-wider uppercase text-center transition-all duration-200 group-hover:brightness-125 group-active:scale-[0.98]"
            style={{ background: 'rgba(122,25,48,0.2)', border: '1px solid rgba(201,168,76,0.2)', color: '#C9A84C' }}
          >
            Volver al inicio
          </div>
        </button>
      </div>
    </div>
  )
}
