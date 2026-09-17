import { useState } from 'react';
import { Settings, FileText, Shield, Bell, HelpCircle, LogOut, ChevronRight, ChevronLeft, Save } from 'lucide-react';
import AppLogo from '../assets/new-logo.png';
import { isGeminiConfigured, getGeminiApiKey } from '../services/geminiService';

type ProfileViewState = 'main' | 'edit' | 'vault' | 'privacy' | 'settings' | 'support';

export function ProfileView({ onLogout }: { onLogout?: () => void }) {
  const [currentView, setCurrentView] = useState<ProfileViewState>('main');
  const [profileData, setProfileData] = useState({
    name: 'Rohan Sharma',
    phone: '+91 98765 43210',
    email: 'rohan.sharma@gmail.com',
    dob: '2003-03-14',
    address: 'A-102, Green Park Society, Bhopal, MP',
    gender: 'Male'
  });

  const menuItems = [
    { id: 'vault', icon: FileText, title: 'Saved Information Vault', desc: 'Manage your details and documents' },
    { id: 'privacy', icon: Shield, title: 'Privacy & Security', desc: 'Control your data and permissions' },
    { id: 'settings', icon: Bell, title: 'App Settings', desc: 'Notifications, language and more' },
    { id: 'support', icon: HelpCircle, title: 'Help & Support', desc: 'Get help or contact us' },
  ];

  const renderMainView = () => (
    <div className="flex flex-col h-full bg-[#F9FAFB]">
      <header className="flex justify-between items-center px-6 pt-12 pb-4 bg-white">
        <img src={AppLogo} alt="CoreT" className="h-6 object-contain" />
        <button className="text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors">
          <Settings size={24} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto pb-24">
        <div className="bg-white px-6 pb-6 pt-2 rounded-b-3xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-[#004B87] flex items-center justify-center font-bold text-2xl border border-blue-100 shadow-sm shrink-0">
              {profileData.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-1">{profileData.name}</h2>
              <p className="text-sm text-gray-500 mb-0.5">{profileData.phone}</p>
              <p className="text-sm text-gray-500">{profileData.email}</p>
            </div>
          </div>
          <button 
            onClick={() => setCurrentView('edit')}
            className="w-full border border-gray-200 text-[#004B87] font-bold rounded-full py-2.5 text-sm hover:bg-blue-50 hover:border-blue-200 transition-colors"
          >
            Edit Profile
          </button>
        </div>

        {/* Note: The 80% completion banner has been removed as requested */}

        <div className="px-4 space-y-3">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
            {menuItems.map((item, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentView(item.id as ProfileViewState)}
                className="w-full flex items-center p-4 text-left hover:bg-gray-50 transition-colors focus:outline-none"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#004B87] flex items-center justify-center mr-4 shrink-0">
                  <item.icon size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-sm mb-0.5">{item.title}</h4>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
                <ChevronRight className="text-gray-400 shrink-0" size={20} />
              </button>
            ))}
          </div>

          <button 
            onClick={onLogout}
            className="w-full flex items-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm text-left hover:bg-red-50 transition-colors group"
          >
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mr-4 shrink-0 group-hover:bg-red-100">
              <LogOut size={20} />
            </div>
            <span className="font-bold text-red-600 text-sm">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderEditProfile = () => (
    <div className="flex flex-col h-full bg-white">
      <header className="flex items-center px-4 pt-12 pb-4 bg-white border-b border-gray-100 sticky top-0 z-10">
        <button onClick={() => setCurrentView('main')} className="p-2 -ml-2 text-gray-900">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-900 ml-2">Edit Profile</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-6 pb-24 space-y-6">
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-gray-900 ml-1">Full Name</label>
          <input 
            type="text" 
            value={profileData.name}
            onChange={e => setProfileData({...profileData, name: e.target.value})}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#004B87] focus:ring-1 focus:ring-[#004B87]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold text-gray-900 ml-1">Date of Birth</label>
          <input 
            type="date" 
            value={profileData.dob}
            onChange={e => setProfileData({...profileData, dob: e.target.value})}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#004B87] focus:ring-1 focus:ring-[#004B87]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold text-gray-900 ml-1">Gender</label>
          <select 
            value={profileData.gender}
            onChange={e => setProfileData({...profileData, gender: e.target.value})}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#004B87] focus:ring-1 focus:ring-[#004B87] bg-white"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold text-gray-900 ml-1">Address</label>
          <textarea 
            value={profileData.address}
            onChange={e => setProfileData({...profileData, address: e.target.value})}
            rows={3}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#004B87] focus:ring-1 focus:ring-[#004B87] resize-none"
          />
        </div>
      </div>

      <div className="p-4 bg-white border-t border-gray-100 absolute bottom-0 inset-x-0 z-20 pb-8">
        <button 
          onClick={() => setCurrentView('main')}
          className="w-full bg-[#004B87] hover:bg-blue-800 text-white rounded-full py-4 font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#004B87]/30"
        >
          <Save size={20} /> Save Changes
        </button>
      </div>
    </div>
  );

  const renderSettings = () => {
    const isConfigured = isGeminiConfigured();
    const currentKey = getGeminiApiKey();
    const maskedKey = currentKey ? currentKey.slice(0, 6) + '••••••••••••' + currentKey.slice(-4) : 'Not configured';

    return (
      <div className="flex flex-col h-full bg-[#F9FAFB]">
        <header className="flex items-center px-4 pt-12 pb-4 bg-white border-b border-gray-100 sticky top-0 z-10">
          <button onClick={() => setCurrentView('main')} className="p-2 -ml-2 text-gray-900">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-gray-900 ml-2">App Settings</h1>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
          {/* Gemini AI Card */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#004B87] flex items-center justify-center font-bold">
                  ✨
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Gemini AI Assistant (RAAHA)</h3>
                  <p className="text-[11px] text-gray-500">Powered by Google Gemini 3.6 Flash</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                isConfigured ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {isConfigured ? 'Connected' : 'Missing Key'}
              </span>
            </div>

            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200/80 text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-500 font-medium">Active API Key:</span>
                <span className="font-mono text-gray-700">{maskedKey}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Source:</span>
                <span className="text-gray-700 font-medium">.env (Vite Inject)</span>
              </div>
            </div>

            <div className="text-[11px] text-gray-500 leading-relaxed">
              Your Gemini API Key is loaded automatically from your <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-700 font-mono">.env</code> file. RAAHA AI uses it for real-time banking guidance, form filling help, speech recognition, and document analysis.
            </div>
          </div>

          {/* Citizen Assistant Preferences */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <h3 className="font-bold text-gray-900 text-sm">Citizen Accessibility</h3>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between items-center py-1 border-b border-gray-50">
                <span>Text-to-Speech Audio Read Aloud</span>
                <span className="font-bold text-green-600">Enabled</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-50">
                <span>Regional Voice Recognition</span>
                <span className="font-bold text-green-600">7 Languages</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span>Multimodal Form Slip Vision</span>
                <span className="font-bold text-green-600">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPlaceholder = (title: string, icon: any) => {
    const Icon = icon;
    return (
      <div className="flex flex-col h-full bg-[#F9FAFB]">
        <header className="flex items-center px-4 pt-12 pb-4 bg-white border-b border-gray-100 sticky top-0 z-10">
          <button onClick={() => setCurrentView('main')} className="p-2 -ml-2 text-gray-900">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-gray-900 ml-2">{title}</h1>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-gray-500 gap-4">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center animate-pulse text-gray-400">
            <Icon size={32} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">{title} Configuration</h2>
            <p className="text-sm">This screen is currently under construction. All {title.toLowerCase()} related features will be available here soon.</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full bg-white relative">
      {currentView === 'main' && renderMainView()}
      {currentView === 'edit' && renderEditProfile()}
      {currentView === 'vault' && renderPlaceholder('Saved Information Vault', FileText)}
      {currentView === 'privacy' && renderPlaceholder('Privacy & Security', Shield)}
      {currentView === 'settings' && renderSettings()}
      {currentView === 'support' && renderPlaceholder('Help & Support', HelpCircle)}
    </div>
  );
}
