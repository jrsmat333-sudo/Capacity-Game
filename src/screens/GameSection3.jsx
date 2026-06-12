import { useState, useEffect } from 'react'
import GameHeader from '../components/GameHeader'

const TOTAL_TIME = 40

const EMAIL_META = {
  from: 'Dirección de Informática',
  fromEmail: 'soporte@puce.edu.ec',
  subject: 'Portal académico actualizado — información importante',
  date: 'Mar 10 Jun 2025 · 14:22',
}

const LINKS = [
  {
    id: 1,
    text: 'portal.puce.edu.ec',
    suspicious: false,
    label: 'URL Segura',
    reason: 'Dominio oficial del portal estudiantil PUCE. No hay nada sospechoso.',
  },
  {
    id: 2,
    text: 'puce-portal.informacion-edu.com/formulario',
    suspicious: true,
    label: 'URL Sospechosa',
    reason: 'El dominio real es "informacion-edu.com", no un sitio oficial de la PUCE. El atacante usa "puce-portal" como prefijo para confundirte.',
  },
  {
    id: 3,
    text: 'www.puce.edu.ec/admisiones',
    suspicious: false,
    label: 'URL Segura',
    reason: 'URL oficial del sitio de admisiones PUCE con dominio verificable.',
  },
  {
    id: 4,
    text: 'puce.edu.ec.login-now.com/verify',
    suspicious: true,
    label: 'URL Sospechosa',
    reason: 'El dominio real es "login-now.com". La PUCE figura como subdominio para confundirte. Nunca ingreses datos en esta URL.',
  },
]

const SUSPICIOUS = LINKS.filter(l => l.suspicious)

function LinkEl({ link, onClick, colorStyle, done }) {
  return (
    <span
      onClick={() => !done && onClick(link)}
      className="font-mono text-sm transition-all duration-300 rounded px-0.5"
      style={{
        color: colorStyle.color,
        background: colorStyle.bg,
        textDecoration: 'underline',
        textDecorationStyle: colorStyle.dashed ? 'dashed' : 'solid',
        cursor: !done ? 'pointer' : 'default',
      }}
    >
      {link.text}
    </span>
  )
}

function getLinkStyle(link, clickedIds, done) {
  const isClicked = clickedIds.has(link.id)
  if (done || isClicked) {
    if (link.suspicious) return { color: '#FCA5A5', bg: 'rgba(239,68,68,0.15)', dashed: false }
    return { color: '#86EFAC', bg: 'rgba(74,222,128,0.1)', dashed: false }
  }
  return { color: '#60A5FA', bg: 'transparent', dashed: true }
}

