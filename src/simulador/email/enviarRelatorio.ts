import emailjs from '@emailjs/browser';
import type { Candidato, Resposta } from '../types';
import { QUESTOES } from '../questoes';

export interface EnvioResultado {
  ok: boolean;
  motivo?: string;
}

export function contarAprovadas(respostas: Record<number, Resposta>): number {
  return QUESTOES.filter((q) => respostas[q.numero]?.status === 'aprovada').length;
}

export function montarResumoTexto(candidato: Candidato, respostas: Record<number, Resposta>): string {
  const aprovadas = contarAprovadas(respostas);
  const linhas = QUESTOES.map((q) => {
    const r = respostas[q.numero];
    const status = r?.status === 'aprovada' ? 'OK' : r?.status === 'reprovada' ? 'FALHOU' : 'PENDENTE';
    return `[${status}] Questão ${String(q.numero).padStart(2, '0')} - ${q.titulo}`;
  }).join('\n');

  return [
    'Resultado da avaliação técnica - Simulador Cypress',
    '',
    `Candidato: ${candidato.nomeCompleto}`,
    `E-mail: ${candidato.email}`,
    `Data: ${new Date().toLocaleString('pt-BR')}`,
    '',
    `Aprovadas: ${aprovadas}/${QUESTOES.length}`,
    '',
    'Detalhamento por questão:',
    linhas,
  ].join('\n');
}

export async function enviarRelatorio(candidato: Candidato, respostas: Record<number, Resposta>): Promise<EnvioResultado> {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    return {
      ok: false,
      motivo: 'Envio automático de e-mail não configurado neste ambiente (VITE_EMAILJS_*). Copie o relatório abaixo e envie manualmente.',
    };
  }

  const aprovadas = contarAprovadas(respostas);

  try {
    await emailjs.send(
      serviceId,
      templateId,
      {
        candidato_nome: candidato.nomeCompleto,
        candidato_email: candidato.email,
        aprovadas,
        total: QUESTOES.length,
        resumo: montarResumoTexto(candidato, respostas),
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
