import { useCallback, useRef, useState } from 'react';
import { useSimuladorCucumberStore } from '../store/useSimuladorCucumberStore';
import { QUESTOES } from '../questoes';
import { criarExecutorGherkin } from '../../simulador/miniCy/gherkinRunner';
import { CATALOGO_STEPS } from '../gherkinCatalogo';
import type { SandboxController } from '../../simulador/types';
import { SandboxFrame } from '../../simulador/components/SandboxFrame';
import { QuestaoDescricao } from '../../simulador/components/QuestaoDescricao';
import { ResultadoLogPanel } from '../../simulador/components/ResultadoLogPanel';
import { GherkinEditor } from '../components/GherkinEditor';
import { GherkinAjuda } from '../components/GherkinAjuda';

const executarQuestaoGherkin = criarExecutorGherkin(CATALOGO_STEPS);

export function SimuladorPage() {
  const questaoAtual = useSimuladorCucumberStore((s) => s.questaoAtual);
  const respostas = useSimuladorCucumberStore((s) => s.respostas);
  const candidato = useSimuladorCucumberStore((s) => s.candidato);
  const irPara = useSimuladorCucumberStore((s) => s.irPara);
  const atualizarCodigo = useSimuladorCucumberStore((s) => s.atualizarCodigo);
  const marcarExecutando = useSimuladorCucumberStore((s) => s.marcarExecutando);
  const registrarResultado = useSimuladorCucumberStore((s) => s.registrarResultado);
  const finalizarAvaliacao = useSimuladorCucumberStore((s) => s.finalizarAvaliacao);

  const sandboxRef = useRef<SandboxController | null>(null);
  const [rodando, setRodando] = useState(false);

  const questao = QUESTOES.find((q) => q.numero === questaoAtual) ?? QUESTOES[0];
  const resposta = respostas[questao.numero];
  // Só a contagem de quantas questões já foram executadas, não quantas passaram:
  // durante a prova o candidato não deve ver se acertou ou errou.
  const respondidas = QUESTOES.filter(
    (q) => respostas[q.numero]?.status === 'aprovada' || respostas[q.numero]?.status === 'reprovada'
  ).length;
  const jaExecutou = resposta.status === 'aprovada' || resposta.status === 'reprovada';
  const proximaQuestao = QUESTOES.find((q) => q.numero === questao.numero + 1);

  const handleReady = useCallback((controller: SandboxController) => {
    sandboxRef.current = controller;
  }, []);

  async function executar() {
    if (!sandboxRef.current || rodando) return;
    setRodando(true);
    marcarExecutando(questao.numero);
    const resultado = await executarQuestaoGherkin(sandboxRef.current, resposta.codigo);
    registrarResultado(questao.numero, resultado);
    setRodando(false);
  }

  return (
    <div className="simulador-shell">
      <aside className="simulador-sidebar">
        <div className="simulador-sidebar-header">
          <strong data-testid="simulador-candidato-nome">{candidato?.nomeCompleto}</strong>
          <span data-testid="simulador-placar">
            {respondidas}/{QUESTOES.length} questões respondidas
          </span>
        </div>

        <p data-testid="aviso-sem-salvamento" className="simulador-aviso">
          ⚠ Não recarregue (F5) nem feche a aba — não há salvamento automático e você perderá o
          progresso.
        </p>

        <ul data-testid="lista-questoes" className="lista-questoes">
          {QUESTOES.map((q) => {
            const status = respostas[q.numero]?.status ?? 'pendente';
            // Exibição não diferencia aprovada/reprovada: só se já foi executada ou não.
            const executada = status === 'aprovada' || status === 'reprovada';
            const classeStatus = executada ? 'executada' : status;
            return (
              <li key={q.numero}>
                <button
                  data-testid={`questao-item-${q.numero}`}
                  className={`questao-item questao-${classeStatus} ${q.numero === questaoAtual ? 'questao-ativa' : ''}`}
                  onClick={() => irPara(q.numero)}
                >
                  <span className="questao-numero">{String(q.numero).padStart(2, '0')}</span>
                  <span className="questao-titulo">{q.titulo}</span>
                  <span className="questao-status-icone">
                    {status === 'executando' ? '…' : executada ? '●' : ''}
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
            <GherkinAjuda />
            <GherkinEditor
              value={resposta.codigo}
              onChange={(codigo) => atualizarCodigo(questao.numero, codigo)}
              onExecutar={executar}
            />
            <div className="simulador-editor-acoes">
              <button data-testid="btn-executar" className="btn-primary" onClick={executar} disabled={rodando}>
                {rodando ? 'Executando…' : 'Executar teste (Ctrl+Enter)'}
              </button>
              {jaExecutou && proximaQuestao && (
                <button
                  data-testid="btn-proxima-questao"
                  className="btn-secondary"
                  onClick={() => irPara(proximaQuestao.numero)}
                >
                  Próxima questão →
                </button>
              )}
              <span data-testid="questao-status" className="questao-badge">
                {resposta.status === 'executando'
                  ? 'executando'
                  : jaExecutou
                    ? 'executado'
                    : 'pendente'}
              </span>
            </div>
            <ResultadoLogPanel log={resposta.log} />
          </div>

          <div className="simulador-sandbox">
            <p className="simulador-sandbox-titulo">App sob teste</p>
            <p className="simulador-sandbox-legenda">
              Aplicação financeira fictícia que seu cenário testa. Ela tem seu próprio login (nome/e-mail
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
