interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabel: string;
}

export default function ProgressIndicator({ currentStep, totalSteps, stepLabel }: ProgressIndicatorProps) {
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div className="p-4 bg-soft-gray">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-primary">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm text-muted-foreground">{stepLabel}</span>
      </div>
      <div className="w-full bg-border rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={currentStep}
          aria-valuemin={1}
          aria-valuemax={totalSteps}
          aria-label={`Step ${currentStep} of ${totalSteps}: ${stepLabel}`}
        />
      </div>
    </div>
  );
}
