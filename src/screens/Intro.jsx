import { Icon } from '../components/Icon.jsx'

export function Intro({ onContinue }) {
  return (
    <div className="screen">
      <div className="intro-hero">
        <div className="intro-logo">
          <img src="/jaris.svg" width="32" height="32" alt="Partner" />
          <span className="body-400 muted-strong">Brightside Coffee</span>
        </div>
        <div className="intro-badge">
          <Icon name="Sparkles" size={14} />
          <span>New</span>
        </div>
      </div>

      <div className="screen-body stack-xl" style={{ paddingTop: 16 }}>
        <div>
          <h1 className="heading-700" style={{ margin: 0, letterSpacing: '-0.01em' }}>
            Unlock your<br />Business Anywhere account.
          </h1>
          <p className="body-500 muted" style={{ margin: '12px 0 0' }}>
            Your settlements, set free.
          </p>
        </div>

        <div className="instant-hero">
          <div className="instant-hero-glow" aria-hidden="true" />
          <div className="instant-hero-eyebrow">
            <Icon name="Sparkles" size={14} color="rgb(var(--white))" />
            <span>The Partner difference</span>
          </div>
          <h2 className="instant-hero-title">
            Your settlements,
            <br />
            <em>the moment</em> they clear.
          </h2>
          <p className="instant-hero-sub">
            No added bank transfer delays. Swipe your debit card the second your settlements post.
          </p>

          <div className="settlement-compare">
            <div className="settlement-row">
              <span className="settlement-row-label">Traditional bank</span>
              <div className="settlement-bar">
                <div className="settlement-bar-fill is-slow" />
              </div>
              <span className="settlement-row-value">1–3 days</span>
            </div>
            <div className="settlement-row is-you">
              <span className="settlement-row-label">Business Anywhere</span>
              <div className="settlement-bar">
                <div className="settlement-bar-fill is-instant" />
              </div>
              <span className="settlement-row-value">Instant</span>
            </div>
          </div>
        </div>

        <div className="trust-pills">
          <div className="trust-pill">
            <Icon name="Shield check" size={16} color="rgb(var(--primary-700))" />
            <div>
              <div className="heading-100">FDIC insured</div>
              <div className="body-200 muted">Up to $250,000</div>
            </div>
          </div>
          <div className="trust-pill">
            <Icon name="Clock" size={16} color="rgb(var(--primary-700))" />
            <div>
              <div className="heading-100">24/7 access</div>
              <div className="body-200 muted">Move money any time</div>
            </div>
          </div>
        </div>

        <div className="intro-preview">
          <div className="intro-preview-row">
            <span className="body-300 muted">Business Anywhere</span>
            <span className="body-300" style={{ color: 'rgb(var(--success-700))' }}>
              0.00% APY
            </span>
          </div>
          <div className="heading-700" style={{ letterSpacing: '-0.01em' }}>
            $0.00
          </div>
          <div className="intro-preview-divider" />
          <div className="intro-preview-row">
            <span className="body-300 muted">Savings</span>
            <span className="body-300" style={{ color: 'rgb(var(--success-700))' }}>
              2.00% APY
            </span>
          </div>
          <div className="heading-400">$0.00</div>
          <div className="legal-text" style={{ color: 'rgb(var(--neutral-400))', marginTop: 6 }}>
            $50 minimum end-of-month balance to earn interest
          </div>
        </div>
      </div>

      <div className="screen-footer">
        <button className="btn btn-primary" onClick={onContinue}>
          Get started
          <Icon name="Arrow right" size={18} />
        </button>
        <p className="legal-text muted" style={{ textAlign: 'center', margin: '12px 0 0' }}>
          Partner is a financial technology company, not a bank. Banking
          services provided by First Internet Bank, Member FDIC. Deposits
          insured up to $250,000.
        </p>
      </div>
    </div>
  )
}
