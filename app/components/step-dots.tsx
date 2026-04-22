interface StepDotsProps {
  current: number;
  total: number;
  label?: string;
}

export function StepDots({ current, total, label = "Onboarding" }: StepDotsProps) {
  return (
    <div
      className="step-dots"
      role="group"
      aria-label={`${label}, step ${current + 1} of ${total}`}
    >
      {Array.from({ length: total }).map((_, i) => {
        const state = i === current ? "active" : i < current ? "done" : "";
        return (
          <span
            key={i}
            className={`step-dot ${state}`}
            aria-current={i === current ? "step" : undefined}
            aria-hidden={i !== current}
          />
        );
      })}
    </div>
  );
}
