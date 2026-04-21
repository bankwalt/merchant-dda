export function Field({ label, hint, error, children }) {
  return (
    <label className={`field ${error ? 'has-error' : ''}`}>
      <span className="field-label body-300">{label}</span>
      {children}
      {error ? (
        <span className="field-hint body-200" style={{ color: 'rgb(var(--error-700))' }}>
          {error}
        </span>
      ) : hint ? (
        <span className="field-hint body-200 muted">{hint}</span>
      ) : null}
    </label>
  )
}

export function TextInput({ value, onChange, type = 'text', placeholder, inputMode, autoComplete, maxLength }) {
  return (
    <input
      className="field-input"
      type={type}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      inputMode={inputMode}
      autoComplete={autoComplete}
      maxLength={maxLength}
    />
  )
}

export function Select({ value, onChange, options }) {
  return (
    <div className="field-select-wrap">
      <select
        className="field-input field-select"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) =>
          typeof o === 'string' ? (
            <option key={o} value={o}>{o}</option>
          ) : (
            <option key={o.value} value={o.value}>{o.label}</option>
          )
        )}
      </select>
    </div>
  )
}

export function FieldRow({ children }) {
  return <div className="field-row">{children}</div>
}

export function Section({ title, children }) {
  return (
    <div className="form-section">
      <div className="form-section-title heading-100">{title}</div>
      <div className="form-section-body stack-md">{children}</div>
    </div>
  )
}

export function ReadonlyRow({ label, value, hint }) {
  return (
    <div className="readonly-row">
      <div className="readonly-row-body">
        <div className="body-200 muted">{label}</div>
        <div className="body-500 readonly-row-value">{value || '—'}</div>
        {hint && <div className="body-200 muted readonly-row-hint">{hint}</div>}
      </div>
      <LockBadge />
    </div>
  )
}

function LockBadge() {
  return (
    <span className="readonly-lock" aria-hidden="true" title="From your application">
      <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
        <rect x="1.5" y="6" width="9" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M3.5 6V4a2.5 2.5 0 015 0v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </span>
  )
}
