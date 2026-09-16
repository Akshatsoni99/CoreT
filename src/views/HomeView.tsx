import { Search, Mic, Scan, Search as SearchIcon, MessageSquare, Lightbulb, Leaf, ArrowRight, ChevronRight, Bell } from 'lucide-react';
import AppLogo from '../assets/new-logo.png';

export function HomeView({ onNavigate }: { onNavigate: (tab: string) => void }) {
  return (
    <div className="flex flex-col h-full bg-[#F9FAFB]">
      <header className="pt-12 pb-4 px-6 bg-white flex justify-between items-start rounded-b-3xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] z-10 relative">
        <div className="flex flex-col">
          <img src={AppLogo} alt="CoreT Logo" className="h-8 mb-1 object-contain object-left" />
          <p className="text-[10px] text-gray-500 font-medium tracking-wide">People • Services • A Safer Tomorrow</p>
        </div>
        <div className="flex gap-3 items-center">
          <button className="relative p-2 rounded-full border border-gray-200">
            <Bell size={20} className="text-gray-700" />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">3</span>
          </button>
          <div className="w-10 h-10 rounded-full bg-blue-100 text-[#004B87] flex items-center justify-center font-bold text-sm border border-blue-200">
            AS
          </div>
        </div>
      </header>

      <div className="px-6 py-6 pb-24 overflow-y-auto">
        <div className="mb-6 relative">
          <h2 className="text-gray-600 text-lg">Good morning,</h2>
          <h1 className="text-4xl font-extrabold text-[#002D5A] mb-2 flex items-center gap-2">
            Aarav <span className="text-3xl">👋</span>
          </h1>
          <p className="text-gray-600 max-w-[200px] text-sm mb-4 leading-snug">
            Simpler government services for a brighter tomorrow.
          </p>
          <div className="flex items-center gap-1 mb-2">
             <div className="h-1 w-8 bg-red-500 rounded-full"></div>
             <div className="h-1 w-8 bg-[#004B87] rounded-full"></div>
          </div>
          <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
            People • Progress • Possibilities
          </p>

          <div className="absolute top-2 right-0 w-48 h-40 pointer-events-none overflow-hidden">
             <div className="absolute bottom-6 right-4 w-32 h-24 bg-orange-100 rounded-t-full opacity-50"></div>
             <div className="absolute top-4 right-12 w-8 h-8 rounded-full bg-yellow-400"></div>
             <div className="absolute right-4 bottom-14 text-[10px] italic text-[#004B87] font-bold text-right leading-tight bg-white/70 p-1 rounded backdrop-blur-sm">
               A more<br/>empowered<br/>citizen.<br/>A stronger<br/>India.
             </div>
          </div>
        </div>

        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <SearchIcon className="text-gray-800" size={20} strokeWidth={2.5} />
          </div>
          <input 
            type="text" 
            placeholder="Ask anything... (e.g. How to apply for a passport?)" 
            className="w-full bg-white border border-gray-200 rounded-full py-4 pl-12 pr-12 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#004B87]"
          />
          <div className="absolute inset-y-0 right-4 flex items-center">
            <button className="text-[#004B87]">
              <Mic size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          <button onClick={() => onNavigate('scanner')} className="bg-red-50/70 rounded-2xl p-4 flex flex-col items-center text-center border border-red-100/50 hover:bg-red-100/70 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-white text-red-500 flex items-center justify-center mb-3 shadow-[0_2px_10px_-4px_rgba(239,68,68,0.3)] border border-red-50">
              <Scan size={28} strokeWidth={2} />
            </div>
            <h3 className="font-bold text-gray-900 text-sm mb-1">Scan a Form</h3>
            <p className="text-[10px] text-gray-500 mb-4 leading-tight">Get help to fill government forms</p>
            <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md shadow-red-500/30 mt-auto">
              <ArrowRight size={16} />
            </div>
          </button>
          
          <button onClick={() => onNavigate('services')} className="bg-blue-50/70 rounded-2xl p-4 flex flex-col items-center text-center border border-blue-100/50 hover:bg-blue-100/70 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-white text-[#004B87] flex items-center justify-center mb-3 shadow-[0_2px_10px_-4px_rgba(0,75,135,0.3)] border border-blue-50">
              <SearchIcon size={28} strokeWidth={2} />
            </div>
            <h3 className="font-bold text-gray-900 text-sm mb-1">Find a Service</h3>
            <p className="text-[10px] text-gray-500 mb-4 leading-tight">Discover government services you need</p>
            <div className="w-8 h-8 rounded-full bg-[#004B87] text-white flex items-center justify-center shadow-md shadow-[#004B87]/30 mt-auto">
              <ArrowRight size={16} />
            </div>
          </button>

          <button onClick={() => onNavigate('scam-shield')} className="bg-green-50/70 rounded-2xl p-4 flex flex-col items-center text-center border border-green-100/50 hover:bg-green-100/70 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-white text-green-600 flex items-center justify-center mb-3 shadow-[0_2px_10px_-4px_rgba(22,163,74,0.3)] border border-green-50">
              <MessageSquare size={28} strokeWidth={2} />
            </div>
            <h3 className="font-bold text-gray-900 text-sm mb-1">Check a Message</h3>
            <p className="text-[10px] text-gray-500 mb-4 leading-tight">View updates from government departments</p>
            <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center shadow-md shadow-green-600/30 mt-auto">
              <ArrowRight size={16} />
            </div>
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-orange-50 rounded-2xl p-4 flex items-center gap-4 relative overflow-hidden border border-orange-100/50">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center shrink-0 z-10 text-orange-400">
              <Lightbulb size={24} fill="currentColor" />
            </div>
            <div className="flex-1 z-10">
              <h4 className="font-bold text-gray-900 text-sm mb-1">Tips for You</h4>
              <p className="text-xs text-gray-600 leading-snug">Learn useful tips to save time, avoid mistakes and get things done faster.</p>
            </div>
            <button className="shrink-0 z-10 text-gray-400">
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100/50 rounded-2xl p-4 flex items-center gap-4 relative overflow-hidden border border-green-100/50">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0 z-10 text-green-500">
              <Leaf size={24} fill="currentColor" />
            </div>
            <div className="flex-1 z-10">
              <h4 className="font-bold text-gray-900 text-sm mb-1">Greener Tomorrow</h4>
              <p className="text-xs text-gray-600 leading-snug">Go digital. Save paper.<br/>Be a part of a cleaner, greener India.</p>
            </div>
            <button className="shrink-0 z-10 text-gray-400">
              <ChevronRight size={20} />
            </button>
             <div className="absolute right-0 bottom-0 text-green-200 w-32 h-16 flex items-end justify-end overflow-hidden">
               <div className="w-24 h-12 bg-green-200/50 rounded-t-full translate-y-4 translate-x-4"></div>
               <div className="w-16 h-8 bg-green-300/50 rounded-t-full translate-y-2 -translate-x-8"></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
