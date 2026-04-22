import { useState } from "react";
import { Icon } from "../components/icon";
import { track, useScreenView } from "../lib/analytics";

interface SuccessProps {
  onOpenDashboard: () => void;
  onRestart: () => void;
}

export function Success({ onOpenDashboard, onRestart }: SuccessProps) {
  useScreenView("success_viewed");

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
          <AccountCard
            label="Business Anywhere"
            mask="••4201"
            amount="$8,420.17"
            apy="0.00% APY"
            footnote="Today's settlement"
          />
          <AccountCard
            label="Savings"
            mask="••4202"
            amount="$0.00"
            apy="2.00% APY"
            highlight
          />
        </div>

        <VirtualCard mask="5525" network="Visa" />

        <FirstTimeTips />
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
  footnote?: string;
}

function AccountCard({ label, mask, amount, apy, highlight, footnote }: AccountCardProps) {
  return (
    <div className={`account-card ${highlight ? "is-highlight" : ""}`}>
      <div className="body-300 muted">{label}</div>
      <div className="heading-500" style={{ marginTop: 4 }}>
        {amount}
      </div>
      {footnote && (
        <div className="account-card-footnote">
          <Icon name="Sparkles" size={12} color="rgb(var(--success-700))" />
          <span>{footnote}</span>
        </div>
      )}
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

type WalletStatus = "idle" | "pending" | "error" | "added";

type WalletTarget = "apple" | "google";

function VirtualCard({ mask, network }: VirtualCardProps) {
  const [apple, setApple] = useState<WalletStatus>("idle");
  const [google, setGoogle] = useState<WalletStatus>("idle");

  const failTarget: WalletTarget | null =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("demo") === "wallet-fail"
      ? "apple"
      : null;

  const provision = async (set: (s: WalletStatus) => void, target: WalletTarget): Promise<void> => {
    set("pending");
    await new Promise((r) => setTimeout(r, 900));
    if (failTarget === target) {
      set("error");
      track("wallet_add_failed", { target });
      return;
    }
    // TODO: Lithic push provisioning → wallet SDK. Stubbed success for prototype.
    set("added");
    track("wallet_add_succeeded", { target });
  };

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
          <div className="heading-200">Your virtual card is ready</div>
          <div className="body-200 muted">
            Add it to a wallet and tap to pay anywhere Visa is accepted. No physical card — your
            phone is the card.
          </div>
        </div>

        <div className="wallet-buttons">
          <WalletButton
            variant="apple"
            status={apple}
            onClick={() => provision(setApple, "apple")}
          />
          <WalletButton
            variant="google"
            status={google}
            onClick={() => provision(setGoogle, "google")}
          />
        </div>

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

  if (status === "added") {
    return (
      <button className="wallet-btn wallet-btn-added" disabled>
        <Icon name="Check circle" size={16} color="rgb(var(--success-700))" />
        <span>Added</span>
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

function FirstTimeTips() {
  return (
    <section className="first-time-tips" aria-label="First time with a virtual card">
      <div className="first-time-tips-header">
        <Icon name="Sparkles" size={14} color="rgb(var(--primary-700))" />
        <span className="heading-100" style={{ color: "rgb(var(--neutral-700))" }}>
          First time with a virtual card?
        </span>
      </div>
      <ul className="first-time-tips-list">
        <TipRow
          icon="Wallet"
          title="Tap at any Visa terminal"
          sub="Contactless pay works the moment the card lands in Apple or Google Wallet."
        />
        <TipRow
          icon="Lock closed"
          title="Lock it in seconds"
          sub="Lost phone? Freeze the card from Dashboard → Cards — no call needed."
        />
        <TipRow
          icon="Cash"
          title="Settlements post in real time"
          sub="Every card sale lands in Business Anywhere the moment it clears."
        />
      </ul>
    </section>
  );
}

function TipRow({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  return (
    <li className="first-time-tip">
      <span className="first-time-tip-icon" aria-hidden="true">
        <Icon name={icon} size={16} color="rgb(var(--primary-700))" />
      </span>
      <div className="first-time-tip-body">
        <div className="heading-200">{title}</div>
        <div className="body-200 muted" style={{ marginTop: 2 }}>
          {sub}
        </div>
      </div>
    </li>
  );
}
