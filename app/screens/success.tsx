import { useState } from "react";
import { Icon } from "../components/icon";

interface SuccessProps {
  onOpenDashboard: () => void;
  onRestart: () => void;
}

export function Success({ onOpenDashboard, onRestart }: SuccessProps) {
  return (
    <div className="screen success-screen">
      <div className="success-confetti" aria-hidden="true" />

      <div className="screen-body stack-lg" style={{ paddingTop: 60 }}>
        <div className="success-icon">
          <Icon name="Check circle" size={56} color="rgb(var(--success-500))" />
        </div>

        <div style={{ textAlign: "center" }}>
          <h1 className="heading-600" style={{ margin: 0 }}>
            You're all set.
          </h1>
          <p className="body-500 muted" style={{ margin: "8px 0 0" }}>
            Your Partner Business Anywhere and Savings accounts are open.
          </p>
        </div>

        <div className="success-cards">
          <AccountCard label="Business Anywhere" mask="••4201" amount="$0.00" apy="0.00% APY" />
          <AccountCard
            label="Savings"
            mask="••4202"
            amount="$0.00"
            apy="2.00% APY"
            highlight
          />
        </div>

        <VirtualCard mask="5525" network="Visa" />

        <div className="success-next">
          <NextItem
            icon="Cash"
            title="Next settlement"
            sub="Routes to Business Anywhere tomorrow"
          />
        </div>
      </div>

      <div className="screen-footer stack-sm">
        <button className="btn btn-primary" onClick={onOpenDashboard}>
          Open dashboard
          <Icon name="Arrow right" size={18} />
        </button>
        <button className="btn btn-ghost" onClick={onRestart}>
          Start over
        </button>
      </div>
    </div>
  );
}

interface AccountCardProps {
  label: string;
  mask: string;
  amount: string;
  apy: string;
  highlight?: boolean;
}

function AccountCard({ label, mask, amount, apy, highlight }: AccountCardProps) {
  return (
    <div className={`account-card ${highlight ? "is-highlight" : ""}`}>
      <div className="body-300 muted">{label}</div>
      <div className="heading-500" style={{ marginTop: 4 }}>
        {amount}
      </div>
      <div className="account-card-meta">
        <span className="body-200 muted">{mask}</span>
        <span
          className="body-300"
          style={{ color: highlight ? "rgb(var(--success-700))" : "rgb(var(--neutral-600))" }}
        >
          {apy}
        </span>
      </div>
      <div className="legal-text muted" style={{ marginTop: 6 }}>
        First Internet Bank, Member FDIC · Routing 074920912
      </div>
    </div>
  );
}

interface VirtualCardProps {
  mask: string;
  network: string;
}

type WalletStatus = "idle" | "pending" | "error";

function VirtualCard({ mask, network }: VirtualCardProps) {
  const [apple, setApple] = useState<WalletStatus>("idle");
  const [google, setGoogle] = useState<WalletStatus>("idle");
  const [showDetails, setShowDetails] = useState(false);

  const shouldFail =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("demo") === "wallet-fail";

  const provision = async (set: (s: WalletStatus) => void): Promise<void> => {
    set("pending");
    await new Promise((r) => setTimeout(r, 900));
    if (shouldFail) {
      set("error");
      return;
    }
    // TODO: Lithic push provisioning → wallet SDK. Stubbed success for prototype.
    set("idle");
  };

  const anyError = apple === "error" || google === "error";

  return (
    <div className="virtual-card">
      <div className="virtual-card-art">
        <div className="virtual-card-chip" aria-hidden="true" />
        <div className="virtual-card-network">{network}</div>
        <div className="virtual-card-mask">•••• {mask}</div>
        <div className="virtual-card-meta">
          <span className="virtual-card-label">Virtual debit</span>
          <span className="virtual-card-status">
            <Icon name="Check circle" size={14} color="rgb(var(--success-300))" />
            Ready
          </span>
        </div>
      </div>

      <div className="virtual-card-body">
        <div className="virtual-card-heading">
          <div className="heading-200">Your card is ready</div>
          <div className="body-200 muted">
            Add it to a wallet to tap-to-pay today. Physical card ships next week.
          </div>
        </div>

        <div className="wallet-buttons">
          <WalletButton variant="apple" status={apple} onClick={() => provision(setApple)} />
          <WalletButton variant="google" status={google} onClick={() => provision(setGoogle)} />
        </div>

        {anyError && !showDetails && (
          <button className="wallet-fallback-link" onClick={() => setShowDetails(true)}>
            Use card details instead
          </button>
        )}

        {showDetails && <ManualCardDetails mask={mask} onClose={() => setShowDetails(false)} />}

        <div className="legal-text muted virtual-card-disclaimer">
          <Icon name="Lock closed" size={12} /> Card number never leaves your issuer.
        </div>
      </div>
    </div>
  );
}

interface WalletButtonProps {
  variant: "apple" | "google";
  status: WalletStatus;
  onClick: () => void;
}

function WalletButton({ variant, status, onClick }: WalletButtonProps) {
  const label = variant === "apple" ? "Apple Wallet" : "Google Wallet";
  const iconColor = variant === "apple" ? "rgb(var(--white))" : undefined;

  if (status === "error") {
    return (
      <button className="wallet-btn wallet-btn-error" onClick={onClick}>
        <Icon name="Information circle" size={16} color="rgb(var(--error-700))" />
        <span>Couldn't add · Retry</span>
      </button>
    );
  }

  return (
    <button
      className={`wallet-btn wallet-btn-${variant}`}
      onClick={onClick}
      disabled={status === "pending"}
    >
      <Icon name="Wallet" size={18} color={iconColor} />
      {status === "pending" ? "Adding…" : `Add to ${label}`}
    </button>
  );
}

interface ManualCardDetailsProps {
  mask: string;
  onClose: () => void;
}

function ManualCardDetails({ mask, onClose }: ManualCardDetailsProps) {
  return (
    <div className="card-details-inline" role="region" aria-label="Card details">
      <div className="card-details-header">
        <div className="heading-200">Card details</div>
        <button className="icon-btn" onClick={onClose} aria-label="Hide card details">
          <Icon name="X" size={16} />
        </button>
      </div>
      <dl className="card-details-list">
        <div>
          <dt className="body-200 muted">Number</dt>
          <dd className="body-400">4242 4242 4242 {mask}</dd>
        </div>
        <div>
          <dt className="body-200 muted">Expires</dt>
          <dd className="body-400">12/29</dd>
        </div>
        <div>
          <dt className="body-200 muted">CVV</dt>
          <dd className="body-400">•••</dd>
        </div>
      </dl>
      <p className="legal-text muted" style={{ margin: 0 }}>
        Use these details to check out online while we sort out wallet provisioning.
      </p>
    </div>
  );
}

interface NextItemProps {
  icon: string;
  title: string;
  sub: string;
}

function NextItem({ icon, title, sub }: NextItemProps) {
  return (
    <div className="next-item">
      <div className="next-item-icon">
        <Icon name={icon} size={18} />
      </div>
      <div>
        <div className="heading-200">{title}</div>
        <div className="body-200 muted">{sub}</div>
      </div>
    </div>
  );
}
