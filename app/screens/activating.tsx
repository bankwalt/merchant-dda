import { useEffect, useState } from "react";
import { Icon } from "../components/icon";
import { SupportSheet } from "../components/support-sheet";

const steps = [
  { key: "open", label: "Opening your DDA" },
  { key: "save", label: "Opening your Savings" },
  { key: "route", label: "Routing settlement" },
  { key: "done", label: "Ready" },
];

interface ActivatingProps {
  onDone: () => void;
  onBack: () => void;
}

type Phase = "running" | "error";

export function Activating({ onDone, onBack }: ActivatingProps) {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("running");
  const [supportOpen, setSupportOpen] = useState(false);

  const shouldFail =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("demo") === "activate-fail";

  useEffect(() => {
    if (phase !== "running") return;
    if (idx >= steps.length - 1) {
      const t = setTimeout(onDone, 700);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      if (shouldFail && idx === 1) {
        setPhase("error");
      } else {
        setIdx((i) => i + 1);
      }
    }, 900);
    return () => clearTimeout(t);
  }, [idx, onDone, phase, shouldFail]);

  const retry = () => {
    setIdx(0);
    setPhase("running");
  };

  if (phase === "error") {
    return (
      <div className="screen">
        <div
          className="screen-body stack-lg"
          style={{ justifyContent: "center", paddingTop: 60, textAlign: "center" }}
        >
          <div className="activating-error-icon" aria-hidden="true">
            <Icon name="Information circle" size={32} color="rgb(var(--white))" />
          </div>
          <div>
            <div className="heading-500">We hit a snag</div>
            <p className="body-400 muted" style={{ margin: "8px 0 0" }}>
              We couldn't finish opening your accounts. No changes were saved — nothing to undo.
            </p>
          </div>
          <div className="activating-error-detail">
            <div className="body-200 muted-strong">Failed step</div>
            <div className="body-300">Opening your Savings</div>
          </div>
        </div>
        <div className="screen-footer stack-sm">
          <button className="btn btn-primary" onClick={retry}>
            Try again
            <Icon name="Arrow right" size={18} />
          </button>
          <button className="btn btn-ghost" onClick={() => setSupportOpen(true)}>
            Contact support
          </button>
          <button className="btn btn-ghost" onClick={onBack}>
            Back to review
          </button>
        </div>
        <SupportSheet
          open={supportOpen}
          reason="Activation error — opening Savings"
          onClose={() => setSupportOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="screen-body" style={{ justifyContent: "center", gap: 32, paddingTop: 80 }}>
        <div className="activating-pulse">
          <div className="activating-pulse-ring" />
          <div className="activating-pulse-ring delay-1" />
          <div className="activating-pulse-core">
            <Icon name="Sparkles" size={28} color="rgb(var(--white))" />
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <div className="heading-500">Activating your account</div>
          <div className="body-400 muted" style={{ marginTop: 4 }}>
            This takes a few seconds.
          </div>
        </div>

        <ul className="activating-steps">
          {steps.map((s, i) => {
            const state = i < idx ? "done" : i === idx ? "active" : "pending";
            return (
              <li key={s.key} className={`activating-step is-${state}`}>
                <span className="activating-step-dot">
                  {state === "done" && <Icon name="Check" size={12} />}
                </span>
                <span className="body-400">{s.label}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
