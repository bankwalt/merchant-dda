import { Icon } from '../components/Icon.jsx'

export function Success({ onOpenDashboard, onRestart }) {
  return (
    <div className="screen success-screen">
      <div className="success-confetti" aria-hidden="true" />

      <div className="screen-body stack-lg" style={{ paddingTop: 60 }}>
        <div className="success-icon">
          <Icon name="Check circle" size={56} color="rgb(var(--success-500))" />
        </div>

        <div style={{ textAlign: 'center' }}>
          <h1 className="heading-600" style={{ margin: 0 }}>
            You're all set.
          </h1>
          <p className="body-500 muted" style={{ margin: '8px 0 0' }}>
            Your Partner Business Anywhere and Savings accounts are open.
          </p>
        </div>

        <div className="success-cards">
          <AccountCard
            label="Business Anywhere"
            mask="••4201"
            amount="$0.00"
            apy="0.00% APY"
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
  )
}

function AccountCard({ label, mask, amount, apy, highlight }) {
  return (
    <div className={`account-card ${highlight ? 'is-highlight' : ''}`}>
      <div className="body-300 muted">{label}</div>
      <div className="heading-500" style={{ marginTop: 4 }}>
        {amount}
      </div>
      <div className="account-card-meta">
        <span className="body-200 muted">{mask}</span>
        <span
          className="body-300"
          style={{ color: highlight ? 'rgb(var(--success-700))' : 'rgb(var(--neutral-600))' }}
        >
          {apy}
        </span>
      </div>
      <div className="legal-text muted" style={{ marginTop: 6 }}>
        First Internet Bank, Member FDIC · Routing 074920912
      </div>
    </div>
  )
}

function VirtualCard({ mask, network }) {
  const addToAppleWallet = () => {
    // TODO: call Lithic push provisioning → pass encrypted payload to native iOS In-App Provisioning SDK
  }
  const addToGoogleWallet = () => {
    // TODO: call Lithic push provisioning → Google Pay Push Provisioning API
  }

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
          <button className="wallet-btn wallet-btn-apple" onClick={addToAppleWallet}>
            <Icon name="Wallet" size={18} color="rgb(var(--white))" />
            Add to Apple Wallet
          </button>
          <button className="wallet-btn wallet-btn-google" onClick={addToGoogleWallet}>
            <Icon name="Wallet" size={18} />
            Add to Google Wallet
          </button>
        </div>

        <div className="legal-text muted virtual-card-disclaimer">
          <Icon name="Lock closed" size={12} /> Card number never leaves your issuer.
        </div>
      </div>
    </div>
  )
}

function NextItem({ icon, title, sub }) {
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
  )
}
