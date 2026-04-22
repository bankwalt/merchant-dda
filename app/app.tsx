import { useState } from "react";
import { PhoneChrome } from "./components/phone-chrome";
import { Intro } from "./screens/intro";
import { Review } from "./screens/review";
import { Agreements } from "./screens/agreements";
import { FundsFlow } from "./screens/funds-flow";
import { Activating } from "./screens/activating";
import { Success } from "./screens/success";
import { initialMerchant, type Applicant, type Business } from "./data/merchant";

type Step = "intro" | "review" | "agreements" | "funds" | "activating" | "success";

export default function App() {
  const [step, setStep] = useState<Step>("intro");
  const [merchant, setMerchant] = useState(initialMerchant);

  const goto = (next: Step) => setStep(next);
  const updateBusiness = (business: Business) => setMerchant((m) => ({ ...m, business }));
  const updateApplicant = (applicant: Applicant) => setMerchant((m) => ({ ...m, applicant }));

  return (
    <PhoneChrome>
      {step === "intro" && <Intro onContinue={() => goto("review")} />}
      {step === "review" && (
        <Review
          merchant={merchant}
          onUpdateBusiness={updateBusiness}
          onUpdateApplicant={updateApplicant}
          onBack={() => goto("intro")}
          onContinue={() => goto("agreements")}
        />
      )}
      {step === "agreements" && (
        <Agreements onBack={() => goto("review")} onContinue={() => goto("funds")} />
      )}
      {step === "funds" && (
        <FundsFlow onBack={() => goto("agreements")} onActivate={() => goto("activating")} />
      )}
      {step === "activating" && (
        <Activating onDone={() => goto("success")} onBack={() => goto("funds")} />
      )}
      {step === "success" && (
        <Success onOpenDashboard={() => goto("intro")} onRestart={() => goto("intro")} />
      )}
    </PhoneChrome>
  );
}
