/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { HomeView } from './views/HomeView';
import { ScannerView } from './views/ScannerView';
import { ServicesView } from './views/ServicesView';
import { ScamShieldView } from './views/ScamShieldView';
import { ProfileView } from './views/ProfileView';
import { AskAIView } from './views/AskAIView';
import { AuthView } from './views/AuthView';
import { AdminView } from './views/AdminView';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem('coret_auth_session');
      if (auth === 'true') return true;
      const profile = localStorage.getItem('coreserve_user_profile');
      if (profile) {
        try {
          const parsed = JSON.parse(profile);
          if (parsed.name || parsed.email) return true;
        } catch {}
      }
    }
    return false;
  });

  const handleLogin = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('coret_auth_session', 'true');
    }
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('coret_auth_session');
    }
    setIsAuthenticated(false);
  };

  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash.toLowerCase().includes('admin')) {
      return 'admin';
    }
    return 'home';
  });
  const [aiInitialQuery, setAiInitialQuery] = useState('');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('admin')) {
        setActiveTab('admin');
      } else if (hash === '' || hash === '#/' || hash === '#home') {
        setActiveTab('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (tab: string, query?: string) => {
    if (query) {
      setAiInitialQuery(query);
    }
    if (tab === 'admin') {
      window.location.hash = 'admin';
    } else if (window.location.hash.toLowerCase().includes('admin')) {
      window.location.hash = '';
    }
    setActiveTab(tab);
  };

  // Dedicated Bank Admin Portal view (Desktop / Branch Terminal experience)
  if (activeTab === 'admin') {
    return (
      <AdminView
        onBackToCitizen={() => {
          window.location.hash = '';
          setActiveTab('home');
        }}
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center overflow-hidden font-sans">
        <div className="w-full max-w-md bg-white h-screen flex flex-col relative shadow-2xl sm:rounded-[2.5rem] sm:h-[90vh] sm:my-auto sm:border-8 border-gray-900 overflow-hidden">
          <AuthView onLogin={handleLogin} />
        </div>
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} onTabChange={handleNavigate}>
      {activeTab === 'home' && <HomeView onNavigate={handleNavigate} />}
      {activeTab === 'scanner' && <ScannerView onComplete={() => handleNavigate('home')} />}
      {activeTab === 'services' && <ServicesView onBack={() => handleNavigate('home')} />}
      {activeTab === 'scam-shield' && <ScamShieldView />}
      {activeTab === 'profile' && <ProfileView onLogout={handleLogout} />}
      {activeTab === 'ask-ai' && <AskAIView onNavigate={handleNavigate} initialQuery={aiInitialQuery} />}
    </Layout>
  );
}
