import { useState } from "react";
import { Icon } from "../components/icon";
import { DisclosureSheet } from "../components/disclosure-sheet";
import { agreementDefs, priorConsents } from "../data/merchant";

interface AgreementsProps {
  onBack: () => void;
  onContinue: () => void;
}

export function Agreements({ onBack, onContinue }: AgreementsProps) {
  const [accepted, setAccepted] = useState<Set<string>>(() => new Set());
  const [openId, setOpenId] = useState<string | null>(null);

  const allDone = accepted.size === agreementDefs.length
  const activeAgreement = agreementDefs.find((a) => a.id === openId) || null

  const acceptCurrent = () => {
    if (!openId) return
    setAccepted((prev) => {
      const next = new Set(prev)
      next.add(openId)
      return next
    })
    setOpenId(null)
  }

  return (
    <div className="screen">
      <div className="screen-header">
        <button className="icon-btn" onClick={onBack} aria-label="Back">
          <Icon name="Chevron left" size={22} />
        </button>
        <StepDots current={1} total={3} />
        <span style={{ width: 36 }} />
      </div>

      <div className="screen-body stack-lg">
        <div>
          <h1 className="heading-600" style={{ margin: 0, letterSpacing: '-0.01em' }}>
            Almost there!
          </h1>
          <p className="body-400 muted" style={{ margin: '6px 0 0' }}>
            Tap each agreement to read and accept.
          </p>
        </div>

        <div className="agreements-progress">
          <div
            className="agreements-progress-fill"
            style={{ width: `${(accepted.size / agreementDefs.length) * 100}%` }}
          />
        </div>
        <div className="body-200 muted" style={{ marginTop: -8 }}>
          {accepted.size} of {agreementDefs.length} accepted
        </div>

        <div className="disclosure-owner">
          <Icon name="Shield check" size={14} color="rgb(var(--neutral-500))" />
          <span>Issued by First Internet Bank · Maintained with Jaris</span>
        </div>

        <div className="stack-md">
          {agreementDefs.map((a) => {
            const done = accepted.has(a.id)
            return (
              <button
                key={a.id}
                className={`agreement-row ${done ? 'is-done' : ''}`}
                onClick={() => setOpenId(a.id)}
                type="button"
              >
                <div className="agreement-row-icon">
                  {done ? (
                    <Icon name="Check" size={18} />
                  ) : (
                    <Icon name="Document text" size={18} />
                  )}
                </div>
                <div className="agreement-row-body">
                  <div className="heading-200">{a.title}</div>
                  <div className="body-200 muted" style={{ marginTop: 2 }}>
                    {done ? 'Accepted · tap to review' : a.subtitle}
                  </div>
                </div>
                <Icon name="Chevron right" size={16} color="rgb(var(--neutral-400))" />
              </button>
            )
          })}
        </div>

        <div className="prior-consents">
          <div className="prior-consents-header">
            <Icon name="Check circle" size={16} color="rgb(var(--success-500))" />
            <span className="heading-100" style={{ color: 'rgb(var(--neutral-700))' }}>
              Previously agreed
            </span>
          </div>
          <p className="body-200 muted" style={{ margin: '4px 0 10px' }}>
            From your prior Partner application. No action needed.
          </p>
          <div className="stack-sm">
            {priorConsents.map((c) => (
              <a
                key={c.id}
                className="prior-row"
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="body-400 muted-strong">{c.title}</span>
                <Icon name="External link" size={14} color="rgb(var(--neutral-500))" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="screen-footer">
        <button
          className="btn btn-primary"
          onClick={onContinue}
          disabled={!allDone}
        >
          {allDone ? 'Continue' : `Accept ${agreementDefs.length - accepted.size} more`}
          {allDone && <Icon name="Arrow right" size={18} />}
        </button>
      </div>

      <DisclosureSheet
        open={activeAgreement !== null}
        title={activeAgreement?.title}
        file={activeAgreement?.file}
        alreadyAccepted={openId ? accepted.has(openId) : false}
        onClose={() => setOpenId(null)}
        onAccept={acceptCurrent}
      />
    </div>
  )
}

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="step-dots">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`step-dot ${i === current ? 'active' : i < current ? 'done' : ''}`}
        />
      ))}
    </div>
  )
}
