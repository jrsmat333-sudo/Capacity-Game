export default function GameHeader({ section, timeLeft, totalTime, instruction, score }) {
  const pct = totalTime > 0 ? timeLeft / totalTime : 0
  const timerColor = pct > 0.5 ? '#4ADE80' : pct > 0.25 ? '#F59E0B' : '#EF4444'
  const r = 20
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - pct)
  const urgent = timeLeft <= 10 && timeLeft > 0

  return (
    <div
      className="w-full px-4 pt-4 pb-3 flex-shrink-0 z-20 relative"
      style={{ background: 'linear-gradient(to bottom, #0D0508 80%, transparent)' }}
    >
      {/* Row: section dots — score — timer */}
      <div className="flex items-center justify-between mb-2">

        {/* Section progress dots */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 7 }, (_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-500"
              style={{
                width: i + 1 === section ? '22px' : '8px',
                height: '8px',
                background:
                  i + 1 < section
                    ? '#7A1930'
                    : i + 1 === section
                    ? '#C9A84C'
                    : 'rgba(42,16,24,0.8)',
                boxShadow:
                  i + 1 === section ? '0 0 10px rgba(201,168,76,0.7)' : 'none',
              }}
            />
          ))}
          <span className="text-[#5A3040] text-xs ml-1 font-semibold">{section}/7</span>
        </div>

        {/* Score */}
        <div
          className="px-3 py-1 rounded-full flex items-center gap-1"
          style={{
            background: 'rgba(201,168,76,0.08)',
            border: '1px solid rgba(201,168,76,0.2)',
          }}
        >
          <span className="text-[#C9A84C] text-sm font-black">{score}</span>
          <span className="text-[#5A3040] text-xs">pts</span>
        </div>

        {/* Timer ring */}
        <div className="relative w-12 h-12">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
            <circle
              cx="24" cy="24" r={r}
              fill="none"
              stroke="rgba(122,25,48,0.25)"
              strokeWidth="3.5"
            />
            <circle
              cx="24" cy="24" r={r}
              fill="none"
              stroke={timerColor}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.4s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={`text-sm font-black ${urgent ? 'animate-countdown' : ''}`}
              style={{ color: timerColor }}
            >
              {timeLeft}
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-px bg-[#2A1018] rounded-full overflow-hidden mb-3">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${((section - 1) / 7) * 100}%`,
            background: 'linear-gradient(to right, #7A1930, #C9A84C)',
          }}
        />
      </div>

      {/* Instruction */}
      <p className="text-center text-white text-sm font-semibold leading-snug tracking-wide">
        {instruction}
      </p>
    </div>
  )
}
