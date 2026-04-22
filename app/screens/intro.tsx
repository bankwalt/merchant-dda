import { Icon } from "../components/icon";

interface IntroProps {
  onContinue: () => void;
}

export function Intro({ onContinue }: IntroProps) {
  return (
    <div className="screen welcome-screen">
      <div className="welcome-top">
        <div className="welcome-brand">
          <div className="welcome-brand-mark">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M3 7.5L5.6 10 11 4.5"
                stroke="#fff"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="body-400 muted-strong">Brightside Coffee</span>
        </div>
        <div className="new-pill">
          <Icon name="Sparkles" size={12} color="rgb(var(--primary-500))" />
          <span>New</span>
        </div>
      </div>

      <div className="screen-body welcome-body">
        <div>
          <h1 className="welcome-title">
            Welcome to
            <br />
            Business Anywhere.
          </h1>
          <p className="welcome-sub">Your settlements, set free.</p>
        </div>

        <div className="welcome-hero">
          <div className="welcome-hero-glow welcome-hero-glow-blue" aria-hidden="true" />
          <div className="welcome-hero-glow welcome-hero-glow-teal" aria-hidden="true" />

          <VirtualDebitCard mask="5525" />

          <div className="welcome-hero-copy">
            <div className="welcome-hero-headline">
              Spend the second
              <br />
              your settlements post.
            </div>
            <p className="welcome-hero-body">
              No transfer delays. Your virtual debit card works the moment funds clear — tap to
              pay, add to Apple or Google Wallet.
            </p>
          </div>

          <TimeCompare />
        </div>

        <SavingsCompareHero />
      </div>

      <div className="screen-footer">
        <button className="btn btn-primary" onClick={onContinue}>
          Get started
          <Icon name="Arrow right" size={18} />
        </button>
        <p className="legal-text muted" style={{ textAlign: "center", margin: "12px 0 0" }}>
          Partner is a financial technology company, not a bank. Banking services provided by
          First Internet Bank, Member FDIC. Deposits insured up to $250,000.
        </p>
      </div>
    </div>
  );
}

function VirtualDebitCard({ mask }: { mask: string }) {
  return (
    <div className="welcome-card">
      <div className="welcome-card-base" aria-hidden="true" />
      <div className="welcome-card-sheen" aria-hidden="true" />
      <div className="welcome-card-highlight" aria-hidden="true" />

      <div className="welcome-card-inner">
        <div className="welcome-card-top">
          <div>
            <div className="welcome-card-eyebrow">Business Anywhere</div>
            <div className="welcome-card-holder">Brightside Coffee</div>
          </div>
          <ContactlessGlyph />
        </div>

        <div className="welcome-card-chip">
          <span className="welcome-card-chip-dot" aria-hidden="true" />
          Available now
        </div>

        <div className="welcome-card-bottom">
          <div>
            <div className="welcome-card-mask">•••• {mask}</div>
            <div className="welcome-card-label">VIRTUAL DEBIT</div>
          </div>
          <div className="welcome-card-network">Visa</div>
        </div>
      </div>
    </div>
  );
}

function ContactlessGlyph() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      aria-hidden="true"
      className="welcome-card-contactless"
    >
      <path
        d="M6 4.5c3 2.4 3 11.6 0 14"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M10 3c4.5 3.5 4.5 13.5 0 17"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M14 1.5c6 4.5 6 15.5 0 20"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function TimeCompare() {
  return (
    <div className="welcome-time-compare">
      <div className="welcome-time-row">
        <span className="welcome-time-label">Traditional bank</span>
        <span className="welcome-time-value">1–3 days</span>
      </div>
      <div className="welcome-time-divider" aria-hidden="true" />
      <div className="welcome-time-row is-you">
        <span className="welcome-time-label">Business Anywhere</span>
        <span className="welcome-time-value">Instant</span>
      </div>
    </div>
  );
}

function SavingsCompareHero() {
  return (
    <div className="welcome-hero welcome-hero-benefits">
      <div className="welcome-hero-glow welcome-hero-glow-lime" aria-hidden="true" />
      <div className="welcome-hero-glow welcome-hero-glow-forest" aria-hidden="true" />

      <div className="welcome-hero-copy">
        <div className="welcome-hero-eyebrow">Why Business Anywhere</div>
        <div className="welcome-hero-headline">
          Built for how
          <br />
          you actually run.
        </div>
      </div>

      <ul className="benefit-list">
        <BenefitRow
          icon="Badge check"
          title="No-fee banking"
          sub="No monthly fees. No balance minimum. Ever."
        />
        <BenefitRow
          icon="Trending up"
          title="2.00% APY savings"
          sub="8–200× higher than the top 5 US banks."
        />
        <BenefitRow
          icon="Cash"
          title="Spend without delay"
          sub="Settlements available the moment they clear."
        />
      </ul>
    </div>
  );
}

function BenefitRow({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  return (
    <li className="benefit-row">
      <span className="benefit-row-icon" aria-hidden="true">
        <Icon name={icon} size={18} color="#7fffb3" />
      </span>
      <div className="benefit-row-body">
        <div className="benefit-row-title">{title}</div>
        <div className="benefit-row-sub">{sub}</div>
      </div>
    </li>
  );
}
