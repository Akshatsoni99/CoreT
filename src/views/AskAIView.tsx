import { ChevronLeft, ChevronDown, Bot, Paperclip, Mic, Send } from 'lucide-react';
import AppLogo from '../assets/new-logo.png';

export function AskAIView() {
  const suggestions = [
    "How to get an income certificate?",
    "What documents are needed?",
    "Explain this form",
    "Check my eligibility"
  ];

  return (
    <div className="flex flex-col h-full bg-[#F9FAFB]">
      <header className="flex justify-between items-center px-4 pt-12 pb-4 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-2">
          <button className="p-2 -ml-2 text-gray-900">
            <ChevronLeft size={24} />
          </button>
          <img src={AppLogo} alt="CoreT" className="h-6 object-contain" />
          <span className="font-medium text-gray-500 text-sm">AI Assistant</span>
        </div>
        <button className="flex items-center gap-1 text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">
          हिंदी <ChevronDown size={14} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        <div className="flex gap-3 max-w-[85%]">
          <div className="w-8 h-8 rounded-full bg-[#004B87] text-white flex items-center justify-center shrink-0 shadow-md">
            <Bot size={18} />
          </div>
          <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm">
            <p className="text-gray-800 text-sm mb-4 leading-relaxed">
              Hi! I'm CoreT, your AI assistant.<br/>I can help you with:
            </p>
            <ul className="space-y-2 mb-4 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-[#004B87] mt-0.5">📄</span> Questions about government services
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#004B87] mt-0.5">📝</span> Understanding forms
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#004B87] mt-0.5">✅</span> Checking eligibility
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#004B87] mt-0.5">🔍</span> Finding required documents
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#004B87] mt-0.5">🎯</span> Guiding you through applications
              </li>
            </ul>
            <p className="text-gray-800 text-sm font-medium">What would you like to know today?</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 mt-4">
          {suggestions.map((text, i) => (
            <button key={i} className="bg-white border border-blue-200 text-[#004B87] text-sm px-4 py-2.5 rounded-2xl rounded-tr-none shadow-sm max-w-[85%] text-left">
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
