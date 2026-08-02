import { useState, type ReactNode } from 'react';
import { useAppStore } from '../store/useAppStore';
import { TransactionModal } from './TransactionModal';
import type { Page } from '../types';

interface Props {
  page: Page;
  onNavigate: (p: Page) => void;
  children: ReactNode;
  title: string;
}

export function AppLayout({ page, onNavigate, children, title }: Props) {
  const candidato = useAppStore((s) => s.candidato);
  const sair = useAppStore((s) => s.sair);
  const transactions = useAppStore((s) => s.transactions);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);

  const navItems: { id: Page; icon: string; label: string; testId: string }[] = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', testId: 'nav-dashboard' },
    { id: 'lancamentos', icon: '📋', label: 'Lançamentos', testId: 'nav-lancamentos' },
  ];

  function navigate(p: Page) {
    onNavigate(p);
    setSidebarOpen(false);
  }

  return (
    <div className="app-wrapper">
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <aside className={`app-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-badge">📝</div>
          <div>
            <div className="logo-title">Avaliação Cypress</div>
            <div className="logo-sub">Projeto de teste</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <div
              key={item.id}
              data-testid={item.testId}
              className={`nav-item${page === item.id ? ' active' : ''}`}
              onClick={() => navigate(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
              {item.id === 'lancamentos' && (
                <span data-testid="badge-lancamentos" className="nav-badge">
                  {transactions.length}
                </span>
              )}
            </div>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="user-avatar">
            {(candidato?.nomeCompleto?.[0] || '?').toUpperCase()}
          </div>
          <div className="user-info">
            <div data-testid="user-nome" className="user-nome">
              {candidato?.nomeCompleto}
            </div>
            <div className="user-email">{candidato?.email}</div>
          </div>
          <button data-testid="btn-sair" title="Sair" className="btn-icon" onClick={sair}>
            🚪
          </button>
        </div>
      </aside>

      <main className="app-main">
        <header className="app-header">
          <div className="app-header-left">
            <button className="hamburger-btn" onClick={() => setSidebarOpen((o) => !o)} aria-label="Abrir menu">
              ☰
            </button>
            <div className="app-header-title">{title}</div>
          </div>
        </header>

        <div className="app-content-area">{children}</div>
      </main>

      <button data-testid="fab-nova-transacao" className="fab-btn" onClick={() => setFabOpen(true)} aria-label="Nova Transação">
        +
      </button>
      {fabOpen && <TransactionModal onClose={() => setFabOpen(false)} />}
    </div>
  );
}
