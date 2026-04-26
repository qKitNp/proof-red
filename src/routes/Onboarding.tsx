import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { OnboardingShell } from "../components/onboarding/OnboardingShell";
import { StepWelcome } from "../components/onboarding/StepWelcome";
import { StepAccessibility } from "../components/onboarding/StepAccessibility";
import { StepLicenseKey } from "../components/onboarding/StepLicenseKey";
import { StepShortcutDemo } from "../components/onboarding/StepShortcutDemo";

const STEPS = ["welcome", "accessibility", "license", "demo"] as const;
type StepId = (typeof STEPS)[number];

export const ONBOARDING_FLAG = "grammarlol:onboarded";

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState<StepId>("welcome");
  const idx = STEPS.indexOf(step);

  function finish() {
    localStorage.setItem(ONBOARDING_FLAG, "1");
    onComplete();
  }

  return (
    <OnboardingShell step={idx} total={STEPS.length}>
      <AnimatePresence mode="wait">
        {step === "welcome" && (
          <StepWelcome key="welcome" onNext={() => setStep("accessibility")} />
        )}
        {step === "accessibility" && (
          <StepAccessibility key="accessibility" onNext={() => setStep("license")} />
        )}
        {step === "license" && (
          <StepLicenseKey key="license" onNext={() => setStep("demo")} />
        )}
        {step === "demo" && (
          <StepShortcutDemo key="demo" onFinish={finish} />
        )}
      </AnimatePresence>
    </OnboardingShell>
  );
}
