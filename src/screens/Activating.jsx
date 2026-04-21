import { useEffect, useState } from 'react'
import { Icon } from '../components/Icon.jsx'

const steps = [
  { key: 'open', label: 'Opening your DDA' },
  { key: 'save', label: 'Opening your Savings' },
  { key: 'route', label: 'Routing settlement' },
  { key: 'done', label: 'Ready' },
]

export function Activating({ onDone }) {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (idx >= steps.length - 1) {
      const t = setTimeout(onDone, 700)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setIdx((i) => i + 1), 900)
    return () => clearTimeout(t)
  }, [idx, onDone])

  return (
    <div className="screen">
      <div className="screen-body" style={{ justifyContent: 'center', gap: 32, paddingTop: 80 }}>
        <div className="activating-pulse">
          <div className="activating-pulse-ring" />
          <div className="activating-pulse-ring delay-1" />
          <div className="activating-pulse-core">
            <Icon name="Sparkles" size={28} color="rgb(var(--white))" />
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div className="heading-500">Activating your account</div>
          <div className="body-400 muted" style={{ marginTop: 4 }}>
            This takes a few seconds.
          </div>
        </div>

        <ul className="activating-steps">
          {steps.map((s, i) => {
            const state = i < idx ? 'done' : i === idx ? 'active' : 'pending'
            return (
              <li key={s.key} className={`activating-step is-${state}`}>
                <span className="activating-step-dot">
                  {state === 'done' && <Icon name="Check" size={12} />}
                </span>
                <span className="body-400">{s.label}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
