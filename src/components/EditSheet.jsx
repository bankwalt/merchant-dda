import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from './Icon.jsx'

export function EditSheet({ open, eyebrow, title, onClose, children }) {
  const [mountEl, setMountEl] = useState(null)

  useEffect(() => {
    if (!open) return
    setMountEl(document.querySelector('.phone'))
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open || !mountEl) return null

  return createPortal(
    <div className="sheet-root" role="dialog" aria-modal="true" aria-label={title}>
      <button className="sheet-backdrop" onClick={onClose} aria-label="Close" />
      <div className="sheet edit-sheet">
        <div className="sheet-handle" aria-hidden="true" />
        <div className="sheet-header">
          <div className="sheet-title">
            {eyebrow && (
              <div
                className="body-200 muted-strong"
                style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}
              >
                {eyebrow}
              </div>
            )}
            <div className="heading-300">{title}</div>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <Icon name="X" size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    mountEl,
  )
}
