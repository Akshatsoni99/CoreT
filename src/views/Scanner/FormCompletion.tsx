import { ChevronLeft, Check } from 'lucide-react';
import { useState } from 'react';

export function FormCompletion({ onComplete, onBack }: { onComplete: () => void, onBack: () => void }) {
  const [suggestionAccepted, setSuggestionAccepted] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleUseSuggestion = () => {
    setInputValue('Rohan Sharma');
    setSuggestionAccepted(true);
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      <header className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center w-1/3">
          <button onClick={onBack} className="p-2 -ml-2 text-gray-900">
            <ChevronLeft size={24} />
          </button>
        </div>
        <span className="font-bold text-gray-900 text-sm w-1/3 text-center">Fill Form</span>
        <span className="text-xs font-bold text-gray-500 w-1/3 text-right">3 of 12</span>
      </header>
      
      <div className="w-full bg-gray-100 h-1">
        <div className="bg-[#004B87] h-1 rounded-r-full w-1/4"></div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        <div className="flex justify-between items-end mb-2">
          <h2 className="text-2xl font-bold text-gray-900">Full Name <span className="text-red-500">*</span></h2>
          <button className="text-[#004B87] text-sm font-bold mb-1">Need help?</button>
        </div>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          Enter your full name as mentioned in your government ID (e.g. Aadhaar, PAN).
        </p>

        <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200 flex items-start gap-4">
           <div className="w-1.5 h-10 bg-gray-300 rounded shrink-0"></div>
           <div className="flex-1">
             <p className="text-[10px] font-bold text-gray-500 mb-1">1. Personal Details</p>
             <div className="flex items-end justify-between w-4/5">
               <span className="text-xs text-gray-600 font-medium">Full Name</span>
               <span className="text-xs text-gray-400 font-mono">: ........................</span>
             </div>
           </div>
        </div>

        <div className="relative mb-6">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 text-lg font-bold text-gray-900 focus:outline-none focus:border-[#004B87] transition-colors bg-white"
            placeholder="Enter full name"
          />
          {suggestionAccepted && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white">
              <Check size={16} strokeWidth={3} />
            </div>
          )}
        </div>

        {!suggestionAccepted && (
          <div className="bg-green-50/50 border border-green-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
              <div>
                <p className="text-[10px] text-green-700 font-bold mb-0.5">Suggested from your profile</p>
                <p className="text-sm font-bold text-gray-900">Rohan Sharma</p>
              </div>
            </div>
            <button 
              onClick={handleUseSuggestion}
              className="text-[#004B87] text-xs font-bold bg-white px-4 py-2.5 rounded-lg border border-gray-200 shadow-sm shrink-0"
            >
              Use this
            </button>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-gray-100 flex gap-4">
        <button onClick={onBack} className="w-1/3 py-4 text-[#004B87] font-bold bg-blue-50 rounded-full">
          Back
        </button>
        <button 
          onClick={onComplete}
          className="flex-1 bg-[#004B87] hover:bg-blue-800 text-white rounded-full py-4 font-bold flex items-center justify-center transition-colors shadow-lg shadow-[#004B87]/30"
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
}