export default function GameSection3({ score, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME)
  const [clickedIds, setClickedIds] = useState(new Set())
  const [foundIds, setFoundIds] = useState(new Set())
  const [activeLink, setActiveLink] = useState(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (done) return
    if (timeLeft <= 0) { setDone(true); setActiveLink(null); return }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000)
    return () => clearInterval(t)
  }, [timeLeft, done])

  useEffect(() => {
    if (!done && foundIds.size >= SUSPICIOUS.length) {
      setDone(true)
      setActiveLink(null)
    }
  }, [foundIds, done])

  const handleLinkClick = (link) => {
    if (done || clickedIds.has(link.id)) return
    setClickedIds(prev => new Set([...prev, link.id]))
    if (link.suspicious) setFoundIds(prev => new Set([...prev, link.id]))
    setActiveLink(link)
  }

  const handleDone = () => { setDone(true); setActiveLink(null) }

  const handleNext = () => {
    const base = foundIds.size * 50
    const allFound = foundIds.size >= SUSPICIOUS.length
    const speed = allFound && timeLeft > TOTAL_TIME / 2 ? 50 : 0
    onComplete(base + speed)
  }

  const earnedPreview = foundIds.size * 50 + (foundIds.size >= SUSPICIOUS.length && timeLeft > TOTAL_TIME / 2 ? 50 : 0)

  return (
    <div className="min-h-screen bg-[#080E0A] flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#1A6A30] opacity-15 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#C9A84C 1px,transparent 1px),linear-gradient(90deg,#C9A84C 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <GameHeader section={3} timeLeft={timeLeft} totalTime={TOTAL_TIME} instruction="Encuentra el enlace peligroso dentro de este correo" score={score} />

      <div className="px-4 pt-1 pb-2 max-w-xl mx-auto w-full">
        <p className="text-[#A08898] text-xs text-center">Toca cada enlace azul para ver a dónde lleva realmente</p>
      </div>

      <div className="flex-1 px-4 pb-4 max-w-xl mx-auto w-full overflow-y-auto">
        {/* Email card */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(160deg,rgba(16,22,18,0.97),rgba(12,18,14,0.99))', border: '1px solid rgba(201,168,76,0.12)' }}>
          <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid rgba(201,168,76,0.07)' }}>
            <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-base" style={{ background: 'linear-gradient(135deg,#7A1930,#A02040)' }}>✉</div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{EMAIL_META.from}</p>
              <p className="text-[#9A8890] text-xs">{EMAIL_META.date}</p>
            </div>
          </div>
          <div className="px-4 py-2.5" style={{ borderBottom: '1px solid rgba(201,168,76,0.05)' }}>
            <div className="flex gap-2 items-start mb-1">
              <span className="text-[#B09098] text-xs font-bold uppercase tracking-wider flex-shrink-0">De:</span>
              <span className="text-[#D0A8BC] font-mono text-xs">{EMAIL_META.fromEmail}</span>
            </div>
            <div className="flex gap-2 items-start">
              <span className="text-[#B09098] text-xs font-bold uppercase tracking-wider flex-shrink-0">Asunto:</span>
              <span className="text-[#ECD8DC] text-xs">{EMAIL_META.subject}</span>
            </div>
          </div>
          <div className="px-4 py-4 space-y-3 text-[#D8C8D0] text-sm leading-relaxed">
            <p>Estimado/a miembro de la comunidad PUCE,</p>
            <p>
              Le informamos que el portal académico ha sido actualizado. Visite nuestro portal oficial:{' '}
              <LinkEl link={LINKS[0]} onClick={handleLinkClick} colorStyle={getLinkStyle(LINKS[0], clickedIds, done)} done={done} />
              {' '}para explorar los cambios.
            </p>
            <p>
              Descargue el formulario de actualización aquí:{' '}
              <LinkEl link={LINKS[1]} onClick={handleLinkClick} colorStyle={getLinkStyle(LINKS[1], clickedIds, done)} done={done} />
            </p>
            <p>
              Más información sobre admisiones:{' '}
              <LinkEl link={LINKS[2]} onClick={handleLinkClick} colorStyle={getLinkStyle(LINKS[2], clickedIds, done)} done={done} />
            </p>
            <p>
              Confirme sus datos de acceso en:{' '}
              <LinkEl link={LINKS[3]} onClick={handleLinkClick} colorStyle={getLinkStyle(LINKS[3], clickedIds, done)} done={done} />
            </p>
            <p className="text-[#B0A0A8] text-xs mt-2">Atentamente,<br />Dirección de Informática — PUCE</p>
          </div>
        </div>

        {/* Active link detail */}
        {activeLink && !done && (
          <div className="mt-3 rounded-xl p-4 animate-bounce-in" style={{ background: activeLink.suspicious ? 'rgba(239,68,68,0.08)' : 'rgba(74,222,128,0.08)', border: `1px solid ${activeLink.suspicious ? 'rgba(239,68,68,0.3)' : 'rgba(74,222,128,0.3)'}` }}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${activeLink.suspicious ? 'text-red-300 bg-red-950/60 border border-red-800/50' : 'text-green-300 bg-green-950/60 border border-green-800/50'}`}>
                {activeLink.label}
              </span>
              <button onClick={() => setActiveLink(null)} className="ml-auto text-[#9A8090] hover:text-[#C9A84C] text-xs transition-colors">Cerrar ✕</button>
            </div>
            <p className="font-mono text-xs text-[#C9A84C] mb-2 break-all">{activeLink.text}</p>
            <p className={`text-xs leading-relaxed ${activeLink.suspicious ? 'text-red-300/80' : 'text-green-300/80'}`}>{activeLink.reason}</p>
          </div>
        )}

        {/* Progress */}
        {!done && foundIds.size > 0 && (
          <p className="text-center text-[#C9A84C] text-xs mt-3 animate-fade-in">
            {foundIds.size}/{SUSPICIOUS.length} enlaces sospechosos identificados
          </p>
        )}

        {/* Manual done button */}
        {!done && clickedIds.size > 0 && (
          <button onClick={handleDone} className="w-full mt-3 py-3 rounded-xl font-bold text-sm text-[#9A8898] hover:text-[#C9A84C] transition-colors" style={{ border: '1px solid rgba(201,168,76,0.2)', background: 'rgba(40,16,24,0.6)' }}>
            Ver resultado
          </button>
        )}

        {/* Done state */}
        {done && (
          <div className="mt-3 animate-fade-in-up space-y-2">
            {SUSPICIOUS.map(link => (
              <div key={link.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg" style={{ background: foundIds.has(link.id) ? 'rgba(74,222,128,0.07)' : 'rgba(239,68,68,0.07)', border: `1px solid ${foundIds.has(link.id) ? 'rgba(74,222,128,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
                <span className={`text-sm font-bold flex-shrink-0 ${foundIds.has(link.id) ? 'text-green-400' : 'text-red-400'}`}>{foundIds.has(link.id) ? '✓' : '✗'}</span>
                <span className="font-mono text-xs text-[#C9A84C] flex-1 break-all">{link.text}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${foundIds.has(link.id) ? 'text-green-300 bg-green-950/50' : 'text-red-300 bg-red-950/50'}`}>{foundIds.has(link.id) ? 'Detectado' : 'Perdido'}</span>
              </div>
            ))}
            <div className="rounded-xl p-4 text-center" style={{ background: foundIds.size >= SUSPICIOUS.length ? 'rgba(74,222,128,0.07)' : 'rgba(201,168,76,0.07)', border: `1px solid ${foundIds.size >= SUSPICIOUS.length ? 'rgba(74,222,128,0.25)' : 'rgba(201,168,76,0.25)'}` }}>
              <p className={`font-bold text-base ${foundIds.size >= SUSPICIOUS.length ? 'text-green-400' : 'text-[#C9A84C]'}`}>
                {foundIds.size >= SUSPICIOUS.length ? 'Perfecto — encontraste todos los enlaces trampa' : `Encontraste ${foundIds.size}/${SUSPICIOUS.length} enlaces peligrosos`}
              </p>
              {earnedPreview > 0 && <p className="text-[#C9A84C] text-sm mt-1 font-bold">+{earnedPreview} puntos{earnedPreview > foundIds.size * 50 && <span className="text-xs text-[#A08040] ml-1 font-normal">+ bono velocidad</span>}</p>}
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
