import { useEffect, useState } from 'react';
import { ChevronLeft, CheckCircle2, Circle } from 'lucide-react';

export function ProcessingScanner({ onNext }: { onNext: () => void }) {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    "Reading document",
    "Extracting text",
    "Identifying form fields",
    "Matching with your profile"
  ];

  useEffect(() => {
    if (activeStep < steps.length) {
      const timer = setTimeout(() => {
        setActiveStep(s => s + 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        onNext();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [activeStep, steps.length, onNext]);

  return (
    <div className="flex flex-col h-full bg-white">
      <header className="flex items-center justify-center p-4 border-b border-gray-100 relative">
        <button className="absolute left-4 p-2 -ml-2 text-gray-900">
          <ChevronLeft size={24} />
        </button>
        <span className="font-bold text-gray-900 text-xl tracking-tight text-[#004B87]">Core<span className="text-red-500">T</span></span>
      </header>
      
      <div className="p-6 flex-1 flex flex-col items-center overflow-y-auto">
        <div className="relative w-24 h-24 mb-6 mt-4">
           <div className="absolute inset-0 border-4 border-blue-50 rounded-full"></div>
           <div className="absolute inset-0 border-4 border-[#004B87] rounded-full border-t-transparent animate-spin"></div>
           <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-10 h-12 bg-blue-50 rounded flex items-center justify-center">
               <div className="w-6 h-1 bg-[#004B87] rounded"></div>
             </div>
           </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyzing your document</h2>
        <p className="text-gray-500 text-center mb-8 text-sm px-4 leading-relaxed">
          Our AI is reading the form and identifying fields. This may take a few seconds.
        </p>

        <div className="w-48 h-56 bg-[#F9FAFB] rounded-lg border border-gray-200 mb-10 shadow-sm relative overflow-hidden flex flex-col items-center p-4">
          <div className="w-10 h-12 bg-gray-200 rounded mb-4"></div>
          <div className="w-24 h-2 bg-gray-200 rounded mb-2"></div>
          <div className="w-32 h-2 bg-gray-200 rounded mb-6"></div>
          <div className="w-full space-y-2">
             <div className="w-full h-1 bg-gray-200 rounded"></div>
             <div className="w-5/6 h-1 bg-gray-200 rounded"></div>
             <div className="w-4/5 h-1 bg-gray-200 rounded"></div>
             <div className="w-full h-1 bg-gray-200 rounded"></div>
          </div>
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
        </div>

        <div className="w-full space-y-4 px-2">
          {steps.map((step, index) => {
            const isCompleted = index < activeStep;
            const isCurrent = index === activeStep;
            return (
              <div key={index} className={`flex items-center gap-3 ${isCompleted || isCurrent ? 'opacity-100' : 'opacity-40'}`}>
                {isCompleted ? (
                  <CheckCircle2 size={24} className="text-green-500" />
                ) : isCurrent ? (
                   <div className="w-6 h-6 rounded-full border-2 border-[#004B87] flex items-center justify-center shrink-0">
                     <div className="w-2 h-2 bg-[#004B87] rounded-full animate-pulse"></div>
                   </div>
                ) : (
                  <Circle size={24} className="text-gray-300" />
                )}
                <span className={`font-bold text-sm ${isCompleted ? 'text-gray-900' : isCurrent ? 'text-[#004B87]' : 'text-gray-500'}`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-auto pt-8 pb-2 w-full flex items-start gap-3 bg-blue-50/50 p-4 rounded-xl border border-blue-50">
          <div className="w-6 h-6 bg-[#004B87] rounded text-white flex items-center justify-center shrink-0">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          </div>
          <p className="text-xs text-[#004B87] font-medium leading-relaxed">Your document is processed securely. Your data remains private.</p>
        </div>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
      `}</style>
    </div>
  );
}
