import { useState } from 'react';
import type { UseBoundStore, StoreApi } from 'zustand';
import type { SimuladorState } from '../store/criarSimuladorStore';

interface Errors {
  nomeCompleto?: string;
  email?: string;
}

interface Props {
  useStore: UseBoundStore<StoreApi<SimuladorState>>;
  logo: string;
  titulo: string;
  descricao: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Compartilhado entre o simulador Cypress e o Cucumber (mesmo formato de
// store, ver criarSimuladorStore) — só muda o texto de apresentação.
export function IdentificacaoAvaliacaoPage({ useStore, logo, titulo, descricao }: Props) {
  const identificar = useStore((s) => s.identificar);
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  function validate(): Errors {
    const errs: Errors = {};
    if (!nomeCompleto.trim()) errs.nomeCompleto = 'Informe seu nome completo.';
    if (!email.trim()) errs.email = 'Informe seu e-mail.';
    else if (!EMAIL_REGEX.test(email.trim())) errs.email = 'Informe um e-mail válido.';
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    identificar({ nomeCompleto: nomeCompleto.trim(), email: email.trim() });
  }

  return (
    <div data-testid="identificacao-avaliacao-page" className="id-wrapper">
      <div className="id-card">
        <div className="id-header">
          <div className="id-logo">{logo}</div>
          <h1>{titulo}</h1>
          <p>{descricao}</p>
        </div>

        <p data-testid="aviso-sem-salvamento" className="id-aviso">
          ⚠ Não há salvamento automático: recarregar a página (F5) ou fechar a aba durante a
          avaliação reinicia tudo do zero e apaga as respostas já digitadas.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="nomeCompleto">Nome completo</label>
            <input
              id="nomeCompleto"
              data-testid="input-nome"
              type="text"
              value={nomeCompleto}
              onChange={(e) => setNomeCompleto(e.target.value)}
              placeholder="Seu nome completo"
            />
            {errors.nomeCompleto && (
              <p data-testid="erro-nome" className="error">
                {errors.nomeCompleto}
              </p>
            )}
          </div>

          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              data-testid="input-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
            />
            {errors.email && (
              <p data-testid="erro-email" className="error">
                {errors.email}
              </p>
            )}
          </div>

          <button type="submit" data-testid="btn-iniciar" className="btn-primary btn-block">
            Iniciar avaliação
          </button>
        </form>
      </div>
    </div>
  );
}
