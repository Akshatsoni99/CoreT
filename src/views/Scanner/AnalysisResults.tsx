import { ChevronLeft, ArrowRight, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export function AnalysisResults({ onNext, onBack }: { onNext: () => void, onBack: () => void }) {
  return (
    <div className="flex flex-col h-full bg-[#F9FAFB]">
      <header className="flex items-center justify-center p-4 bg-white relative">
        <button onClick={onBack} className="absolute left-4 p-2 -ml-2 text-gray-900">
          <ChevronLeft size={24} />
        </button>
        <span className="font-bold text-gray-900 text-xl tracking-tight text-[#004B87]">Core<span className="text-red-500">T</span></span>
      </header>
      
      <div className="flex-1 overflow-y-auto">
        <div className="bg-white p-6 rounded-b-3xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] mb-6">
          <div className="flex gap-4">
            <div className="w-24 h-32 bg-gray-50 rounded-lg border border-gray-200 shadow-sm shrink-0 flex flex-col items-center p-2 relative overflow-hidden">
               <div className="w-6 h-8 bg-gray-200 rounded-sm mb-2"></div>
               <div className="w-16 h-1 bg-gray-200 rounded mb-1"></div>
               <div className="w-20 h-1 bg-gray-200 rounded mb-2"></div>
               <div className="w-full space-y-1 mt-2">
                 <div className="w-full h-0.5 bg-gray-200"></div>
                 <div className="w-5/6 h-0.5 bg-gray-200"></div>
                 <div className="w-4/5 h-0.5 bg-gray-200"></div>
               </div>
               <div className="absolute top-2 right-2 bg-green-100 text-green-700 text-[8px] font-bold px-1.5 py-0.5 rounded-sm">Form Identified</div>
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-gray-900 leading-tight mb-1">Income Certificate Application Form</h2>
              <p className="text-xs text-gray-500 mb-4 font-medium">Government of Madhya Pradesh</p>
              
              <div className="space-y-2 text-xs font-medium">
                <div className="flex justify-between border-b border-gray-100 pb-1">
                  <span className="text-gray-500">Form Type</span>
                  <span className="text-gray-900">Service Application</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1">
                  <span className="text-gray-500">Pages</span>
                  <span className="text-gray-900">2</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1">
                  <span className="text-gray-500">Language</span>
                  <span className="text-gray-900">English</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Detected Fields</span>
                  <span className="text-gray-900">12 (9 required, 3 optional)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-bold text-gray-900">Field Analysis</h3>
             <button className="text-[#004B87] text-sm font-bold">See All</button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
            <div className="p-4 flex gap-3">
              <div className="mt-0.5 shrink-0">
                <CheckCircle2 size={24} className="text-green-500" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">9 fields can be auto-filled</h4>
                <p className="text-xs text-gray-500">From your saved profile</p>
              </div>
            </div>
            
            <div className="p-4 flex gap-3 bg-orange-50/50">
              <div className="mt-0.5 shrink-0">
                <AlertTriangle size={24} className="text-orange-500" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">2 fields need your input</h4>
                <p className="text-xs text-gray-500">e.g. Purpose, Annual Income</p>
              </div>
            </div>

            <div className="p-4 flex gap-3 bg-blue-50/50">
              <div className="mt-0.5 shrink-0">
                <Info size={24} className="text-blue-500" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">1 field needs review</h4>
                <p className="text-xs text-gray-500">Document unclear</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-white border-t border-gray-100">
        <button onClick={onNext} className="w-full bg-[#004B87] hover:bg-blue-800 text-white rounded-full py-4 font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#004B87]/30">
          Continue to Fill Form <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
