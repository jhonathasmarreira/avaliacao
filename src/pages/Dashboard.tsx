import { useMemo, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { formatCurrency } from '../utils/format';
import { TransactionModal } from '../components/TransactionModal';
import type { Page } from '../types';

const COLORS = ['#6c63ff', '#ff6584', '#43d9ad', '#ffb347', '#4fc3f7', '#ce93d8', '#a5d6a7'];

export function Dashboard({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const transactions = useAppStore((s) => s.transactions);
  const [modalOpen, setModalOpen] = useState(false);

  const income = useMemo(
    () => transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
    [transactions]
  );
  const expense = useMemo(
    () => transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    [transactions]
  );
  const balance = income - expense;

  const categorias = useMemo(() => {
    const map: Record<string, number> = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });
    const entries = Object.entries(map).sort(([, a], [, b]) => b - a).slice(0, 7);
    const max = entries.length > 0 ? entries[0][1] : 1;
    return entries.map(([name, value], i) => ({ name, value, pct: (value / max) * 100, color: COLORS[i % COLORS.length] }));
  }, [transactions]);

  return (
    <div className="dashboard">
      <div className="dashboard-toolbar">
        <button data-testid="btn-nova-transacao" className="btn-primary" onClick={() => setModalOpen(true)}>
          + Nova transação
        </button>
      </div>

      <div className="cards-grid">
        <div data-testid="card-receitas" className="stat-card" style={{ borderLeftColor: 'var(--success)' }}>
          <div className="stat-label">Receitas</div>
          <div className="stat-value" style={{ color: 'var(--success)' }}>{formatCurrency(income)}</div>
        </div>
        <div data-testid="card-despesas" className="stat-card" style={{ borderLeftColor: 'var(--danger)' }}>
          <div className="stat-label">Despesas</div>
          <div className="stat-value" style={{ color: 'var(--danger)' }}>{formatCurrency(expense)}</div>
        </div>
        <div data-testid="card-saldo" className="stat-card" style={{ borderLeftColor: balance >= 0 ? 'var(--success)' : 'var(--danger)' }}>
          <div className="stat-label">Saldo</div>
          <div className="stat-value" style={{ color: balance >= 0 ? 'var(--success)' : 'var(--danger)' }}>
            {formatCurrency(balance)}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Gastos por categoria</div>
        {categorias.length === 0 ? (
          <div data-testid="dashboard-sem-dados" className="empty-state">
            <div className="empty-icon">📭</div>
            <p>Sem lançamentos ainda.</p>
          </div>
        ) : (
          <div className="categoria-list">
            {categorias.map((c) => (
              <div key={c.name} className="categoria-row">
                <div className="categoria-info">
                  <span>{c.name}</span>
                  <strong>{formatCurrency(c.value)}</strong>
                </div>
                <div className="categoria-bar-track">
                  <div className="categoria-bar-fill" style={{ width: `${c.pct}%`, background: c.color }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button className="link-btn" onClick={() => onNavigate('lancamentos')}>
        Ver todos os lançamentos →
      </button>

      {modalOpen && <TransactionModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}
