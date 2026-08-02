export type TransactionType = 'income' | 'expense';

export const INCOME_CATEGORIES = [
  'Salário',
  'Freelance',
  'Investimentos',
  'Outros (Receita)',
] as const;

export const EXPENSE_CATEGORIES = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Lazer',
  'Saúde',
  'Educação',
  'Outros (Despesa)',
] as const;

export type IncomeCategory = (typeof INCOME_CATEGORIES)[number];
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
export type Category = IncomeCategory | ExpenseCategory;

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  category: Category;
  date: string; // YYYY-MM-DD
}

export interface Candidato {
  nomeCompleto: string;
  email: string;
}

export type Page = 'dashboard' | 'lancamentos';
