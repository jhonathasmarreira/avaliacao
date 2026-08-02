// Lê cypress/relatorio/resumo.json (gerado pelo hook after:run do
// cypress.config.cjs) e monta o assunto/corpo do e-mail final enviado
// pelo GitHub Action para francisco.marreira@engesoftware.com.br.
//
// Gera dois arquivos na raiz do projeto:
//   - email-subject.txt
//   - email-body.txt
// e, se disponível, escreve também a saída "subject" em $GITHUB_OUTPUT.

const fs = require('fs');
const path = require('path');

const raiz = path.join(__dirname, '..');
const resumoPath = path.join(raiz, 'cypress', 'relatorio', 'resumo.json');

let resumo = null;
try {
  resumo = JSON.parse(fs.readFileSync(resumoPath, 'utf-8'));
} catch (e) {
  resumo = null;
}

const repo = process.env.GITHUB_REPOSITORY || 'repositório desconhecido';
const branch = process.env.GITHUB_REF_NAME || 'branch desconhecida';
const actor = process.env.GITHUB_ACTOR || 'desconhecido';
const runUrl =
  process.env.GITHUB_SERVER_URL && process.env.GITHUB_RUN_ID
    ? `${process.env.GITHUB_SERVER_URL}/${repo}/actions/runs/${process.env.GITHUB_RUN_ID}`
    : '';

let subject;
let body;

if (resumo) {
  const nome = (resumo.candidato && resumo.candidato.nomeCompleto) || 'Nome não informado';
  const email = (resumo.candidato && resumo.candidato.email) || 'E-mail não informado';

  subject = `Avaliação Cypress - ${nome} - ${resumo.aprovados}/${resumo.totalTestes} questões aprovadas`;

  const linhas = (resumo.questoes || [])
    .map((q) => {
      const status = q.estado === 'passed' ? 'OK' : q.estado === 'failed' ? 'FALHOU' : String(q.estado).toUpperCase();
      return `  [${status}] ${q.titulo}`;
    })
    .join('\n');

  body = [
    'Resultado da avaliação técnica de Cypress',
    '',
    `Candidato: ${nome}`,
    `E-mail informado: ${email}`,
    `Repositório: ${repo} (branch: ${branch})`,
    `Executado por: ${actor}`,
    runUrl ? `Execução: ${runUrl}` : '',
    '',
    `Total de questões: ${resumo.totalTestes}`,
    `Aprovadas: ${resumo.aprovados}`,
    `Reprovadas: ${resumo.reprovados}`,
    `Pendentes: ${resumo.pendentes}`,
    '',
    'Detalhamento por questão:',
    linhas,
    '',
    'Relatório completo em anexo/artefato do GitHub Actions.',
  ]
    .filter(Boolean)
    .join('\n');
} else {
  subject = `Avaliação Cypress - Falha ao executar os testes (${repo})`;
  body = [
    'Não foi possível gerar o resumo da avaliação.',
    'Isso normalmente indica que a aplicação não buildou ou o Cypress não chegou a rodar.',
    '',
    `Repositório: ${repo} (branch: ${branch})`,
    `Executado por: ${actor}`,
    runUrl ? `Execução: ${runUrl}` : '',
    'Verifique os logs do GitHub Actions para mais detalhes.',
  ]
    .filter(Boolean)
    .join('\n');
}

fs.writeFileSync(path.join(raiz, 'email-subject.txt'), subject);
fs.writeFileSync(path.join(raiz, 'email-body.txt'), body);

if (process.env.GITHUB_OUTPUT) {
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `subject=${subject}\n`);
}

console.log('Assunto:', subject);
console.log('---');
console.log(body);
