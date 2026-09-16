import { useState } from 'react';
import { StartScanner } from './Scanner/StartScanner';
import { CameraScanner } from './Scanner/CameraScanner';
import { ProcessingScanner } from './Scanner/ProcessingScanner';
import { AnalysisResults } from './Scanner/AnalysisResults';
import { FormCompletion } from './Scanner/FormCompletion';

interface ScannerViewProps {
  onComplete: () => void;
}

export function ScannerView({ onComplete }: ScannerViewProps) {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep(s => s + 1);
  const backStep = () => {
    if (step === 1) onComplete();
    else setStep(s => s - 1);
  };

  return (
    <div className="h-full w-full bg-white flex flex-col">
      {step === 1 && <StartScanner onNext={nextStep} onBack={backStep} />}
      {step === 2 && <CameraScanner onNext={nextStep} onBack={backStep} />}
      {step === 3 && <ProcessingScanner onNext={nextStep} />}
      {step === 4 && <AnalysisResults onNext={nextStep} onBack={backStep} />}
      {step === 5 && <FormCompletion onComplete={onComplete} onBack={backStep} />}
    </div>
  );
}
