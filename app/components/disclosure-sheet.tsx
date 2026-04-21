import { useEffect, useRef, useState } from "react";
import { Icon } from "./icon";

interface DisclosureSheetProps {
  open: boolean;
  title?: string;
  file?: string;
  onClose: () => void;
  onAccept: () => void;
  alreadyAccepted: boolean;
}

export function DisclosureSheet({
  open,
  title,
  file,
  onClose,
  onAccept,
  alreadyAccepted,
}: DisclosureSheetProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [scrolledNearEnd, setScrolledNearEnd] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!open) {
      setScrolledNearEnd(false);
      setLoaded(false);
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const onIframeLoad = () => {
    setLoaded(true);
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    const doc = win.document;
    const check = () => {
      const nearBottom =
        win.innerHeight + win.scrollY >= doc.documentElement.scrollHeight - 24;
      if (nearBottom) setScrolledNearEnd(true);
    };
    check();
    win.addEventListener("scroll", check, { passive: true });
  };

  if (!open) return null;

  return (
    <div className="sheet-root" role="dialog" aria-modal="true" aria-label={title}>
      <button className="sheet-backdrop" onClick={onClose} aria-label="Close" />
      <div className="sheet">
        <div className="sheet-handle" aria-hidden="true" />
        <div className="sheet-header">
          <div className="sheet-title">
            <div
              className="body-200 muted-strong"
              style={{ textTransform: "uppercase", letterSpacing: "0.06em" }}
            >
              First Internet Bank
            </div>
            <div className="heading-300">{title}</div>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <Icon name="X" size={18} />
          </button>
        </div>
        <div className="sheet-body">
          {!loaded && (
            <div className="sheet-loading">
              <div className="sheet-loading-spin" />
              <span className="body-400 muted">Loading disclosure…</span>
            </div>
          )}
          <iframe
            ref={iframeRef}
            title={title}
            src={file}
            onLoad={onIframeLoad}
            className="sheet-iframe"
          />
        </div>
        <div className="sheet-footer">
          {!alreadyAccepted && !scrolledNearEnd && (
            <div className="sheet-hint body-200 muted">Scroll to the end to accept.</div>
          )}
          {alreadyAccepted ? (
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          ) : (
            <button className="btn btn-primary" disabled={!scrolledNearEnd} onClick={onAccept}>
              {scrolledNearEnd ? "Accept and continue" : "Accept"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
