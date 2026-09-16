import { useEffect, useState, useRef } from 'react';
import { ChevronLeft, CheckCircle2, Circle, ShieldCheck, ArrowRight } from 'lucide-react';
import { runOCRScan, generateInstantOCRResult, OCRProgress, OCRAnalysisResult } from '../../services/ocrService';

interface ProcessingScannerProps {
  capturedImage: string;
  onScanComplete: (result: OCRAnalysisResult) => void;
  onBack?: () => void;
}

export function ProcessingScanner({ capturedImage, onScanComplete, onBack }: ProcessingScannerProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [ocrProgress, setOcrProgress] = useState<number>(10);
  const [statusMessage, setStatusMessage] = useState('Reading captured document...');
  const [showSkipButton, setShowSkipButton] = useState(false);

  // Keep a ref to onScanComplete to avoid stale closure or triggering effect reruns
  const onScanCompleteRef = useRef(onScanComplete);
  onScanCompleteRef.current = onScanComplete;

  const steps = [
    "Reading captured document",
    "Initializing Tesseract.js engine",
    "Extracting text (OCR)",
    "Parsing fields & matching profile"
  ];

  // Handler to skip OCR wait and instantly proceed with extracted profile fields
  const handleInstantProceed = () => {
    const fallback = generateInstantOCRResult(capturedImage);
    onScanCompleteRef.current(fallback);
  };

  useEffect(() => {
    let isCancelled = false;

    // Show manual skip button after 3 seconds in case network is slow
    const skipTimer = setTimeout(() => {
      if (!isCancelled) setShowSkipButton(true);
    }, 3000);

    // Step 0 -> Step 1 transition
    const step1Timer = setTimeout(() => {
      if (!isCancelled) {
        setActiveStep(1);
        setOcrProgress(prev => Math.max(prev, 25));
        setStatusMessage('Loading Tesseract OCR engine (WASM)...');
      }
    }, 400);

    // Smooth progress simulation while Tesseract is initializing
    const progressInterval = setInterval(() => {
      if (!isCancelled) {
        setOcrProgress(prev => {
          if (prev < 75) return prev + 5;
          return prev;
        });
      }
    }, 350);

    // Run Tesseract OCR
    const executeScan = async () => {
      try {
        const result = await runOCRScan(
          capturedImage,
          (progress: OCRProgress) => {
            if (isCancelled) return;
            const pct = Math.round((progress.progress || 0) * 100);
            if (pct > 0) {
              setOcrProgress(pct);
            }
            if (progress.message) {
              setStatusMessage(progress.message);
            }
            if (progress.status === 'recognizing text') {
              setActiveStep(2);
            }
          }
        );

        if (isCancelled) return;

        clearInterval(progressInterval);
        setActiveStep(3);
        setOcrProgress(100);
        setStatusMessage('Form fields extracted successfully!');

        setTimeout(() => {
          if (!isCancelled) {
            onScanCompleteRef.current(result);
          }
        }, 600);
      } catch (err) {
        console.warn("Scan fallback triggered:", err);
        if (!isCancelled) {
          clearInterval(progressInterval);
          const fallback = generateInstantOCRResult(capturedImage);
          onScanCompleteRef.current(fallback);
        }
      }
    };

    executeScan();

    return () => {
      isCancelled = true;
      clearTimeout(skipTimer);
      clearTimeout(step1Timer);
      clearInterval(progressInterval);
    };
  }, [capturedImage]);

  return (
    <div className="flex flex-col h-full bg-white">
      <header className="flex items-center justify-center p-4 border-b border-gray-100 relative">
        {onBack && (
          <button onClick={onBack} className="absolute left-4 p-2 -ml-2 text-gray-900">
            <ChevronLeft size={24} />
          </button>
        )}
        <span className="font-bold text-gray-900 text-xl tracking-tight text-[#004B87]">
          Core<span className="text-red-500">T</span>
        </span>
      </header>
      
      <div className="p-6 flex-1 flex flex-col items-center overflow-y-auto">
        {/* Animated OCR Spinner */}
        <div className="relative w-20 h-20 mb-4 mt-1">
          <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#004B87] rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-[#004B87]">
              {ocrProgress}%
            </span>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-1 text-center">Processing Document</h2>
        <p className="text-gray-500 text-center mb-6 text-xs px-4 leading-relaxed font-medium">
          {statusMessage}
        </p>

        {/* Real Document Thumbnail with Scanning Laser Animation */}
        <div className="w-48 h-56 bg-gray-100 rounded-xl border-2 border-blue-200 mb-6 shadow-md relative overflow-hidden flex items-center justify-center">
          {capturedImage ? (
            <img 
              src={capturedImage} 
              alt="Scanning Document" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              Document Preview
            </div>
          )}

          {/* Scanning Overlay Grid */}
          <div className="absolute inset-0 bg-blue-900/10 pointer-events-none"></div>

          {/* Laser Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,1)] animate-[scan_2s_ease-in-out_infinite] pointer-events-none"></div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 h-2 rounded-full mb-6 overflow-hidden">
          <div 
            className="bg-[#004B87] h-full transition-all duration-300 ease-out rounded-full"
            style={{ width: `${ocrProgress}%` }}
          ></div>
        </div>

        {/* Progress Steps Checklist */}
        <div className="w-full space-y-3 px-2 mb-6">
          {steps.map((step, index) => {
            const isCompleted = index < activeStep || ocrProgress === 100;
            const isCurrent = index === activeStep && ocrProgress < 100;
            return (
              <div 
                key={index} 
                className={`flex items-center gap-3 transition-opacity duration-300 ${isCompleted || isCurrent ? 'opacity-100' : 'opacity-40'}`}
              >
                {isCompleted ? (
                  <CheckCircle2 size={20} className="text-green-500 shrink-0" />
                ) : isCurrent ? (
                  <div className="w-5 h-5 rounded-full border-2 border-[#004B87] flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 bg-[#004B87] rounded-full animate-pulse"></div>
                  </div>
                ) : (
                  <Circle size={20} className="text-gray-300 shrink-0" />
                )}
                <span className={`font-semibold text-xs ${isCompleted ? 'text-gray-900' : isCurrent ? 'text-[#004B87]' : 'text-gray-500'}`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        {/* Optional Skip Button if network is slow */}
        {showSkipButton && (
          <div className="w-full mb-4 animate-in fade-in duration-300">
            <button 
              onClick={handleInstantProceed}
              className="w-full bg-blue-50 hover:bg-blue-100 text-[#004B87] border border-blue-200 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <span>Instant Proceed with Scanned Form</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* Privacy & Vercel Serverless Notice */}
        <div className="mt-auto w-full flex items-center gap-2.5 bg-blue-50/60 p-3 rounded-xl border border-blue-100/80">
          <ShieldCheck size={18} className="text-[#004B87] shrink-0" />
          <p className="text-[11px] text-[#004B87] font-medium leading-tight">
            Client-Side Tesseract OCR • 100% Private • Ready for Vercel
          </p>
        </div>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0.9; }
          50% { top: 96%; opacity: 1; }
          100% { top: 0%; opacity: 0.9; }
        }
      `}</style>
    </div>
  );
}
