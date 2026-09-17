/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Layout } from './components/Layout';
import { HomeView } from './views/HomeView';
import { ScannerView } from './views/ScannerView';
import { ServicesView } from './views/ServicesView';
import { ScamShieldView } from './views/ScamShieldView';
import { ProfileView } from './views/ProfileView';
import { AskAIView } from './views/AskAIView';
import { AuthView } from './views/AuthView';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [aiInitialQuery, setAiInitialQuery] = useState('');

  const handleNavigate = (tab: string, query?: string) => {
    if (query) {
      setAiInitialQuery(query);
    }
    setActiveTab(tab);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center overflow-hidden font-sans">
        <div className="w-full max-w-md bg-white h-screen flex flex-col relative shadow-2xl sm:rounded-[2.5rem] sm:h-[90vh] sm:my-auto sm:border-8 border-gray-900 overflow-hidden">
          <AuthView onLogin={() => setIsAuthenticated(true)} />
        </div>
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'home' && <HomeView onNavigate={handleNavigate} />}
      {activeTab === 'scanner' && <ScannerView onComplete={() => setActiveTab('home')} />}
      {activeTab === 'services' && <ServicesView />}
      {activeTab === 'scam-shield' && <ScamShieldView />}
      {activeTab === 'profile' && <ProfileView onLogout={() => setIsAuthenticated(false)} />}
      {activeTab === 'ask-ai' && <AskAIView onNavigate={setActiveTab} initialQuery={aiInitialQuery} />}
    </Layout>
  );
}
