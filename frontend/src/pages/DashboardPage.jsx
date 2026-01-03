import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

// Components for different roles
import AdminDashboard from '../components/dashboards/AdminDashboard';
import ClientDashboard from '../components/dashboards/ClientDashboard';
import OperatorDashboard from '../components/dashboards/OperatorDashboard';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({ pending: 0, active: 0, completed: 0, budget: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // This would be a dedicated endpoint, for now we'll simulate
      const transfers = await api.get('/transfers/');
      const data = transfers.data;
      setStats({
        pending: data.filter(t => t.status === 'Richiesto').length,
        active: data.filter(t => t.status === 'In Corso').length,
        completed: data.filter(t => t.status === 'Completato').length,
        budget: data.reduce((acc, t) => acc + parseFloat(t.service_value || 0), 0),
      });
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'transfers', label: 'Transfer', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
    { id: 'vehicles', label: 'Veicoli', icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0' },
    { id: 'requests', label: 'Richieste', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    { id: 'reports', label: 'Report', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  ];

  const [activeNav, setActiveNav] = useState('dashboard');

  const getRoleColor = (role) => {
    switch (role) {
      case 'Amministratore': return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'Cliente': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Operatore': return 'bg-green-500/10 text-green-400 border-green-500/30';
      default: return 'bg-surface-700 text-surface-200 border-surface-600';
    }
  };

  const renderDashboardContent = () => {
    if (!user) return null;

    switch (user.role) {
      case 'Amministratore':
        return <AdminDashboard stats={stats} onRefresh={fetchStats} />;
      case 'Cliente':
        return <ClientDashboard stats={stats} onRefresh={fetchStats} />;
      case 'Operatore':
        return <OperatorDashboard />;
      default:
        return <ClientDashboard stats={stats} onRefresh={fetchStats} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-surface-950">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-surface-900/50 border-r border-surface-800 flex flex-col transition-all duration-300`}>
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-surface-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            {sidebarOpen && <span className="font-semibold text-white">Transfer Manager</span>}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`nav-item w-full ${activeNav === item.id ? 'active' : ''}`}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-surface-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-surface-700 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.username}</p>
                <span className={`badge text-xs ${getRoleColor(user?.role)}`}>{user?.role}</span>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <button
              onClick={logout}
              className="mt-4 w-full btn-secondary text-sm py-2"
            >
              Esci
            </button>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-surface-900/30 border-b border-surface-800 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-surface-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-surface-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-white">
              {activeNav === 'dashboard' ? 'Dashboard' : navItems.find(n => n.id === activeNav)?.label}
            </h1>
          </div>

          {/* Quick stats in header */}
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs text-surface-200">Transfer Attivi</p>
              <p className="text-lg font-semibold text-green-400">{stats.active}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-surface-200">In Attesa</p>
              <p className="text-lg font-semibold text-yellow-400">{stats.pending}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-surface-200">Budget Totale</p>
              <p className="text-lg font-semibold text-primary-400">€{stats.budget.toFixed(2)}</p>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 p-6 overflow-auto">
          {renderDashboardContent()}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
