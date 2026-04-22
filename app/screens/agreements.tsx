import { useState } from "react";
import { Icon } from "../components/icon";
import { DisclosureSheet } from "../components/disclosure-sheet";
import { StepDots } from "../components/step-dots";
import { disclosureGroups, priorConsents, type ConsentRecord } from "../data/merchant";

interface AgreementsProps {
  onBack: () => void;
  onContinue: () => void;
}

export function Agreements({ onBack, onContinue }: AgreementsProps) {
  const [records, setRecords] = useState<Record<string, ConsentRecord>>({});
  const [openId, setOpenId] = useState<string | null>(null);

  const acceptedCount = Object.keys(records).length;
  const allDone = acceptedCount === disclosureGroups.length;
  const activeGroup = disclosureGroups.find((g) => g.id === openId) ?? null;

  const acceptCurrent = () => {
    if (!activeGroup) return;
    const record: ConsentRecord = {
      groupId: activeGroup.id,
      docVersions: Object.fromEntries(activeGroup.docs.map((d) => [d.id, d.version])),
      acceptedAt: new Date().toISOString(),
      userId: null,
    };
    setRecords((prev) => ({ ...prev, [activeGroup.id]: record }));
    setOpenId(null);
  };

  const handleContinue = () => {
    // TODO(stage-3): persist records to backend via Auth0-scoped session.
    // For now, emit to console so the record shape is visible during review.
    console.info("[consent.accepted]", Object.values(records));
    onContinue();
  };

  return (
    <div className="screen">
      <div className="screen-header">
        <button className="icon-btn" onClick={onBack} aria-label="Back">
          <Icon name="Chevron left" size={22} />
        </button>
        <StepDots current={1} total={3} label="Agreements" />
        <span style={{ width: 36 }} />
      </div>

      <div className="screen-body stack-lg">
        <div>
          <h1 className="heading-600" style={{ margin: 0, letterSpacing: "-0.01em" }}>
            Almost there!
          </h1>
          <p className="body-400 muted" style={{ margin: "6px 0 0" }}>
            Tap each agreement to read and accept.
          </p>
        </div>

        <div className="agreements-progress">
          <div
            className="agreements-progress-fill"
            style={{ width: `${(acceptedCount / disclosureGroups.length) * 100}%` }}
          />
        </div>
        <div className="body-200 muted" style={{ marginTop: -8 }}>
          {acceptedCount} of {disclosureGroups.length} accepted
        </div>

        <div className="disclosure-owner">
          <Icon name="Shield check" size={14} color="rgb(var(--neutral-500))" />
          <span>Issued by First Internet Bank · Maintained with Jaris</span>
        </div>

        <div className="stack-md">
          {disclosureGroups.map((g) => {
            const done = g.id in records;
            const docCountLabel =
              g.docs.length > 1 ? ` · ${g.docs.length} documents` : "";
            return (
              <button
                key={g.id}
                className={`agreement-row ${done ? "is-done" : ""}`}
                onClick={() => setOpenId(g.id)}
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
                  <div className="heading-200">{g.title}</div>
                  <div className="body-200 muted" style={{ marginTop: 2 }}>
                    {done ? "Accepted · tap to review" : `${g.subtitle}${docCountLabel}`}
                  </div>
                </div>
                <Icon name="Chevron right" size={16} color="rgb(var(--neutral-400))" />
              </button>
            );
          })}
        </div>

        <div className="prior-consents">
          <div className="prior-consents-header">
            <Icon name="Check circle" size={16} color="rgb(var(--success-500))" />
            <span className="heading-100" style={{ color: "rgb(var(--neutral-700))" }}>
              Previously agreed
            </span>
          </div>
          <p className="body-200 muted" style={{ margin: "4px 0 10px" }}>
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
        <button className="btn btn-primary" onClick={handleContinue} disabled={!allDone}>
          {allDone ? "Continue" : `Accept ${disclosureGroups.length - acceptedCount} more`}
          {allDone && <Icon name="Arrow right" size={18} />}
        </button>
      </div>

      <DisclosureSheet
        open={activeGroup !== null}
        group={activeGroup}
        alreadyAccepted={openId ? openId in records : false}
        onClose={() => setOpenId(null)}
        onAccept={acceptCurrent}
      />
    </div>
  );
}

