import { useState } from 'react';
import { 
  Settings, 
  FileText, 
  Shield, 
  Bell, 
  HelpCircle, 
  LogOut, 
  ChevronRight, 
  ChevronLeft, 
  Save, 
  Download, 
  Check, 
  Send 
} from 'lucide-react';
import AppLogo from '../assets/new-logo.png';
import { usePopup } from '../context/PopupContext';

type ProfileViewState = 'main' | 'edit' | 'vault' | 'privacy' | 'settings' | 'support';

export function ProfileView({ onLogout }: { onLogout?: () => void }) {
  const { showSuccess, showError, showInfo, showWarning } = usePopup();

  const [currentView, setCurrentView] = useState<ProfileViewState>('main');
  const [profileData, setProfileData] = useState({
    name: 'Aarav Sharma',
    phone: '+91 98765 43210',
    email: 'rohan.sharma@gmail.com',
    dob: '2003-03-14',
    address: 'A-102, Green Park Society, Bhopal, MP - 462001',
    gender: 'Male'
  });

  const [supportMessage, setSupportMessage] = useState('');

  const menuItems = [
    { id: 'vault', icon: FileText, title: 'Saved Information Vault', desc: 'Manage your details and documents' },
    { id: 'privacy', icon: Shield, title: 'Privacy & Security', desc: 'Control your data and permissions' },
    { id: 'settings', icon: Bell, title: 'App Settings', desc: 'Notifications, language and more' },
    { id: 'support', icon: HelpCircle, title: 'Help & Support', desc: 'Get help or contact support' },
  ];

  const handleSaveProfile = () => {
    if (!profileData.name.trim()) {
      showError('Validation Error', 'Full Name cannot be left blank.');
      return;
    }

    if (!profileData.address.trim()) {
      showError('Validation Error', 'Residential address is required for government scheme eligibility.');
      return;
    }

    showSuccess(
      'Profile Updated!',
      'Your citizen information has been successfully updated and synced with your local vault.',
      () => setCurrentView('main')
    );
  };

  const handleLogoutClick = () => {
    showWarning(
      'Sign Out Confirmation',
      'Are you sure you want to end your current session and return to the login screen?',
      () => onLogout?.()
    );
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) {
      showError('Empty Message', 'Please describe your inquiry or issue before submitting.');
      return;
    }
    const msg = supportMessage;
    setSupportMessage('');
    showSuccess(
      'Support Ticket Created',
      `Your support ticket #CR-${Math.floor(100000 + Math.random() * 900000)} has been logged. An officer will respond within 24 hours.`,
      () => setCurrentView('main')
    );
  };

  const renderMainView = () => (
    <div className="flex flex-col h-full bg-[#F9FAFB]">
      <header className="flex justify-between items-center px-6 pt-12 pb-4 bg-white">
        <img src={AppLogo} alt="CoreT" className="h-6 object-contain" />
        <button 
          onClick={() => setCurrentView('settings')}
          className="text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors"
        >
          <Settings size={22} />
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
              <p className="text-xs text-gray-500 mb-0.5 font-mono">{profileData.phone}</p>
              <p className="text-xs text-gray-500 truncate">{profileData.email}</p>
            </div>
          </div>
          <button 
            onClick={() => setCurrentView('edit')}
            className="w-full border border-gray-200 text-[#004B87] font-bold rounded-full py-2.5 text-sm hover:bg-blue-50 hover:border-blue-200 transition-colors"
          >
            Edit Profile
          </button>
        </div>

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
            onClick={handleLogoutClick}
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

      <div className="flex-1 overflow-y-auto p-6 pb-28 space-y-5">
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
          <label className="text-sm font-bold text-gray-900 ml-1">Phone Number</label>
          <input 
            type="text" 
            value={profileData.phone}
            onChange={e => setProfileData({...profileData, phone: e.target.value})}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#004B87] focus:ring-1 focus:ring-[#004B87]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold text-gray-900 ml-1">Email Address</label>
          <input 
            type="email" 
            value={profileData.email}
            onChange={e => setProfileData({...profileData, email: e.target.value})}
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
          onClick={handleSaveProfile}
          className="w-full bg-[#004B87] hover:bg-blue-800 text-white rounded-full py-3.5 font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#004B87]/30 active:scale-[0.99]"
        >
          <Save size={18} /> Save Changes
        </button>
      </div>
    </div>
  );

  const renderVault = () => (
    <div className="flex flex-col h-full bg-[#F9FAFB]">
      <header className="flex items-center px-4 pt-12 pb-4 bg-white border-b border-gray-100 sticky top-0 z-10">
        <button onClick={() => setCurrentView('main')} className="p-2 -ml-2 text-gray-900">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-900 ml-2">Saved Information Vault</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-4">
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl text-xs text-[#004B87] leading-relaxed">
          🔒 Your documents are encrypted client-side and used exclusively to auto-fill official government forms.
        </div>

        <div className="space-y-3">
          {[
            { name: 'Aadhaar Card', num: 'XXXX-XXXX-8921', status: 'Verified' },
            { name: 'PAN Card', num: 'ABCDE1234F', status: 'Verified' },
            { name: 'Income Certificate 2025-26', num: 'MP-REV-8910', status: 'Active' },
            { name: 'Ration Card', num: 'RC-99210-A', status: 'Linked' }
          ].map((doc, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
              <div>
                <h4 className="font-bold text-gray-900 text-sm">{doc.name}</h4>
                <p className="text-xs text-gray-500 font-mono mt-0.5">{doc.num}</p>
              </div>
              <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                {doc.status}
              </span>
            </div>
          ))}
        </div>

        <button 
          onClick={() => showSuccess('Vault Export', 'Encrypted backup file generated and downloaded successfully.')}
          className="w-full mt-4 border border-[#004B87] text-[#004B87] py-3 rounded-full font-bold text-xs flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors"
        >
          <Download size={16} /> Export Vault Backup
        </button>
      </div>
    </div>
  );

  const renderSupport = () => (
    <div className="flex flex-col h-full bg-white">
      <header className="flex items-center px-4 pt-12 pb-4 bg-white border-b border-gray-100 sticky top-0 z-10">
        <button onClick={() => setCurrentView('main')} className="p-2 -ml-2 text-gray-900">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-900 ml-2">Help & Support</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-6 pb-24 space-y-6">
        <div>
          <h3 className="font-bold text-gray-900 text-sm mb-1">Send an Inquiry</h3>
          <p className="text-xs text-gray-500 mb-4">Have an issue with a government form or scheme application? Describe it below.</p>
          
          <form onSubmit={handleSupportSubmit} className="space-y-4">
            <textarea 
              value={supportMessage}
              onChange={(e) => setSupportMessage(e.target.value)}
              placeholder="Type your issue or question in detail..."
              rows={5}
              className="w-full border border-gray-300 rounded-2xl p-4 text-sm focus:outline-none focus:border-[#004B87] focus:ring-1 focus:ring-[#004B87] resize-none"
            />
            <button 
              type="submit"
              className="w-full bg-[#004B87] text-white py-3.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:bg-blue-800 transition-colors"
            >
              <Send size={16} /> Submit Support Ticket
            </button>
          </form>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-3">Toll-Free Government Helplines</h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-600">National Cyber Crime Reporting</span>
              <span className="font-mono font-bold text-[#004B87]">1930</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-600">UIDAI Aadhaar Support</span>
              <span className="font-mono font-bold text-[#004B87]">1947</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Citizen Public Grievance (CPGRAMS)</span>
              <span className="font-mono font-bold text-[#004B87]">1800-11-4000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-white relative">
      {currentView === 'main' && renderMainView()}
      {currentView === 'edit' && renderEditProfile()}
      {currentView === 'vault' && renderVault()}
      {currentView === 'privacy' && renderVault()}
      {currentView === 'settings' && renderVault()}
      {currentView === 'support' && renderSupport()}
    </div>
  );
}
