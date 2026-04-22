import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "./icon";

interface SupportSheetProps {
  open: boolean;
  reason?: string;
  onClose: () => void;
}

export function SupportSheet({ open, reason, onClose }: SupportSheetProps) {
  const [mountEl, setMountEl] = useState<Element | null>(null);

  useEffect(() => {
    if (!open) return;
    setMountEl(document.querySelector(".phone"));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !mountEl) return null;

  const subject = reason
    ? `Business Anywhere — ${reason}`
    : "Business Anywhere — onboarding help";

  return createPortal(
    <div className="sheet-root" role="dialog" aria-modal="true" aria-label="Contact support">
      <button className="sheet-backdrop" onClick={onClose} aria-label="Close" />
      <div className="sheet support-sheet">
        <div className="sheet-handle" aria-hidden="true" />
        <div className="sheet-header">
          <div className="sheet-title">
            <div
              className="body-200 muted-strong"
              style={{ textTransform: "uppercase", letterSpacing: "0.06em" }}
            >
              Support
            </div>
            <div className="heading-300">We'll unlock it for you</div>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <Icon name="X" size={18} />
          </button>
        </div>

        <div className="sheet-body support-body">
          {reason && (
            <div className="support-reason">
              <Icon name="Lock closed" size={14} color="rgb(var(--neutral-600))" />
              <span className="body-300 muted-strong">{reason}</span>
            </div>
          )}
          <p className="body-400 muted" style={{ margin: 0 }}>
            Locked details came from your application and need a quick identity check before we can
            change them. Reach us and we'll sort it in one call.
          </p>

          <a
            className="support-option"
            href={`mailto:support@jaris.io?subject=${encodeURIComponent(subject)}`}
          >
            <div className="support-option-icon">
              <Icon name="Email" size={18} />
            </div>
            <div>
              <div className="heading-200">Email support</div>
              <div className="body-200 muted">support@jaris.io · reply within 1 business day</div>
            </div>
            <Icon name="Arrow right" size={16} color="rgb(var(--neutral-500))" />
          </a>

          <a className="support-option" href="tel:+18885551234">
            <div className="support-option-icon">
              <Icon name="Phone" size={18} />
            </div>
            <div>
              <div className="heading-200">Call us</div>
              <div className="body-200 muted">(888) 555-1234 · Mon–Fri, 8a–6p CT</div>
            </div>
            <Icon name="Arrow right" size={16} color="rgb(var(--neutral-500))" />
          </a>
        </div>
      </div>
    </div>,
    mountEl,
  );
}
