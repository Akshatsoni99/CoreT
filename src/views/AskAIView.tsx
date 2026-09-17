import { useState } from 'react';
import { ChevronLeft, ChevronDown, Bot, Paperclip, Mic, Send, Globe } from 'lucide-react';
import AppLogo from '../assets/new-logo.png';

export function AskAIView() {
  const [selectedLang, setSelectedLang] = useState('हिंदी');
  const [showLangMenu, setShowLangMenu] = useState(false);

  const languages = ['English', 'हिंदी', 'मराठी', 'ગુજરાતી', 'বাংলা', 'தமிழ்', 'తెలుగు'];

  const suggestions = [
    "Withdrawal: How to fill a cash withdrawal slip?",
    "Deposit: What details are needed on deposit slip?",
    "Bank Transfer: What is IFSC code?",
    "How to get an income certificate?",
    "What documents are needed for Aadhaar e-KYC?"
  ];

  return (
    <div className="flex flex-col h-full bg-[#F9FAFB] relative">
      <header className="flex justify-between items-center px-4 pt-12 pb-4 bg-white border-b border-gray-100 shadow-sm z-20 relative">
        <div className="flex items-center gap-2">
          <button className="p-2 -ml-2 text-gray-900">
            <ChevronLeft size={24} />
          </button>
          <img src={AppLogo} alt="CoreT" className="h-7 object-contain" />
          <div className="flex flex-col ml-1">
            <span className="font-bold text-gray-900 text-sm leading-tight">RAAHA</span>
            <span className="text-[10px] text-gray-500 font-medium">Your banking guide</span>
          </div>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors"
          >
            <Globe size={14} className="text-[#004B87]" />
            <span>{selectedLang}</span>
            <ChevronDown size={14} />
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-2 w-36 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-30 animate-in fade-in zoom-in-95 duration-150">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setSelectedLang(lang);
                    setShowLangMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors ${
                    selectedLang === lang ? 'bg-blue-50 text-[#004B87] font-bold' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        <div className="flex gap-3 max-w-[85%]">
          <div className="w-8 h-8 rounded-full bg-[#004B87] text-white flex items-center justify-center shrink-0 shadow-md">
            <Bot size={18} />
          </div>
          <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm">
            <p className="text-gray-800 text-sm mb-3 leading-relaxed">
              <strong>Namaste! I'm RAAHA.</strong><br/>
              I'm your guide to help you fill bank forms step by step, understand government services, and navigate paperwork with confidence.
            </p>
            <ul className="space-y-2 mb-4 text-xs text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-[#004B87] mt-0.5 font-bold">✓</span> Filling Cash Withdrawal & Deposit Slips
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#004B87] mt-0.5 font-bold">✓</span> Bank Transfer & IFSC Assistance
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#004B87] mt-0.5 font-bold">✓</span> Required documents for government schemes
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#004B87] mt-0.5 font-bold">✓</span> Step-by-step guidance in simple words
              </li>
            </ul>
            <p className="text-gray-800 text-xs font-medium">How may I help you today?</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 mt-4">
          {suggestions.map((text, i) => (
            <button key={i} className="bg-white border border-blue-200 text-[#004B87] text-xs font-medium px-4 py-2.5 rounded-2xl rounded-tr-none shadow-sm max-w-[90%] text-left hover:bg-blue-50 transition-colors">
              {text}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white p-4 border-t border-gray-100 z-10 relative">
        <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1 pl-4">
          <Paperclip className="text-gray-400 shrink-0" size={20} />
          <input 
            type="text" 
            placeholder="Type your message..." 
            className="flex-1 bg-transparent border-none focus:outline-none text-sm py-2 px-2"
          />
          <button className="w-10 h-10 rounded-full bg-[#004B87] text-white flex items-center justify-center shrink-0 shadow-md">
            <Mic size={20} />
          </button>
          <button className="w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-400 flex items-center justify-center shrink-0 ml-1">
            <Send size={18} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
