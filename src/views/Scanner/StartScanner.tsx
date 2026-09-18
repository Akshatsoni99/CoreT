import { useRef, ChangeEvent } from 'react';
import { ChevronLeft, Camera, Image as ImageIcon, ChevronRight, FileText } from 'lucide-react';
import WithdrawalSlipImg from '../../assets/withdrawal-slip.png';

interface StartScannerProps {
  onNext: () => void;
  onBack: () => void;
  onImageSelected: (imageDataUrl: string) => void;
}

export function StartScanner({ onNext, onBack, onImageSelected }: StartScannerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onImageSelected(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Test with real blank withdrawal slip asset
  const handleUseRealBankSlip = () => {
    onImageSelected(WithdrawalSlipImg);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <header className="flex items-center p-4 border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-900">
          <ChevronLeft size={24} />
        </button>
      </header>
      
      <div className="p-6 flex-1 overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Scan a Form</h1>
        <p className="text-gray-500 mb-8 text-xs leading-relaxed">
          Scan or upload any official bank slip or citizen form to extract fields dynamically using on-device OCR intelligence.
        </p>

        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileChange} 
        />

        <div className="space-y-4">
          <button 
            onClick={onNext} 
            className="w-full bg-white border border-gray-200 rounded-2xl p-4 flex items-center text-left hover:border-blue-500 hover:bg-blue-50/50 transition-all group shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mr-4 group-hover:bg-[#004B87] group-hover:text-white transition-colors">
              <Camera size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">Use Camera</h3>
              <p className="text-xs text-gray-500">Scan physical paper document</p>
            </div>
            <ChevronRight size={20} className="text-gray-400 group-hover:text-blue-600" />
          </button>

          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="w-full bg-white border border-gray-200 rounded-2xl p-4 flex items-center text-left hover:border-green-500 hover:bg-green-50/50 transition-all group shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mr-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
              <ImageIcon size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">Upload from Device</h3>
              <p className="text-xs text-gray-500">Select an image from gallery</p>
            </div>
            <ChevronRight size={20} className="text-gray-400 group-hover:text-green-600" />
          </button>

          <button 
            onClick={handleUseRealBankSlip} 
            className="w-full bg-blue-50/50 border border-blue-200 rounded-2xl p-4 flex items-center text-left hover:bg-blue-100/60 transition-all group shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#004B87] flex items-center justify-center mr-4 group-hover:bg-[#004B87] group-hover:text-white transition-colors">
              <FileText size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">Try Real Bank Slip</h3>
              <p className="text-xs text-gray-500">Analyze official Bank of India withdrawal slip</p>
            </div>
            <ChevronRight size={20} className="text-gray-400 group-hover:text-blue-700" />
          </button>
        </div>

        <div className="mt-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">OCR Document Engine</p>
          <p className="text-xs font-bold text-gray-900 mb-1">On-Device Tesseract.js (WASM)</p>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            All document analysis runs 100% inside your browser. No documents are uploaded to external servers, protecting your privacy.
          </p>
        </div>
      </div>
    </div>
  );
}
