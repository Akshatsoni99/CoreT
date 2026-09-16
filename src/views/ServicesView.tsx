import { useState } from 'react';
import { ChevronLeft, Search, User, HeartPulse, Landmark, GraduationCap, Users, Zap, Flame, ChevronRight, ExternalLink, FileText, CheckCircle2 } from 'lucide-react';

// Mock Data for Categories & Services
const categoriesData = [
  { id: 'identity', icon: User, name: 'Identity', desc: 'Aadhaar, PAN, Voter ID', color: 'text-blue-500', bg: 'bg-blue-50', services: [
      { name: 'Aadhaar Card', desc: 'Unique Identification Authority of India', docs: ['Proof of Identity (POI)', 'Proof of Address (POA)', 'Date of Birth (DOB) Proof'], url: 'https://myaadhaar.uidai.gov.in/' },
      { name: 'PAN Card', desc: 'Income Tax Department', docs: ['Aadhaar Card', 'Passport Size Photo', 'Address Proof'], url: 'https://www.incometax.gov.in/' },
      { name: 'Voter ID', desc: 'Election Commission of India', docs: ['Address Proof', 'Age Proof (if 18-21)', 'Recent Photograph'], url: 'https://voters.eci.gov.in/' }
  ]},
  { id: 'healthcare', icon: HeartPulse, name: 'Healthcare', desc: 'Health cards, Medical benefits', color: 'text-red-500', bg: 'bg-red-50', services: [
      { name: 'Ayushman Bharat Card', desc: 'National Health Authority', docs: ['Aadhaar Card', 'Ration Card', 'Income Certificate'], url: 'https://pmjay.gov.in/' },
      { name: 'ABHA Card', desc: 'Digital Health ID', docs: ['Aadhaar Card', 'Mobile Number'], url: 'https://abha.abdm.gov.in/' }
  ]},
  { id: 'taxes', icon: Landmark, name: 'Taxes', desc: 'Income Tax, Property Tax', color: 'text-green-500', bg: 'bg-green-50', services: [
      { name: 'ITR Filing', desc: 'Income Tax Department', docs: ['Form 16', 'Bank Statements', 'PAN Card', 'Investment Proofs'], url: 'https://www.incometax.gov.in/' }
  ]},
  { id: 'education', icon: GraduationCap, name: 'Education', desc: 'Scholarships, Certificates', color: 'text-yellow-500', bg: 'bg-yellow-50', services: [
      { name: 'National Scholarship', desc: 'Ministry of Education', docs: ['Mark Sheets', 'Income Certificate', 'Caste Certificate', 'Bank Details'], url: 'https://scholarships.gov.in/' }
  ]},
  { id: 'social_welfare', icon: Users, name: 'Social Welfare', desc: 'Pensions, Benefits', color: 'text-purple-500', bg: 'bg-purple-50', services: [
      { name: 'Old Age Pension', desc: 'Ministry of Rural Development', docs: ['Age Proof', 'Aadhaar Card', 'Income Certificate', 'BPL Card'], url: 'https://nsap.nic.in/' }
  ]},
  { id: 'utilities', icon: Zap, name: 'Utilities', desc: 'Electricity, Water, Gas', color: 'text-orange-500', bg: 'bg-orange-50', services: [
      { name: 'New Electricity Connection', desc: 'State Electricity Board', docs: ['Ownership Proof', 'Identity Proof', 'Passport Size Photo'], url: 'https://www.india.gov.in/' }
  ]},
];

type ViewState = 
  | { type: 'main' }
  | { type: 'category'; categoryId: string }
  | { type: 'detail'; categoryId: string; serviceName: string };

