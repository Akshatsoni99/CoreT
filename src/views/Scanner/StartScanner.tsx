import { ChevronLeft, Camera, Image as ImageIcon, ChevronRight } from 'lucide-react';

export function StartScanner({ onNext, onBack }: { onNext: () => void, onBack: () => void }) {
  return (
    <div className="flex flex-col h-full bg-white">
      <header className="flex items-center p-4 border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-900">
          <ChevronLeft size={24} />
        </button>
      </header>
      
      <div className="p-6 flex-1">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Scan a Form</h1>
        <p className="text-gray-500 mb-8">Capture a government form to automatically extract and fill the details.</p>

        <div className="space-y-4">
          <button onClick={onNext} className="w-full bg-white border border-gray-200 rounded-2xl p-4 flex items-center text-left hover:border-blue-500 hover:bg-blue-50/50 transition-all group shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mr-4 group-hover:bg-[#004B87] group-hover:text-white transition-colors">
              <Camera size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">Use Camera</h3>
              <p className="text-sm text-gray-500">Scan a physical form</p>
            </div>
            <ChevronRight size={20} className="text-gray-400 group-hover:text-blue-600" />
          </button>

          <button className="w-full bg-white border border-gray-200 rounded-2xl p-4 flex items-center text-left hover:border-green-500 hover:bg-green-50/50 transition-all group shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mr-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
              <ImageIcon size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">Upload from Device</h3>
              <p className="text-sm text-gray-500">Select a PDF or image file</p>
            </div>
            <ChevronRight size={20} className="text-gray-400 group-hover:text-green-600" />
          </button>
        </div>

        <div className="mt-12 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Supported formats</p>
          <p className="text-sm font-bold text-gray-900 mb-4">PDF, JPG, PNG</p>
          <p className="text-sm text-gray-500">Best results with clear, well-lit images.</p>
        </div>
      </div>
    </div>
  );
}
