/* =========================================================
   BOLETIM DIGITAL — 9º ANO
   Dados fictícios apenas para demonstração.
   ========================================================= */

/* ---------- CONCEITO: ARRAY ----------
   Um array é uma lista. Aqui ele guarda vários objetos. */
const dadosDisciplinas = [
  { disciplina: "Língua Portuguesa", tri1: 78, tri2: "8,2", tri3: 8.6, faltas: [2, 2, 1] },
  { disciplina: "Matemática", tri1: 55, tri2: "5,4", tri3: null, faltas: [3, 2, 2] },
  { disciplina: "Ciências", tri1: 84, tri2: 7.9, tri3: "8,3", faltas: [1, 1, 1] },
  { disciplina: "História", tri1: "7,1", tri2: 82, tri3: null, faltas: [1, 2, 1] },
  { disciplina: "Geografia", tri1: 69, tri2: "7,5", tri3: 7.8, faltas: [0, 1, 1] },
  { disciplina: "Língua Inglesa", tri1: 88, tri2: 8.4, tri3: null, faltas: [1, 0, 1] },
  { disciplina: "Arte", tri1: "9,2", tri2: 87, tri3: 9.0, faltas: [1, 1, 0] },
  { disciplina: "Educação Física", tri1: 96, tri2: "9,3", tri3: null, faltas: [0, 1, 0] },
  { disciplina: "Educação Digital", tri1: 91, tri2: 8.9, tri3: "9,4", faltas: [1, 1, 0] },
  { disciplina: "Educação Financeira", tri1: 76, tri2: "7,2", tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Rec. Aprend. Matemática", tri1: 58, tri2: "5,9", tri3: 6.2, faltas: [2, 2, 1] },
  { disciplina: "Leitura Rec. Aprend. Lingua Portuguesa", tri1: 72, tri2: "7,6", tri3: null, faltas: [2, 1, 1] },
  { disciplina: "Pensamento Lógico", tri1: 49, tri2: 5.5, tri3: "5,8", faltas: [2, 2, 2] },
  { disciplina: "Literatura Arte e Movimento", tri1: "8,0", tri2: 84, tri3: null, faltas: [1, 1, 0] },
  { disciplina: "Práticas Experimentais", tri1: 64, tri2: "6,6", tri3: 7.0, faltas: [1, 1, 1] }
];

/* ---------- CONCEITO: FUNÇÃO ----------
   Uma função é um bloco de código que faz uma tarefa.
   Esta recebe um valor "cru" e devolve a nota na escala 0–10. */
function normalizarNota(valor) {
  // vazio, null ou undefined → nota ainda não lançada
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  // Se vier como texto com vírgula, troca por ponto para o Number entender
  let numero = typeof valor === "string" ? valor.replace(",", ".") : valor;
  numero = Number(numero);

  // Se não for um número válido, trata como inválido
  if (isNaN(numero)) {
    return null;
  }

  // Regra: entre 0 e 10 permanece igual
  if (numero >= 0 && numero <= 10) {
    return numero;
  }

  // Regra: maior que 10 e até 100 → divide por 10 (ex.: 89 → 8.9)
  if (numero > 10 && numero <= 100) {
    return numero / 10;
  }

  // Qualquer outro valor é inválido
  return null;
}

/* Formata a nota para exibir com 1 casa decimal e vírgula (ex.: 8,5) */
function formatarNota(nota) {
  if (nota === null) return null;
  return nota.toFixed(1).replace(".", ",");
}

/* ---------- CONCEITO: CONCEITO DE MÉDIA ----------
   Calcula a média usando apenas as notas disponíveis.
   Nota ausente NUNCA vira zero. */
function calcularMedia(notas) {
  const notasValidas = notas.filter((n) => n !== null);
  if (notasValidas.length === 0) return null;

  let soma = 0;
  // ---------- CONCEITO: forEach ----------
  // forEach percorre cada item do array
  notasValidas.forEach((n) => {
    soma += n;
  });

  return soma / notasValidas.length;
}

/* ---------- CONCEITO: IF ----------
   if = "se". Decide a situação com base na média. */
function definirSituacao(media) {
  if (media === null) return { texto: "Nota ainda não disponível", classe: "indisponivel" };
  if (media >= 6.0) return { texto: "Bom desempenho", classe: "bom" };
  return { texto: "Atenção", classe: "atencao" };
}

/* ---------- CONCEITO: OBJETO ----------
   Um objeto agrupa informações com nomes.
   Aqui montamos um "resumo" de cada disciplina. */
function montarResumo(disciplina) {
  const n1 = normalizarNota(disciplina.tri1);
  const n2 = normalizarNota(disciplina.tri2);
  const n3 = normalizarNota(disciplina.tri3);

  const media = calcularMedia([n1, n2, n3]);

  // Soma todas as faltas do array de faltas
  const totalFaltas = disciplina.faltas.reduce((acc, f) => acc + f, 0);

  const situacao = definirSituacao(media);

  return {
    disciplina: disciplina.disciplina,
    n1, n2, n3,
    media,
    totalFaltas,
    situacao
  };
}

/* =========================================================
   PARTE VISUAL — preencher a tela
   ========================================================= */

// ---------- CONCEITO: DOM ----------
// DOM é a representação da página em JavaScript.
// Com ele conseguimos criar e alterar elementos HTML.

const corpoTabela = document.getElementById("corpoTabela");
const areaCards = document.getElementById("cardsResumo");

// Guardamos o resumo de todas as disciplinas aqui
const resumos = dadosDisciplinas.map(montarResumo);

/* Preenche as linhas da tabela */
function preencherTabela() {
  corpoTabela.innerHTML = "";

  resumos.forEach((r) => {
    const linha = document.createElement("tr");

    const exibirNota = (n) =>
      n === null ? '<span class="sem-nota">Ainda não lançada</span>' : formatarNota(n);

    linha.innerHTML = `
      <td>${r.disciplina}</td>
      <td>${exibirNota(r.n1)}</td>
      <td>${exibirNota(r.n2)}</td>
      <td>${exibirNota(r.n3)}</td>
      <td>${r.media === null ? '<span class="sem-nota">—</span>' : formatarNota(r.media)}</td>
      <td>${r.totalFaltas}</td>
      <td><span class="situacao ${r.situacao.classe}">${r.situacao.texto}</span></td>
    `;

    corpoTabela.appendChild(linha);
  });
}

/* Cria um card de resumo */
function criarCard(titulo, valor, detalhe, classeExtra = "") {
  const card = document.createElement("div");
  card.className = "card " + classeExtra;
  card.innerHTML = `
    <h3>${titulo}</h3>
    <p class="valor">${valor}</p>
    ${detalhe ? `<p class="detalhe">${detalhe}</p>` : ""}
  `;
  return card;
}

/* Preenche os cards do topo */
function preencherCards() {
  areaCards.innerHTML = "";

  // Média geral (somente das disciplinas que têm média)
  const mediasValidas = resumos.map((r) => r.media).filter((m) => m !== null);
  const mediaGeral =
    mediasValidas.length === 0
      ? null
      : mediasValidas.reduce((a, b) => a + b, 0) / mediasValidas.length;

  // Total de faltas
  const totalFaltas = resumos.reduce((acc, r) => acc + r.totalFaltas, 0);

  // Disciplinas com bom desempenho
  const bomDesempenho = resumos.filter((r) => r.situacao.classe === "bom").length;

  // Disciplinas que precisam de atenção
  const atencao = resumos.filter((r) => r.situacao.classe === "atencao").length;

  // Frequência FICTÍCIA — apenas demonstrativa nesta etapa
  // No futuro será calculada de outra forma.
  const frequenciaDemonstrativa = "92%";

  areaCards.appendChild(
    criarCard("Média geral", mediaGeral === null ? "—" : formatarNota(mediaGeral))
  );
  areaCards.appendChild(criarCard("Total de faltas", totalFaltas, "", "azul"));
  areaCards.appendChild(criarCard("Bom desempenho", bomDesempenho + " disciplinas"));
  areaCards.appendChild(criarCard("Precisam de atenção", atencao + " disciplinas", "", "azul"));
  areaCards.appendChild(
    criarCard("Frequência", frequenciaDemonstrativa, "Frequência adequada")
  );
}

/* Roda tudo quando a página abre */
preencherCards();
preencherTabela();