/* =========================================================
   BOLETIM DIGITAL — 9º ANO
   ========================================================= */

const CONFIG_ALUNO = {
  turma: "C",
  numeroChamada: 8,
  apiUrl: "https://boletim-api.profbt.com.br"
};

// Sessão em memória
let pinSessao = "";
let dadosAtuais = [];
let modoEdicao = false;

/* ---------- DADOS LOCAIS/FICTÍCIOS ---------- */
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

/* ---------- NORMALIZAÇÃO E CÁLCULOS ---------- */
function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }
  let numero = typeof valor === "string" ? valor.replace(",", ".") : valor;
  numero = Number(numero);
  if (isNaN(numero)) {
    return null;
  }
  if (numero >= 0 && numero <= 10) {
    return numero;
  }
  if (numero > 10 && numero <= 100) {
    return numero / 10;
  }
  return null;
}

function formatarNota(nota) {
  if (nota === null) return null;
  return nota.toFixed(1).replace(".", ",");
}

function calcularMedia(notas) {
  const notasValidas = notas.filter((n) => n !== null);
  if (notasValidas.length === 0) return null;
  let soma = 0;
  notasValidas.forEach((n) => {
    soma += n;
  });
  return soma / notasValidas.length;
}

function definirSituacao(media) {
  if (media === null) return { texto: "Nota ainda não disponível", classe: "indisponivel" };
  if (media >= 6.0) return { texto: "Bom desempenho", classe: "bom" };
  return { texto: "Atenção", classe: "atencao" };
}

function montarResumo(item) {
  const n1 = normalizarNota(item.tri1);
  const n2 = normalizarNota(item.tri2);
  const n3 = normalizarNota(item.tri3);

  const media = calcularMedia([n1, n2, n3]);

  let totalFaltas = 0;
  if (Array.isArray(item.faltas)) {
    totalFaltas = item.faltas.reduce((acc, f) => acc + (Number(f) || 0), 0);
  } else if (typeof item.faltas === "number") {
    totalFaltas = item.faltas;
  }

  const situacao = definirSituacao(media);

  return {
    disciplina: item.disciplina,
    n1, n2, n3,
    media,
    totalFaltas,
    faltasArray: Array.isArray(item.faltas) ? item.faltas : [0, 0, 0],
    situacao
  };
}

/* ---------- RENDERIZAÇÃO DA TELA ---------- */
const corpoTabela = document.getElementById("corpoTabela");
const areaCards = document.getElementById("cardsResumo");

function renderizarTela() {
  const resumos = dadosAtuais.map(montarResumo);

  // Preencher Tabela
  corpoTabela.innerHTML = "";
  resumos.forEach((r, idx) => {
    const linha = document.createElement("tr");

    const tdDisc = document.createElement("td");
    tdDisc.