export function ServicesView() {
  const [view, setView] = useState<ViewState>({ type: 'main' });

  const renderMainView = () => (
    <>
      <header className="flex flex-col px-4 pt-12 pb-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="flex items-center mb-4">
          <button className="p-2 -ml-2 text-gray-900 invisible">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-gray-900 ml-2">Services</h1>
        </div>
        <p className="text-gray-500 text-sm mb-4">Discover and apply for government services across India.</p>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Search for a service (e.g. income certificate)" 
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 pb-20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">Popular Categories</h2>
          <button className="text-blue-600 text-sm font-bold">See All</button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {categoriesData.map((cat) => (
            <button 
              key={cat.id} 
              onClick={() => setView({ type: 'category', categoryId: cat.id })}
              className="border border-gray-100 rounded-2xl p-4 flex flex-col items-center text-center shadow-sm hover:border-blue-200 hover:shadow-md transition-all bg-white"
            >
              <div className={`w-12 h-12 rounded-full ${cat.bg} ${cat.color} flex items-center justify-center mb-3`}>
                <cat.icon size={24} />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">{cat.name}</h3>
              <p className="text-[10px] text-gray-500">{cat.desc}</p>
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Flame className="text-orange-500" size={20} />
            <h2 className="text-lg font-bold text-gray-900">Trending Services</h2>
          </div>
          <button className="text-blue-600 text-sm font-bold">See All</button>
        </div>

        <div className="space-y-3">
          {['Income Certificate', 'Caste Certificate'].map((service, i) => (
            <div key={i} className="border border-gray-100 rounded-xl p-4 flex items-center justify-between shadow-sm bg-white">
              <div className="flex items-center gap-3">
                <span className="text-blue-600 font-bold w-6 text-center">{i + 1}</span>
                <span className="font-medium text-gray-900">{service}</span>
              </div>
              <ChevronRight className="text-gray-400" size={20} />
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderCategoryView = (categoryId: string) => {
    const category = categoriesData.find(c => c.id === categoryId)!;
    
    return (
      <div className="flex flex-col h-full bg-[#F9FAFB]">
        <header className="flex items-center px-4 pt-12 pb-4 bg-white border-b border-gray-100 sticky top-0 z-10">
          <button onClick={() => setView({ type: 'main' })} className="p-2 -ml-2 text-gray-900">
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center gap-2 ml-2">
            <div className={`w-8 h-8 rounded-full ${category.bg} ${category.color} flex items-center justify-center`}>
              <category.icon size={16} />
            </div>
            <h1 className="text-xl font-bold text-gray-900">{category.name} Services</h1>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
          {category.services.map((service, i) => (
            <button 
              key={i} 
              onClick={() => setView({ type: 'detail', categoryId: category.id, serviceName: service.name })}
              className="w-full bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between text-left hover:border-blue-200 transition-colors"
            >
              <div>
                <h3 className="font-bold text-gray-900">{service.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{service.desc}</p>
              </div>
              <ChevronRight className="text-gray-400 shrink-0" size={20} />
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderDetailView = (categoryId: string, serviceName: string) => {
    const category = categoriesData.find(c => c.id === categoryId)!;
    const service = category.services.find(s => s.name === serviceName)!;

    return (
      <div className="flex flex-col h-full bg-[#F9FAFB]">
        <header className="flex items-center px-4 pt-12 pb-4 bg-white border-b border-gray-100 sticky top-0 z-10">
          <button onClick={() => setView({ type: 'category', categoryId })} className="p-2 -ml-2 text-gray-900">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-bold text-gray-900 ml-2 truncate">{service.name}</h1>
        </header>

        <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <FileText size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h2>
            <p className="text-sm text-gray-500 mb-4">{service.desc}</p>
            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
              <CheckCircle2 size={14} /> Official Government Service
            </span>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
               Important Documents Required
            </h3>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
              {service.docs.map((doc, i) => (
                <div key={i} className="p-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{doc}</span>
                  <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded">Required</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border-t border-gray-100 absolute bottom-0 inset-x-0 z-20 pb-8">
          <button 
            onClick={() => window.open(service.url, '_blank')}
            className="w-full bg-[#004B87] hover:bg-blue-800 text-white rounded-full py-4 font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#004B87]/30"
          >
            Redirect to Official Website <ExternalLink size={18} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full bg-white relative">
      {view.type === 'main' && renderMainView()}
      {view.type === 'category' && renderCategoryView(view.categoryId)}
      {view.type === 'detail' && renderDetailView(view.categoryId, view.serviceName)}
    </div>
  );
}
