import { useMemo, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { Transaction } from '../types';
import { formatCurrency, formatDate } from '../utils/format';
import { TransactionModal } from '../components/TransactionModal';

export function Lancamentos() {
  const transactions = useAppStore((s) => s.transactions);
  const removeTransaction = useAppStore((s) => s.removeTransaction);

  const [search, setSearch] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Transaction | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);

  const filtered = useMemo(() => {
    let rows = [...transactions];
    if (search) rows = rows.filter((t) => t.description.toLowerCase().includes(search.toLowerCase()));
    if (filterTipo) rows = rows.filter((t) => t.type === filterTipo);
    return rows.sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions, search, filterTipo]);

  return (
    <div className="lancamentos">
      <div className="lancamentos-toolbar">
        <input
          data-testid="input-busca"
          className="input"
          placeholder="🔍 Buscar por descrição..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          data-testid="filtro-tipo"
          className="input"
          value={filterTipo}
          onChange={(e) => setFilterTipo(e.target.value)}
        >
          <option value="">Todos os tipos</option>
          <option value="income">Receita</option>
          <option value="expense">Despesa</option>
        </select>
        <button data-testid="btn-novo-lancamento" className="btn-primary" onClick={() => setModalOpen(true)}>
          + Novo lançamento
        </button>
      </div>

      <div data-testid="contador-lancamentos" className="lancamentos-count">
        {filtered.length} registro{filtered.length !== 1 ? 's' : ''}
      </div>

      <div className="card lancamentos-card">
        {transactions.length === 0 ? (
          <div data-testid="lista-vazia" className="empty-state">
            <div className="empty-icon">📂</div>
            <p>Nenhum lançamento cadastrado ainda.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div data-testid="lista-sem-resultado" className="empty-state">
            <div className="empty-icon">🔎</div>
            <p>Nenhum resultado para os filtros aplicados.</p>
          </div>
        ) : (
          <div className="lancamentos-list">
            {filtered.map((t) => (
              <div key={t.id} data-testid="linha-lancamento" className="lancamento-row">
                <div className="lancamento-info">
                  <div data-testid="lancamento-descricao" className="lancamento-descricao">
                    {t.description}
                  </div>
                  <div className="lancamento-meta">
                    {formatDate(t.date)} · {t.category}
                  </div>
                </div>
                <div
                  data-testid="lancamento-valor"
                  className="lancamento-valor"
                  style={{ color: t.type === 'income' ? 'var(--success)' : 'var(--danger)' }}
                >
                  {t.type === 'income' ? '+' : '−'} {formatCurrency(t.amount)}
                </div>
                <div className="lancamento-acoes">
                  <button data-testid="btn-editar" className="btn-icon" title="Editar" onClick={() => setEditTarget(t)}>
                    ✏
                  </button>
                  <button data-testid="btn-excluir" className="btn-icon danger" title="Excluir" onClick={() => setDeleteTarget(t)}>
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalOpen && <TransactionModal onClose={() => setModalOpen(false)} />}
      {editTarget && <TransactionModal editing={editTarget} onClose={() => setEditTarget(null)} />}

      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div data-testid="modal-exclusao" className="confirm-box" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon">🗑️</div>
            <h3>Excluir lançamento?</h3>
            <p>
              <strong>{deleteTarget.description}</strong>
              <br />
              Esta ação não poderá ser desfeita.
            </p>
            <div className="confirm-actions">
              <button data-testid="btn-cancelar-exclusao" className="btn-secondary" onClick={() => setDeleteTarget(null)}>
                Cancelar
              </button>
              <button
                data-testid="btn-confirmar-exclusao"
                className="btn-danger"
                onClick={() => {
                  removeTransaction(deleteTarget.id);
                  setDeleteTarget(null);
                }}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
