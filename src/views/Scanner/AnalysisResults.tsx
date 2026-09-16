import { useState } from 'react';
import { ChevronLeft, ArrowRight, CheckCircle2, AlertTriangle, Info, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { OCRAnalysisResult } from '../../services/ocrService';

interface AnalysisResultsProps {
  result: OCRAnalysisResult;
  onNext: () => void;
  onBack: () => void;
}

export function AnalysisResults({ result, onNext, onBack }: AnalysisResultsProps) {
  const [showRawText, setShowRawText] = useState(false);

  const autoFilledFields = result.fields.filter(f => f.status === 'auto-filled');
  const needsInputFields = result.fields.filter(f => f.status === 'needs-input');
  const reviewFields = result.fields.filter(f => f.status === 'review');

  return (
    <div className="flex flex-col h-full bg-[#F9FAFB]">
      <header className="flex items-center justify-center p-4 bg-white relative border-b border-gray-100">
        <button onClick={onBack} className="absolute left-4 p-2 -ml-2 text-gray-900">
          <ChevronLeft size={24} />
        </button>
        <span className="font-bold text-gray-900 text-xl tracking-tight text-[#004B87]">
          Core<span className="text-red-500">T</span>
        </span>
      </header>
      
      <div className="flex-1 overflow-y-auto">
        {/* Document Overview Header Card */}
        <div className="bg-white p-6 rounded-b-3xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] mb-6">
          <div className="flex gap-4 items-start">
            {/* Real Captured Image Thumbnail */}
            <div className="w-24 h-32 bg-gray-100 rounded-xl border border-gray-200 shadow-sm shrink-0 overflow-hidden relative">
              {result.capturedImage ? (
                <img 
                  src={result.capturedImage} 
                  alt="Scanned Form" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <FileText size={28} />
                </div>
              )}
              <div className="absolute top-1 right-1 bg-green-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow">
                OCR OK
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-1 bg-blue-50 text-[#004B87] text-[10px] font-bold px-2 py-0.5 rounded mb-1.5">
                <span>Tesseract.js</span> • <span>{result.confidence}% Confidence</span>
              </div>
              <h2 className="text-base font-extrabold text-gray-900 leading-tight mb-1">
                {result.documentType}
              </h2>
              <p className="text-xs text-gray-500 mb-3 font-medium">
                {result.issuingAuthority}
              </p>
              
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between border-b border-gray-100 pb-1">
                  <span className="text-gray-500">Language</span>
                  <span className="text-gray-900 font-semibold">{result.language}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1">
                  <span className="text-gray-500">Total Fields</span>
                  <span className="text-gray-900 font-semibold">{result.fields.length} detected</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Field Analysis Categories */}
        <div className="px-6 pb-6 space-y-4">
          <div className="flex justify-between items-center">
             <h3 className="text-base font-bold text-gray-900">OCR Field Breakdown</h3>
             <span className="text-xs font-semibold text-[#004B87]">
               {autoFilledFields.length} Ready
             </span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
            {/* Auto-filled count */}
            <div className="p-4 flex gap-3 items-center">
              <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                <CheckCircle2 size={22} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-sm">
                  {autoFilledFields.length} fields can be auto-filled
                </h4>
                <p className="text-xs text-gray-500">
                  {autoFilledFields.map(f => f.label).slice(0, 3).join(', ')}...
                </p>
              </div>
            </div>
            
            {/* Needs input count */}
            {needsInputFields.length > 0 && (
              <div className="p-4 flex gap-3 items-center bg-orange-50/40">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <AlertTriangle size={22} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-sm">
                    {needsInputFields.length} field{needsInputFields.length > 1 ? 's' : ''} need your input
                  </h4>
                  <p className="text-xs text-gray-500">
                    {needsInputFields.map(f => f.label).join(', ')}
                  </p>
                </div>
              </div>
            )}

            {/* Review count */}
            {reviewFields.length > 0 && (
              <div className="p-4 flex gap-3 items-center bg-blue-50/40">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Info size={22} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-sm">
                    {reviewFields.length} field{reviewFields.length > 1 ? 's' : ''} suggested for review
                  </h4>
                  <p className="text-xs text-gray-500">
                    {reviewFields.map(f => f.label).join(', ')}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Collapsible Raw OCR Inspection */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <button 
              onClick={() => setShowRawText(!showRawText)}
              className="w-full p-4 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-[#004B87]" />
                <span className="text-xs font-bold text-gray-800">
                  Inspect Raw OCR Extracted Text
                </span>
              </div>
              {showRawText ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
            </button>

            {showRawText && (
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <pre className="text-[11px] font-mono text-gray-700 whitespace-pre-wrap max-h-48 overflow-y-auto bg-white p-3 rounded-xl border border-gray-200">
                  {result.rawText || 'No plain text detected in document image.'}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="p-6 bg-white border-t border-gray-100">
        <button 
          onClick={onNext} 
          className="w-full bg-[#004B87] hover:bg-blue-800 text-white rounded-full py-4 font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#004B87]/30 active:scale-[0.99]"
        >
          Continue to Fill Form <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
