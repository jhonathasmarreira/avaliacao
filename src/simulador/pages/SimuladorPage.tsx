import { useCallback, useRef, useState } from 'react';
import { useSimuladorStore } from '../store/useSimuladorStore';
import { QUESTOES } from '../questoes';
import { executarQuestao } from '../miniCy/runner';
import type { SandboxController } from '../types';
import { SandboxFrame } from '../components/SandboxFrame';
import { CodeEditor } from '../components/CodeEditor';
import { QuestaoDescricao } from '../components/QuestaoDescricao';
import { ResultadoLogPanel } from '../components/ResultadoLogPanel';

export function SimuladorPage() {
  const questaoAtual = useSimuladorStore((s) => s.questaoAtual);
  const respostas = useSimuladorStore((s) => s.respostas);
  const candidato = useSimuladorStore((s) => s.candidato);
  const irPara = useSimuladorStore((s) => s.irPara);
  const atualizarCodigo = useSimuladorStore((s) => s.atualizarCodigo);
  const marcarExecutando = useSimuladorStore((s) => s.marcarExecutando);
  const registrarResultado = useSimuladorStore((s) => s.registrarResultado);
  const finalizarAvaliacao = useSimuladorStore((s) => s.finalizarAvaliacao);

  const sandboxRef = useRef<SandboxController | null>(null);
  const [rodando, setRodando] = useState(false);

  const questao = QUESTOES.find((q) => q.numero === questaoAtual) ?? QUESTOES[0];
  const resposta = respostas[questao.numero];
  const aprovadas = QUESTOES.filter((q) => respostas[q.numero]?.status === 'aprovada').length;

  const handleReady = useCallback((controller: SandboxController) => {
    sandboxRef.current = controller;
  }, []);

  async function executar() {
    if (!sandboxRef.current || rodando) return;
    setRodando(true);
    marcarExecutando(questao.numero);
    const resultado = await executarQuestao(sandboxRef.current, resposta.codigo);
    registrarResultado(questao.numero, resultado);
    setRodando(false);
  }

  return (
    <div className="simulador-shell">
      <aside className="simulador-sidebar">
        <div className="simulador-sidebar-header">
          <strong data-testid="simulador-candidato-nome">{candidato?.nomeCompleto}</strong>
          <span data-testid="simulador-placar">
            {aprovadas}/{QUESTOES.length} aprovadas
          </span>
        </div>

        <p data-testid="aviso-sem-salvamento" className="simulador-aviso">
          ⚠ Não recarregue (F5) nem feche a aba — não há salvamento automático e você perderá o
          progresso.
        </p>

        <ul data-testid="lista-questoes" className="lista-questoes">
          {QUESTOES.map((q) => {
            const status = respostas[q.numero]?.status ?? 'pendente';
            return (
              <li key={q.numero}>
                <button
                  data-testid={`questao-item-${q.numero}`}
                  className={`questao-item questao-${status} ${q.numero === questaoAtual ? 'questao-ativa' : ''}`}
                  onClick={() => irPara(q.numero)}
                >
                  <span className="questao-numero">{String(q.numero).padStart(2, '0')}</span>
                  <span className="questao-titulo">{q.titulo}</span>
                  <span className="questao-status-icone">
                    {status === 'aprovada' ? '✔' : status === 'reprovada' ? '✖' : status === 'executando' ? '…' : ''}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <button data-testid="btn-finalizar-avaliacao" className="btn-primary btn-block" onClick={finalizarAvaliacao}>
          Finalizar avaliação
        </button>
      </aside>

      <main className="simulador-main">
        <QuestaoDescricao questao={questao} />

        <div className="simulador-painel">
          <div className="simulador-editor">
            <CodeEditor
              value={resposta.codigo}
              onChange={(codigo) => atualizarCodigo(questao.numero, codigo)}
              onExecutar={executar}
            />
            <div className="simulador-editor-acoes">
              <button data-testid="btn-executar" className="btn-primary" onClick={executar} disabled={rodando}>
                {rodando ? 'Executando…' : 'Executar teste (Ctrl+Enter)'}
              </button>
              <span data-testid="questao-status" className={`questao-badge questao-badge-${resposta.status}`}>
                {resposta.status}
              </span>
            </div>
            <ResultadoLogPanel log={resposta.log} status={resposta.status} />
          </div>

          <div className="simulador-sandbox">
            <p className="simulador-sandbox-titulo">App sob teste</p>
            <p className="simulador-sandbox-legenda">
              Aplicação financeira fictícia que seu código testa. Ela tem seu próprio login (nome/e-mail
              de mentira) — diferente da sua identificação — que quase todo teste precisa passar antes de
              chegar no Dashboard.
            </p>
            <SandboxFrame onReady={handleReady} />
          </div>
        </div>
      </main>
    </div>
  );
}
