import { useEffect, useState, type ReactNode } from "react";

function formatClock() {
  const d = new Date();
  const h = d.getHours() % 12 || 12;
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

interface PhoneChromeProps {
  children: ReactNode;
}

export function PhoneChrome({ children }: PhoneChromeProps) {
  const [clock, setClock] = useState(formatClock());

  useEffect(() => {
    const id = setInterval(() => setClock(formatClock()), 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="canvas">
      <div className="phone" role="application" aria-label="Business Anywhere mobile app">
        <div className="phone-notch" />
        <div className="phone-status">
          <span>{clock}</span>
          <div className="phone-status-right">
            <StatusIcon kind="signal" />
            <StatusIcon kind="wifi" />
            <StatusIcon kind="battery" />
          </div>
        </div>
        <div className="phone-body">{children}</div>
        <div className="phone-regulatory">
          Powered by Partner · Banking by First Internet Bank, Member FDIC
        </div>
      </div>
    </div>
  );
}

type StatusIconKind = "signal" | "wifi" | "battery";

function StatusIcon({ kind }: { kind: StatusIconKind }) {
  if (kind === "signal") {
    return (
      <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" aria-hidden="true">
        <rect x="0" y="8" width="3" height="4" rx="0.5" />
        <rect x="5" y="5" width="3" height="7" rx="0.5" />
        <rect x="10" y="2" width="3" height="10" rx="0.5" />
        <rect x="15" y="0" width="3" height="12" rx="0.5" />
      </svg>
    );
  }
  if (kind === "wifi") {
    return (
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">
        <path d="M8 10.5a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4z" fill="currentColor" />
        <path
          d="M3.5 6.5a6 6 0 019 0"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M1 4a9 9 0 0114 0"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg width="24" height="12" viewBox="0 0 24 12" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="19" height="10" rx="2.5" stroke="currentColor" strokeWidth="1" />
      <rect x="3" y="3" width="15" height="6" rx="1" fill="currentColor" />
      <rect x="21" y="4" width="1.8" height="4" rx="0.6" fill="currentColor" />
    </svg>
  );
}
