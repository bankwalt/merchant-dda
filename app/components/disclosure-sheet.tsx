import { useEffect, useRef, useState } from "react";
import { Icon } from "./icon";
import type { DisclosureGroup } from "../data/merchant";

interface DisclosureSheetProps {
  open: boolean;
  group: DisclosureGroup | null;
  onClose: () => void;
  onAccept: () => void;
  alreadyAccepted: boolean;
}

export function DisclosureSheet({
  open,
  group,
  onClose,
  onAccept,
  alreadyAccepted,
}: DisclosureSheetProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [readState, setReadState] = useState<Record<string, boolean>>({});
  const [loadedState, setLoadedState] = useState<Record<string, boolean>>({});
  const iframeRefs = useRef<Record<string, HTMLIFrameElement | null>>({});

  // Reset internal state whenever we open a new group or close.
  useEffect(() => {
    if (!open || !group) {
      setActiveId(null);
      setReadState({});
      setLoadedState({});
      return;
    }
    setActiveId(group.docs[0]?.id ?? null);
    setReadState({});
    setLoadedState({});

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, group, onClose]);

  if (!open || !group) return null;

  const markRead = (docId: string) => {
    setReadState((prev) => (prev[docId] ? prev : { ...prev, [docId]: true }));
  };

  const onIframeLoad = (docId: string) => {
    setLoadedState((prev) => ({ ...prev, [docId]: true }));
    const win = iframeRefs.current[docId]?.contentWindow;
    if (!win) return;
    const doc = win.document;
    const check = () => {
      const nearBottom = win.innerHeight + win.scrollY >= doc.documentElement.scrollHeight - 24;
      if (nearBottom) markRead(docId);
    };
    check();
    win.addEventListener("scroll", check, { passive: true });
  };

  const allRead = group.docs.every((d) => readState[d.id]);
  const unreadCount = group.docs.filter((d) => !readState[d.id]).length;
  const hasTabs = group.docs.length > 1;
  const activeLoaded = activeId ? loadedState[activeId] : false;

  return (
    <div className="sheet-root" role="dialog" aria-modal="true" aria-label={group.title}>
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
            <div className="heading-300">{group.title}</div>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <Icon name="X" size={18} />
          </button>
        </div>

        {hasTabs && (
          <div className="sheet-tabs" role="tablist" aria-label="Disclosure sections">
            {group.docs.map((doc) => {
              const isActive = doc.id === activeId;
              const isRead = Boolean(readState[doc.id]);
              return (
                <button
                  key={doc.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`sheet-tab ${isActive ? "is-active" : ""} ${isRead ? "is-read" : ""}`}
                  onClick={() => setActiveId(doc.id)}
                >
                  {isRead ? (
                    <Icon
                      name="Check"
                      size={12}
                      color={isActive ? "rgb(var(--primary-700))" : "rgb(var(--success-700))"}
                    />
                  ) : (
                    <span className="sheet-tab-dot" aria-hidden="true" />
                  )}
                  <span>{doc.title}</span>
                </button>
              );
            })}
          </div>
        )}

        <div className="sheet-body sheet-body-docs">
          {!activeLoaded && (
            <div className="sheet-loading">
              <div className="sheet-loading-spin" />
              <span className="body-400 muted">Loading disclosure…</span>
            </div>
          )}
          {group.docs.map((doc) => {
            const isActive = doc.id === activeId;
            return (
              <iframe
                key={doc.id}
                ref={(el) => {
                  iframeRefs.current[doc.id] = el;
                }}
                title={doc.title}
                src={doc.file}
                onLoad={() => onIframeLoad(doc.id)}
                className={`sheet-iframe ${isActive ? "is-active" : ""}`}
                aria-hidden={!isActive}
              />
            );
          })}
        </div>

        <div className="sheet-footer">
          {!alreadyAccepted && !allRead && (
            <div className="sheet-hint body-200 muted">
              {hasTabs
                ? unreadCount === 1
                  ? "Scroll to the end of 1 more section to accept."
                  : `Scroll to the end of ${unreadCount} more sections to accept.`
                : "Scroll to the end to accept."}
            </div>
          )}
          {alreadyAccepted ? (
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          ) : (
            <button className="btn btn-primary" disabled={!allRead} onClick={onAccept}>
              {allRead ? "Accept and continue" : "Accept"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
