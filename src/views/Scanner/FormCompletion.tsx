import { useState } from 'react';
import { ChevronLeft, Check, CheckCircle2, ArrowRight } from 'lucide-react';
import { OCRAnalysisResult, ExtractedFormField } from '../../services/ocrService';

interface FormCompletionProps {
  result: OCRAnalysisResult;
  onComplete: () => void;
  onBack: () => void;
}

export function FormCompletion({ result, onComplete, onBack }: FormCompletionProps) {
  const [fields, setFields] = useState<ExtractedFormField[]>(result.fields);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentField = fields[currentIdx] || fields[0];
  const progressPercent = Math.round(((currentIdx + 1) / fields.length) * 100);

  const handleFieldValueChange = (val: string) => {
    setFields(prev => prev.map((f, i) => i === currentIdx ? { ...f, value: val } : f));
  };

  const handleUseSuggestion = () => {
    if (currentField?.suggestedValue) {
      handleFieldValueChange(currentField.suggestedValue);
    }
  };

  const handleNext = () => {
    if (currentIdx < fields.length - 1) {
      setCurrentIdx(i => i + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(i => i - 1);
    } else {
      onBack();
    }
  };

  if (isCompleted) {
    return (
      <div className="flex flex-col h-full bg-white p-6 items-center justify-center text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-200">
          <CheckCircle2 size={42} strokeWidth={2.5} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Form Ready for Submission</h2>
        <p className="text-gray-500 text-sm mb-8 max-w-xs leading-relaxed">
          All {fields.length} fields for <span className="font-semibold text-gray-800">{result.documentType}</span> have been completed and verified using OCR.
        </p>

        <div className="w-full bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-8 divide-y divide-gray-200/60 text-left max-h-56 overflow-y-auto text-xs">
          {fields.map((f, i) => (
            <div key={i} className="py-2.5 flex justify-between items-center">
              <span className="text-gray-500 font-medium">{f.label}</span>
              <span className="text-gray-900 font-bold truncate max-w-[55%] text-right">{f.value || '—'}</span>
            </div>
          ))}
        </div>

        <button 
          onClick={onComplete}
          className="w-full bg-[#004B87] hover:bg-blue-800 text-white rounded-full py-4 font-bold transition-all shadow-lg shadow-[#004B87]/30"
        >
          Done & Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center w-1/3">
          <button onClick={handlePrev} className="p-2 -ml-2 text-gray-900">
            <ChevronLeft size={24} />
          </button>
        </div>
        <span className="font-bold text-gray-900 text-sm w-1/3 text-center truncate">
          {result.documentType}
        </span>
        <span className="text-xs font-bold text-gray-500 w-1/3 text-right">
          {currentIdx + 1} of {fields.length}
        </span>
      </header>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-100 h-1.5">
        <div 
          className="bg-[#004B87] h-1.5 rounded-r-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* Field Input Content */}
      <div className="p-6 flex-1 overflow-y-auto">
        <div className="flex justify-between items-end mb-2">
          <h2 className="text-xl font-bold text-gray-900">
            {currentField.label} <span className="text-red-500">*</span>
          </h2>
          <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
            {currentField.source === 'ocr' ? 'Scanned from Form' : 'Matched from Profile'}
          </span>
        </div>
        <p className="text-gray-500 text-xs mb-6 leading-relaxed">
          Verify and adjust this value as needed for the official application.
        </p>

        {/* Input box */}
        <div className="relative mb-6">
          <input 
            type="text" 
            value={currentField.value}
            onChange={(e) => handleFieldValueChange(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 text-base font-bold text-gray-900 focus:outline-none focus:border-[#004B87] transition-colors bg-white shadow-sm"
            placeholder={`Enter ${currentField.label}`}
          />
          {currentField.value && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white">
              <Check size={16} strokeWidth={3} />
            </div>
          )}
        </div>

        {/* Suggested value from Profile / OCR if not already filled */}
        {currentField.suggestedValue && currentField.value !== currentField.suggestedValue && (
          <div className="bg-green-50/70 border border-green-200/80 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <div className="w-9 h-9 bg-green-100 text-green-700 rounded-full flex items-center justify-center shrink-0">
                <CheckCircle2 size={18} />
              </div>
              <div className="truncate">
                <p className="text-[10px] text-green-800 font-bold">Suggested value</p>
                <p className="text-sm font-bold text-gray-900 truncate">{currentField.suggestedValue}</p>
              </div>
            </div>
            <button 
              onClick={handleUseSuggestion}
              className="text-[#004B87] text-xs font-bold bg-white px-3.5 py-2 rounded-lg border border-gray-200 shadow-sm shrink-0 hover:bg-blue-50 transition-colors"
            >
              Use this
            </button>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="p-6 bg-white border-t border-gray-100 flex gap-3">
        <button 
          onClick={handlePrev} 
          className="w-1/3 py-3.5 text-gray-700 font-bold bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
        >
          {currentIdx === 0 ? 'Back' : 'Previous'}
        </button>
        <button 
          onClick={handleNext}
          className="flex-1 bg-[#004B87] hover:bg-blue-800 text-white rounded-full py-3.5 font-bold flex items-center justify-center gap-2 text-sm transition-all shadow-lg shadow-[#004B87]/30"
        >
          {currentIdx === fields.length - 1 ? 'Finish & Review' : 'Next Field'}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
