import { useState } from "react";
import { Icon } from "../components/icon";
import { EditSheet } from "../components/edit-sheet";
import { SavingsForm, type SavingsCadence, type SavingsConfig } from "../components/savings-form";
import { StepDots } from "../components/step-dots";
import { initialMerchant as merchant } from "../data/merchant";

const CADENCE_LABEL: Record<SavingsCadence, string> = {
  daily: "daily",
  weekly: "weekly",
  monthly: "monthly",
};

interface FundsFlowProps {
  onBack: () => void;
  onActivate: () => void;
}

export function FundsFlow({ onBack, onActivate }: FundsFlowProps) {
  const [savings, setSavings] = useState<SavingsConfig>({
    enabled: false,
    amount: 200,
    cadence: "monthly",
  });
  const [editing, setEditing] = useState(false);

  const monthlyEquivalent =
    savings.cadence === "daily"
      ? savings.amount * 30
      : savings.cadence === "weekly"
        ? savings.amount * 4
        : savings.amount;

  return (
    <div className="screen">
      <div className="screen-header">
        <button className="icon-btn" onClick={onBack} aria-label="Back">
          <Icon name="Chevron left" size={22} />
        </button>
        <StepDots current={2} total={3} label="Funds" />
        <span style={{ width: 36 }} />
      </div>

      <div className="screen-body stack-lg">
        <div>
          <h1 className="heading-600" style={{ margin: 0, letterSpacing: "-0.01em" }}>
            Where your money lands.
          </h1>
          <p className="body-400 muted" style={{ margin: "6px 0 0" }}>
            Starting today, every card settlement sweeps into your new Partner Business Anywhere
            account.
          </p>
        </div>

        <div className="flow-card">
          <FlowNode
            icon="Credit card"
            label="Card sales"
            sub="Available the moment they clear"
            tone="neutral"
          />
          <FlowArrow />
          <FlowNode
            icon="Wallet"
            label="Partner Business Anywhere"
            sub="Visa Business debit card included · FDIC insured"
            tone="primary"
            emphasis
          />
          <FlowArrow branch />
          <div className="flow-branch">
            <button
              type="button"
              className={`flow-node tone-${savings.enabled ? "success" : "neutral"} is-compact flow-node-button`}
              onClick={() => setEditing(true)}
            >
              <div className="flow-node-icon">
                <Icon name="Trending up" size={16} />
              </div>
              <div className="flow-node-body">
                <div className="body-300">Partner Savings</div>
                <div className="body-200 muted">
                  {savings.enabled
                    ? `${formatCurrency(savings.amount)} ${CADENCE_LABEL[savings.cadence]}`
                    : "2.00% APY"}
                </div>
              </div>
            </button>
            <div
              className="flow-node tone-muted is-compact is-strike"
              aria-label="Chase legacy route"
            >
              <div className="flow-node-icon">
                <Icon name="Switch horizontal" size={16} />
              </div>
              <div className="flow-node-body">
                <div className="body-300">{`Chase ${merchant.externalBank.mask}`}</div>
                <div className="body-200 muted">No longer in the loop</div>
              </div>
            </div>
          </div>
        </div>

        <SavingsSummary
          savings={savings}
          monthly={monthlyEquivalent}
          onEdit={() => setEditing(true)}
          onEnable={() => setEditing(true)}
        />

        <div className="notice">
          <Icon name="Information circle" size={16} color="rgb(var(--info-700))" />
          <span className="body-200" style={{ color: "rgb(var(--info-800))" }}>
            Chase is no longer in the settlement loop — all card sales now land in your Partner
            account. You can still send on-demand transfers from Settings.
          </span>
        </div>
      </div>

      <div className="screen-footer">
        <button className="btn btn-primary" onClick={onActivate}>
          Activate my account
          <Icon name="Arrow right" size={18} />
        </button>
        <p className="legal-text muted" style={{ textAlign: "center", margin: "12px 0 0" }}>
          By activating, you authorize <strong>First Internet Bank</strong> to open a Demand
          Deposit Account in your business's name and route your card settlements to it, and you
          agree to the disclosures reviewed above.
        </p>
      </div>

      <EditSheet
        open={editing}
        eyebrow="Partner Savings"
        title={savings.enabled ? "Edit auto-save" : "Turn on auto-save"}
        onClose={() => setEditing(false)}
      >
        <SavingsForm
          value={savings}
          onSave={(next) => {
            setSavings(next);
            setEditing(false);
          }}
          onDisable={() => {
            setSavings((s) => ({ ...s, enabled: false }));
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
        />
      </EditSheet>
    </div>
  );
}

interface SavingsSummaryProps {
  savings: SavingsConfig;
  monthly: number;
  onEdit: () => void;
  onEnable: () => void;
}

function SavingsSummary({ savings, monthly, onEdit, onEnable }: SavingsSummaryProps) {
  if (!savings.enabled) {
    return (
      <button type="button" className="savings-cta" onClick={onEnable}>
        <div className="savings-cta-icon">
          <Icon name="Sparkles" size={18} />
        </div>
        <div className="savings-cta-body">
          <div className="heading-200">Auto-save to Partner Savings</div>
          <div className="body-200 muted" style={{ marginTop: 2 }}>
            Earn 2.00% APY · $50 / month minimum
          </div>
        </div>
        <Icon name="Chevron right" size={16} color="rgb(var(--neutral-500))" />
      </button>
    );
  }
  return (
    <div className="savings-active">
      <div className="savings-active-header">
        <div className="savings-active-icon">
          <Icon name="Check" size={14} />
        </div>
        <div className="body-300" style={{ color: "rgb(var(--success-800))" }}>
          Auto-save on
        </div>
        <button type="button" className="savings-active-edit body-300" onClick={onEdit}>
          Edit
        </button>
      </div>
      <div className="savings-active-amount heading-500">
        {formatCurrency(monthly)}
        <span className="body-500 muted-strong"> / month</span>
      </div>
      <div className="body-200 muted" style={{ marginTop: 2 }}>
        {formatCurrency(savings.amount)} swept {CADENCE_LABEL[savings.cadence]} into Savings
      </div>
    </div>
  );
}

interface FlowNodeProps {
  icon: string;
  label: string;
  sub: string;
  tone?: "neutral" | "primary" | "success" | "muted";
  emphasis?: boolean;
  compact?: boolean;
  strikethrough?: boolean;
}

function FlowNode({
  icon,
  label,
  sub,
  tone = "neutral",
  emphasis,
  compact,
  strikethrough,
}: FlowNodeProps) {
  return (
    <div
      className={`flow-node tone-${tone} ${emphasis ? "is-emphasis" : ""} ${compact ? "is-compact" : ""} ${strikethrough ? "is-strike" : ""}`}
    >
      <div className="flow-node-icon">
        <Icon name={icon} size={compact ? 16 : 20} />
      </div>
      <div className="flow-node-body">
        <div className={compact ? "body-300" : "heading-300"}>{label}</div>
        <div className="body-200 muted">{sub}</div>
      </div>
    </div>
  );
}

function FlowArrow({ branch }: { branch?: boolean }) {
  return (
    <div className={`flow-arrow ${branch ? "is-branch" : ""}`} aria-hidden="true">
      {branch ? (
        <svg width="100" height="30" viewBox="0 0 100 30" fill="none">
          <path
            d="M50 0 V10 Q50 18 42 18 H10 M50 10 Q50 18 58 18 H90"
            stroke="rgb(var(--neutral-400))"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            fill="none"
          />
        </svg>
      ) : (
        <div className="flow-arrow-line" />
      )}
    </div>
  );
}

function formatCurrency(n: number | string | null | undefined): string {
  return `$${Number(n || 0).toLocaleString("en-US")}`;
}
