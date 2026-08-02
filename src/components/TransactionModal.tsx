import { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../types';
import type { Transaction, TransactionType, Category } from '../types';
import { todayISO } from '../utils/format';

interface Props {
  onClose: () => void;
  editing?: Transaction;
}

interface Errors {
  description?: string;
  amount?: string;
  date?: string;
}

export function TransactionModal({ onClose, editing }: Props) {
  const addTransaction = useAppStore((s) => s.addTransaction);
  const updateTransaction = useAppStore((s) => s.updateTransaction);

  const [type, setType] = useState<TransactionType>(editing?.type ?? 'expense');
  const [description, setDescription] = useState(editing?.description ?? '');
  const [amount, setAmount] = useState(editing ? String(editing.amount) : '');
  const [category, setCategory] = useState<Category>(editing?.category ?? EXPENSE_CATEGORIES[0]);
  const [date, setDate] = useState(editing?.date ?? todayISO());
  const [errors, setErrors] = useState<Errors>({});

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  useEffect(() => {
    if (!categories.includes(category as never)) setCategory(categories[0]);
  }, [type]);

  function validate(): Errors {
    const errs: Errors = {};
    if (!description.trim()) errs.description = 'Informe uma descrição.';
    const val = parseFloat(amount.replace(',', '.'));
    if (isNaN(val) || val <= 0) errs.amount = 'Informe um valor maior que zero.';
    if (!date) errs.date = 'Informe a data.';
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const val = parseFloat(amount.replace(',', '.'));
    const payload = { type, description: description.trim(), amount: val, category, date };

    if (editing) updateTransaction(editing.id, payload);
    else addTransaction(payload);

    onClose();
  }

  return (
    <div
      data-testid="modal-transacao"
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-sheet">
        <div className="modal-handle" />
        <div className="modal-header">
          <h2>{editing ? 'Editar transação' : 'Nova transação'}</h2>
          <button className="btn-icon" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="type-toggle">
            <button
              type="button"
              data-testid="tipo-receita"
              className={`type-btn income${type === 'income' ? ' active' : ''}`}
              onClick={() => setType('income')}
            >
              Receita
            </button>
            <button
              type="button"
              data-testid="tipo-despesa"
              className={`type-btn expense${type === 'expense' ? ' active' : ''}`}
              onClick={() => setType('expense')}
            >
              Despesa
            </button>
          </div>

          <div className="field">
            <label>Descrição</label>
            <input
              data-testid="input-descricao"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Salário, Aluguel..."
            />
            {errors.description && (
              <p data-testid="erro-descricao" className="error">
                {errors.description}
              </p>
            )}
          </div>

          <div className="field">
            <label>Valor (R$)</label>
            <input
              data-testid="input-valor"
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
            />
            {errors.amount && (
              <p data-testid="erro-valor" className="error">
                {errors.amount}
              </p>
            )}
          </div>

          <div className="field">
            <label>Categoria</label>
            <select
              data-testid="select-categoria"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Data</label>
            <input
              data-testid="input-data"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            {errors.date && (
              <p data-testid="erro-data" className="error">
                {errors.date}
              </p>
            )}
          </div>

          <button type="submit" data-testid="btn-salvar" className="btn-primary btn-block">
            {editing ? 'Salvar alterações' : 'Adicionar transação'}
          </button>
        </form>
      </div>
    </div>
  );
}
