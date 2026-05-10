import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Landing } from './views/Landing';
import { Login } from './views/Login';
import { Dashboard } from './views/Dashboard';
import { LiveRates } from './views/LiveRates';
import { BookDeal } from './views/BookDeal';
import { DealBlotter } from './views/DealBlotter';
import { Approvals } from './views/Approvals';
import { Exposure } from './views/Exposure';
import { RiskEngine } from './views/RiskEngine';
import { Compliance } from './views/Compliance';
import { Clients } from './views/Clients';
import { Analytics } from './views/Analytics';
import { Settings } from './views/Settings';
import type { User, ViewType } from './types';
import { MOCK_USERS } from './data/mockData';

export default function App() {
  const [appView, setAppView] = useState<'landing' | 'login' | 'app'>('landing');
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setAppView('app');
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setAppView('landing');
    setCurrentView('dashboard');
  };

  const navigate = (view: ViewType) => {
    setCurrentView(view);
  };

  const renderView = () => {
    if (!user) return null;

    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={navigate} />;
      case 'rates':
        return <LiveRates onNavigate={navigate} />;
      case 'book-deal':
        return <BookDeal onNavigate={navigate} />;
      case 'deals':
        return <DealBlotter onNavigate={navigate} />;
      case 'approvals':
        return <Approvals />;
      case 'exposure':
        return <Exposure />;
      case 'risk':
        return <RiskEngine />;
      case 'compliance':
        return <Compliance />;
      case 'clients':
        return <Clients />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings user={user} onLogout={handleLogout} />;
      default:
        return <Dashboard onNavigate={navigate} />;
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#050810]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <AnimatePresence mode="wait">

        {appView === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full overflow-y-auto"
          >
            <Landing onEnter={() => setAppView('login')} />
          </motion.div>
        )}

        {appView === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <Login
              onLogin={handleLogin}
              onBack={() => setAppView('landing')}
            />
          </motion.div>
        )}

        {appView === 'app' && user && (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full flex flex-col"
          >
            {/* Main layout */}
            <div className="flex flex-1 overflow-hidden">

              {/* Sidebar */}
              <Sidebar
                currentView={currentView}
                onNavigate={navigate}
                user={user}
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(c => !c)}
              />

              {/* Main area */}
              <div className="flex-1 flex flex-col overflow-hidden min-w-0">

                {/* Top bar + ticker */}
                <TopBar
                  currentView={currentView}
                  user={user}
                  onLogout={handleLogout}
                  onNavigate={navigate}
                />

                {/* Content */}
                <div className="flex-1 overflow-hidden bg-[#080c10]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentView}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="h-full"
                    >
                      {renderView()}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
