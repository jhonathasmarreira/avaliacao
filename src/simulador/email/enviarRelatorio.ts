import emailjs from '@emailjs/browser';
import type { Candidato, Questao, Resposta } from '../types';

export interface EnvioResultado {
  ok: boolean;
  motivo?: string;
}

// Questões dissertativas (ver Questao.dissertativa) não são corrigidas
// automaticamente — não entram na conta de aprovadas/total, e a resposta em
// texto livre do candidato vai destacada à parte no resumo, pro avaliador ler
// e corrigir manualmente.
function questoesAutomaticas(questoes: Questao[]): Questao[] {
  return questoes.filter((q) => !q.dissertativa);
}

export function contarAprovadas(questoes: Questao[], respostas: Record<number, Resposta>): number {
  return questoesAutomaticas(questoes).filter((q) => respostas[q.numero]?.status === 'aprovada').length;
}

export function contarTotalAutomaticas(questoes: Questao[]): number {
  return questoesAutomaticas(questoes).length;
}

export function montarResumoTexto(
  questoes: Questao[],
  candidato: Candidato,
  respostas: Record<number, Resposta>,
  nomeProva: string
): string {
  const aprovadas = contarAprovadas(questoes, respostas);
  const totalAutomaticas = contarTotalAutomaticas(questoes);

  const linhas = questoes
    .map((q) => {
      const r = respostas[q.numero];
      const status = q.dissertativa
        ? r?.status === 'respondida'
          ? 'RESPONDIDA'
          : 'PENDENTE'
        : r?.status === 'aprovada'
          ? 'OK'
          : r?.status === 'reprovada'
            ? 'FALHOU'
            : 'PENDENTE';
      const sufixo = q.dissertativa ? ' (dissertativa, correção manual)' : '';
      return `[${status}] Questão ${String(q.numero).padStart(2, '0')} - ${q.titulo}${sufixo}`;
    })
    .join('\n');

  const dissertativas = questoes.filter((q) => q.dissertativa);
  const partes = [
    `Resultado da avaliação técnica - ${nomeProva}`,
    '',
    `Candidato: ${candidato.nomeCompleto}`,
    `E-mail: ${candidato.email}`,
    `Data: ${new Date().toLocaleString('pt-BR')}`,
    '',
    `Aprovadas: ${aprovadas}/${totalAutomaticas}`,
    '',
    'Detalhamento por questão:',
    linhas,
  ];

  if (dissertativas.length > 0) {
    partes.push('', 'Respostas dissertativas (correção manual):');
    for (const q of dissertativas) {
      const resposta = (respostas[q.numero]?.codigo ?? '').trim();
      partes.push('', `Questão ${String(q.numero).padStart(2, '0')} - ${q.titulo}:`, resposta || '(sem resposta)');
    }
  }

  return partes.join('\n');
}

export async function enviarRelatorio(
  questoes: Questao[],
  candidato: Candidato,
  respostas: Record<number, Resposta>,
  nomeProva: string
): Promise<EnvioResultado> {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    return {
      ok: false,
      motivo: 'Envio automático de e-mail não configurado neste ambiente (VITE_EMAILJS_*). Copie o relatório abaixo e envie manualmente.',
    };
  }

  const aprovadas = contarAprovadas(questoes, respostas);

  try {
    await emailjs.send(
      serviceId,
      templateId,
      {
        candidato_nome: candidato.nomeCompleto,
        candidato_email: candidato.email,
        aprovadas,
        total: contarTotalAutomaticas(questoes),
        resumo: montarResumoTexto(questoes, candidato, respostas, nomeProva),
      },
      { publicKey }
    );
    return { ok: true };
  } catch (erro) {
    return {
      ok: false,
      motivo: erro instanceof Error ? erro.message : 'Falha desconhecida ao enviar o e-mail.',
    };
  }
}
