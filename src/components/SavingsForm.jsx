import { useMemo, useState } from 'react'
import { Icon } from './Icon.jsx'

const CADENCES = [
  { value: 'daily', label: 'Daily', perMonth: 30 },
  { value: 'weekly', label: 'Weekly', perMonth: 4 },
  { value: 'monthly', label: 'Monthly', perMonth: 1 },
]

export function SavingsForm({ value, onSave, onDisable, onCancel }) {
  const [draft, setDraft] = useState({
    enabled: true,
    amount: value?.amount ?? 200,
    cadence: value?.cadence ?? 'monthly',
  })

  const monthly = useMemo(() => {
    const c = CADENCES.find((x) => x.value === draft.cadence)
    return Math.round((Number(draft.amount) || 0) * (c?.perMonth ?? 1))
  }, [draft.amount, draft.cadence])

  const belowMin = monthly < 50
  const wasEnabled = Boolean(value?.enabled)

  return (
    <>
      <div className="sheet-body sheet-body-form">
        <div className="savings-preview">
          <div className="body-200 muted-strong" style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            You'll save
          </div>
          <div className="savings-preview-amount">
            {formatCurrency(monthly)}
            <span className="body-500 muted"> / month</span>
          </div>
          <div className="body-300 muted" style={{ marginTop: 2 }}>
            {formatCurrency(Number(draft.amount) || 0)} swept {draft.cadence}
          </div>
        </div>

        <div className="form stack-lg">
          <div className="form-section">
            <div className="form-section-title heading-100">Amount per sweep</div>
            <div className="form-section-body">
              <div className="amount-input">
                <span className="amount-input-prefix">$</span>
                <input
                  className="amount-input-field"
                  type="number"
                  min={1}
                  step={5}
                  inputMode="numeric"
                  value={draft.amount}
                  onChange={(e) => setDraft((d) => ({ ...d, amount: e.target.value }))}
                />
              </div>
              <div className="amount-presets">
                {[50, 100, 250, 500].map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`amount-preset ${Number(draft.amount) === p ? 'is-active' : ''}`}
                    onClick={() => setDraft((d) => ({ ...d, amount: p }))}
                  >
                    ${p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title heading-100">Sweep schedule</div>
            <div className="cadence-grid">
              {CADENCES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  className={`cadence-tile ${draft.cadence === c.value ? 'is-active' : ''}`}
                  onClick={() => setDraft((d) => ({ ...d, cadence: c.value }))}
                >
                  <div className="heading-200">{c.label}</div>
                  <div className="body-200 muted">
                    {c.value === 'daily'
                      ? 'Each business day'
                      : c.value === 'weekly'
                        ? 'Every Monday'
                        : '1st of the month'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {belowMin && (
            <div className="form-warning">
              <Icon name="Information circle" size={16} color="rgb(var(--warning-800))" />
              <span className="body-200" style={{ color: 'rgb(var(--warning-800))' }}>
                Partner Savings needs at least <strong>$50 / month</strong> to earn
                the 2.00% APY. Bump up the amount or cadence to clear the
                minimum.
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="sheet-footer">
        {wasEnabled && (
          <button type="button" className="btn btn-ghost" onClick={onDisable}>
            Turn off auto-save
          </button>
        )}
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={belowMin || !Number(draft.amount)}
            onClick={() =>
              onSave({
                enabled: true,
                amount: Number(draft.amount),
                cadence: draft.cadence,
              })
            }
          >
            {wasEnabled ? 'Save changes' : 'Turn on auto-save'}
            <Icon name="Check" size={18} />
          </button>
        </div>
      </div>
    </>
  )
}

function formatCurrency(n) {
  return `$${Number(n || 0).toLocaleString('en-US')}`
}
