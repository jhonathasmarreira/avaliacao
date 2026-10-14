import { useState } from 'react';
import { useSimuladorJavaStore } from '../store/useSimuladorJavaStore';
import { QUESTOES } from '../questoes';
import { executarQuestaoJavaPleno } from '../runner';
import { ResultadoLogPanel } from '../../simulador/components/ResultadoLogPanel';
import { RespostaDissertativa } from '../../simulador/components/RespostaDissertativa';
import { QuestaoDescricao } from '../../simulador/components/QuestaoDescricao';
import { JavaPlenoEditor } from '../components/JavaPlenoEditor';

const STATUS_RESPONDIDAS: Array<string> = ['aprovada', 'reprovada', 'respondida'];

export function SimuladorPage() {
  const questaoAtual = useSimuladorJavaStore((s) => s.questaoAtual);
  const respostas = useSimuladorJavaStore((s) => s.respostas);
  const candidato = useSimuladorJavaStore((s) => s.candidato);
  const irPara = useSimuladorJavaStore((s) => s.irPara);
  const atualizarCodigo = useSimuladorJavaStore((s) => s.atualizarCodigo);
  const marcarExecutando = useSimuladorJavaStore((s) => s.marcarExecutando);
  const registrarResultado = useSimuladorJavaStore((s) => s.registrarResultado);
  const finalizarAvaliacao = useSimuladorJavaStore((s) => s.finalizarAvaliacao);

  const [rodando, setRodando] = useState(false);

  const questao = QUESTOES.find((q) => q.numero === questaoAtual) ?? QUESTOES[0];
  const resposta = respostas[questao.numero];
  // Só a contagem de quantas questões já foram executadas/respondidas, não quantas
  // passaram: durante a prova o candidato não deve ver se acertou ou errou.
  const respondidas = QUESTOES.filter((q) =>
    STATUS_RESPONDIDAS.includes(respostas[q.numero]?.status ?? 'pendente')
  ).length;
  const jaExecutou = STATUS_RESPONDIDAS.includes(resposta.status);
  const proximaQuestao = QUESTOES.find((q) => q.numero === questao.numero + 1);

  async function executar() {
    if (rodando) return;
    setRodando(true);
    marcarExecutando(questao.numero);
    const resultado = await executarQuestaoJavaPleno(questao.numero, resposta.codigo);
    registrarResultado(questao.numero, resultado);
    setRodando(false);
  }

  function salvarResposta() {
    registrarResultado(questao.numero, {
      status: 'respondida',
      log: [{ tipo: 'info', texto: 'Resposta registrada.' }],
    });
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
          ⚠ Não recarregue (F5) nem feche a aba: não há salvamento automático e você perderá o
          progresso.
        </p>

        <ul data-testid="lista-questoes" className="lista-questoes">
          {QUESTOES.map((q) => {
            const status = respostas[q.numero]?.status ?? 'pendente';
            // Exibição não diferencia aprovada/reprovada/respondida: só se já foi
            // concluída ou não.
            const executada = STATUS_RESPONDIDAS.includes(status);
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

        {questao.dissertativa ? (
          <div className="simulador-dissertativa">
            <RespostaDissertativa
              value={resposta.codigo}
              onChange={(texto) => atualizarCodigo(questao.numero, texto)}
              onSalvar={salvarResposta}
            />
            <div className="simulador-editor-acoes">
              <button data-testid="btn-salvar-resposta" className="btn-primary" onClick={salvarResposta}>
                Salvar resposta (Ctrl+Enter)
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
                {jaExecutou ? 'respondida' : 'pendente'}
              </span>
            </div>
          </div>
        ) : (
          <div className="simulador-painel">
            <div className="simulador-editor">
              <JavaPlenoEditor
                value={resposta.codigo}
                onChange={(codigo) => atualizarCodigo(questao.numero, codigo)}
                onExecutar={executar}
              />
              <div className="simulador-editor-acoes">
                <button data-testid="btn-executar" className="btn-primary" onClick={executar} disabled={rodando}>
                  {rodando ? 'Executando…' : 'Compilar e executar (Ctrl+Enter)'}
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
              <p className="simulador-sandbox-titulo">Classes de apoio (somente leitura)</p>
              <p className="simulador-sandbox-legenda">
                Já existem no ambiente: use-as direto, sem import e sem recriá-las.
              </p>
              <pre data-testid="classes-apoio" className="feature-bloco">
                {questao.classesApoio}
              </pre>
              <p className="simulador-sandbox-titulo">Sobre o compilador</p>
              <ul className="simulador-sandbox-legenda">
                <li>Java 17 em subconjunto: classes, enums simples, interfaces, coleções, streams, lambdas, method references, exceções e classes próprias.</li>
                <li>Não mude o nome da classe nem a assinatura do método: os testes chamam exatamente esses nomes.</li>
                <li>Sem sobrecarga de métodos, classes internas/anônimas, records, switch com "-&gt;" e text blocks.</li>
                <li>System.out.println aparece no log como "saída:".</li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
