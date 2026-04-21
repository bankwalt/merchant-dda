import { useState } from 'react'
import { PhoneChrome } from './components/PhoneChrome.jsx'
import { Intro } from './screens/Intro.jsx'
import { Review } from './screens/Review.jsx'
import { Agreements } from './screens/Agreements.jsx'
import { FundsFlow } from './screens/FundsFlow.jsx'
import { Activating } from './screens/Activating.jsx'
import { Success } from './screens/Success.jsx'
import { initialMerchant } from './data/merchant.js'

export default function App() {
  const [step, setStep] = useState('intro')
  const [merchant, setMerchant] = useState(initialMerchant)

  const goto = (next) => setStep(next)
  const updateBusiness = (business) => setMerchant((m) => ({ ...m, business }))
  const updateApplicant = (applicant) => setMerchant((m) => ({ ...m, applicant }))

  return (
    <PhoneChrome>
      {step === 'intro' && <Intro onContinue={() => goto('review')} />}
      {step === 'review' && (
        <Review
          merchant={merchant}
          onUpdateBusiness={updateBusiness}
          onUpdateApplicant={updateApplicant}
          onBack={() => goto('intro')}
          onContinue={() => goto('agreements')}
        />
      )}
      {step === 'agreements' && (
        <Agreements onBack={() => goto('review')} onContinue={() => goto('funds')} />
      )}
      {step === 'funds' && (
        <FundsFlow onBack={() => goto('agreements')} onActivate={() => goto('activating')} />
      )}
      {step === 'activating' && <Activating onDone={() => goto('success')} />}
      {step === 'success' && (
        <Success
          onOpenDashboard={() => goto('intro')}
          onRestart={() => goto('intro')}
        />
      )}
    </PhoneChrome>
  )
}
