import { useState } from 'react';
import { StartScanner } from './Scanner/StartScanner';
import { CameraScanner } from './Scanner/CameraScanner';
import { ProcessingScanner } from './Scanner/ProcessingScanner';
import { AnalysisResults } from './Scanner/AnalysisResults';
import { FormCompletion } from './Scanner/FormCompletion';
import { OCRAnalysisResult, defaultUserProfile } from '../services/ocrService';

interface ScannerViewProps {
  onComplete: () => void;
}

export function ScannerView({ onComplete }: ScannerViewProps) {
  const [step, setStep] = useState(1);
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [scanResult, setScanResult] = useState<OCRAnalysisResult | null>(null);

  // When image is captured from camera
  const handleCameraCapture = (imageDataUrl: string) => {
    setCapturedImage(imageDataUrl);
    setStep(3); // Go to Processing / OCR
  };

  // When an image is picked from file upload / demo form
  const handleImageSelected = (imageDataUrl: string) => {
    setCapturedImage(imageDataUrl);
    setStep(3); // Go to Processing / OCR
  };

  // When OCR scan completes in ProcessingScanner
  const handleScanComplete = (result: OCRAnalysisResult) => {
    setScanResult(result);
    setStep(4); // Go to Analysis Results
  };

  const handleBack = () => {
    if (step === 1) {
      onComplete();
    } else if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(capturedImage ? 2 : 1);
    } else if (step === 4) {
      setStep(2);
    } else if (step === 5) {
      setStep(4);
    }
  };

  return (
    <div className="h-full w-full bg-white flex flex-col">
      {step === 1 && (
        <StartScanner 
          onNext={() => setStep(2)} 
          onBack={handleBack} 
          onImageSelected={handleImageSelected} 
        />
      )}

      {step === 2 && (
        <CameraScanner 
          onCapture={handleCameraCapture} 
          onBack={handleBack} 
        />
      )}

      {step === 3 && (
        <ProcessingScanner 
          capturedImage={capturedImage} 
          onScanComplete={handleScanComplete} 
          onBack={handleBack} 
        />
      )}

      {step === 4 && scanResult && (
        <AnalysisResults 
          result={scanResult} 
          onNext={() => setStep(5)} 
          onBack={handleBack} 
        />
      )}

      {step === 5 && scanResult && (
        <FormCompletion 
          result={scanResult} 
          onComplete={onComplete} 
          onBack={handleBack} 
        />
      )}
    </div>
  );
}
