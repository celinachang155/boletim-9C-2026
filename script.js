/* =========================================================
   BOLETIM DIGITAL — 9º ANO
   ========================================================= */

const CONFIG_ALUNO = {
  turma: "9C",
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
    tdDisc.textContent = r.disciplina;
    linha.appendChild(tdDisc);

    if (modoEdicao) {
      // Modos de edição com inputs
      const orig = dadosAtuais[idx];
      
      const criarInputNota = (valor) => {
        const input = document.createElement("input");
        input.type = "text";
        const valNorm = normalizarNota(valor);
        input.value = valNorm !== null ? formatarNota(valNorm) : "";
        return input;
      };

      const td1 = document.createElement("td");
      const inp1 = criarInputNota(orig.tri1);
      inp1.dataset.campo = "tri1";
      td1.appendChild(inp1);
      linha.appendChild(td1);

      const td2 = document.createElement("td");
      const inp2 = criarInputNota(orig.tri2);
      inp2.dataset.campo = "tri2";
      td2.appendChild(inp2);
      linha.appendChild(td2);

      const td3 = document.createElement("td");
      const inp3 = criarInputNota(orig.tri3);
      inp3.dataset.campo = "tri3";
      td3.appendChild(inp3);
      linha.appendChild(td3);

      const tdMed = document.createElement("td");
      tdMed.textContent = r.media === null ? "—" : formatarNota(r.media);
      linha.appendChild(tdMed);

      const tdFaltas = document.createElement("td");
      const f1 = orig.faltas && orig.faltas[0] !== undefined ? orig.faltas[0] : 0;
      const f2 = orig.faltas && orig.faltas[1] !== undefined ? orig.faltas[1] : 0;
      const f3 = orig.faltas && orig.faltas[2] !== undefined ? orig.faltas[2] : 0;

      const inpF1 = document.createElement("input");
      inpF1.type = "text";
      inpF1.value = f1;
      inpF1.dataset.campo = "f1";
      inpF1.title = "Faltas 1º Tri";

      const inpF2 = document.createElement("input");
      inpF2.type = "text";
      inpF2.value = f2;
      inpF2.dataset.campo = "f2";
      inpF2.title = "Faltas 2º Tri";

      const inpF3 = document.createElement("input");
      inpF3.type = "text";
      inpF3.value = f3;
      inpF3.dataset.campo = "f3";
      inpF3.title = "Faltas 3º Tri";

      tdFaltas.appendChild(inpF1);
      tdFaltas.appendChild(document.createTextNode(" "));
      tdFaltas.appendChild(inpF2);
      tdFaltas.appendChild(document.createTextNode(" "));
      tdFaltas.appendChild(inpF3);
      linha.appendChild(tdFaltas);

    } else {
      // Modo leitura
      const exibirNota = (n) =>
        n === null ? '<span class="sem-nota">Ainda não lançada</span>' : formatarNota(n);

      const td1 = document.createElement("td");
      td1.innerHTML = exibirNota(r.n1);
      linha.appendChild(td1);

      const td2 = document.createElement("td");
      td2.innerHTML = exibirNota(r.n2);
      linha.appendChild(td2);

      const td3 = document.createElement("td");
      td3.innerHTML = exibirNota(r.n3);
      linha.appendChild(td3);

      const tdMed = document.createElement("td");
      tdMed.innerHTML = r.media === null ? '<span class="sem-nota">—</span>' : formatarNota(r.media);
      linha.appendChild(tdMed);

      const tdFaltas = document.createElement("td");
      tdFaltas.textContent = r.totalFaltas;
      linha.appendChild(tdFaltas);
    }

    const tdSit = document.createElement("td");
    const spanSit = document.createElement("span");
    spanSit.className = `situacao ${r.situacao.classe}`;
    spanSit.textContent = r.situacao.texto;
    tdSit.appendChild(spanSit);
    linha.appendChild(tdSit);

    corpoTabela.appendChild(linha);
  });

  // Preencher Cards
  areaCards.innerHTML = "";
  const mediasValidas = resumos.map((r) => r.media).filter((m) => m !== null);
  const mediaGeral =
    mediasValidas.length === 0
      ? null
      : mediasValidas.reduce((a, b) => a + b, 0) / mediasValidas.length;

  const totalFaltas = resumos.reduce((acc, r) => acc + r.totalFaltas, 0);
  const bomDesempenho = resumos.filter((r) => r.situacao.classe === "bom").length;
  const atencao = resumos.filter((r) => r.situacao.classe === "atencao").length;

  areaCards.appendChild(criarCard("Média geral", mediaGeral === null ? "—" : formatarNota(mediaGeral)));
  areaCards.appendChild(criarCard("Total de faltas", totalFaltas, "", "azul"));
  areaCards.appendChild(criarCard("Bom desempenho", bomDesempenho + " disciplinas"));
  areaCards.appendChild(criarCard("Precisam de atenção", atencao + " disciplinas", "", "azul"));
  areaCards.appendChild(criarCard("Frequência", "92%", "Frequência adequada"));
}

function criarCard(titulo, valor, detalhe, classeExtra = "") {
  const card = document.createElement("div");
  card.className = "card " + classeExtra;
  
  const h3 = document.createElement("h3");
  h3.textContent = titulo;
  card.appendChild(h3);

  const pVal = document.createElement("p");
  pVal.className = "valor";
  pVal.textContent = valor;
  card.appendChild(pVal);

  if (detalhe) {
    const pDet = document.createElement("p");
    pDet.className = "detalhe";
    pDet.textContent = detalhe;
    card.appendChild(pDet);
  }

  return card;
}

/* ---------- INTEGRAÇÃO COM A API ---------- */
const btnEntrar = document.getElementById("btnEntrar");
const campoPin = document.getElementById("campoPin");
const msgLogin = document.getElementById("mensagemLogin");

btnEntrar.addEventListener("click", async () => {
  const pinDigitado = campoPin.value.trim();
  if (!pinDigitado) {
    msgLogin.className = "mensagem-status erro";
    msgLogin.textContent = "Digite o PIN.";
    return;
  }

  msgLogin.className = "mensagem-status";
  msgLogin.textContent = "Conectando...";

  try {
    const resposta = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/abrir`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinDigitado
      })
    });

    if (resposta.status === 401) {
      msgLogin.className = "mensagem-status erro";
      msgLogin.textContent = "Turma, chamada ou PIN inválidos.";
      return;
    }

    if (resposta.status === 429) {
      msgLogin.className = "mensagem-status erro";
      msgLogin.textContent = "Muitas tentativas. Aguarde um minuto e tente novamente.";
      return;
    }

    if (!resposta.ok) {
      msgLogin.className = "mensagem-status erro";
      msgLogin.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
      return;
    }

    const resultado = await resposta.json();
    pinSessao = pinDigitado;
    campoPin.value = ""; // Limpa PIN do formulário por segurança

    // Trata dados recebidos x dados locais
    if (resultado.dados && Array.isArray(resultado.dados.disciplinas) && resultado.dados.disciplinas.length > 0) {
      dadosAtuais = resultado.dados.disciplinas;
    } else {
      dadosAtuais = JSON.parse(JSON.stringify(dadosDisciplinas));
    }

    document.getElementById("areaLogin").style.display = "none";
    document.getElementById("painelBoletim").style.display = "block";
    renderizarTela();

  } catch (err) {
    msgLogin.className = "mensagem-status erro";
    msgLogin.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
  }
});

/* ---------- EDIÇÃO E SALVAMENTO ---------- */
const btnAlternarEdicao = document.getElementById("btnAlternarEdicao");
const btnSalvar = document.getElementById("btnSalvar");
const msgEdicao = document.getElementById("mensagemEdicao");

btnAlternarEdicao.addEventListener("click", () => {
  modoEdicao = !modoEdicao;
  btnAlternarEdicao.textContent = modoEdicao ? "Cancelar edição" : "Alterar dados";
  btnSalvar.style.display = modoEdicao ? "inline-block" : "none";
  msgEdicao.textContent = "";
  renderizarTela();
});

function validarNotaInput(valTexto) {
  const v = valTexto.trim();
  if (v === "") return { valido: true, valor: null };
  const vNum = Number(v.replace(",", "."));
  if (!isNaN(vNum) && vNum >= 0 && vNum <= 10) {
    return { valido: true, valor: vNum };
  }
  return { valido: false, valor: null };
}

function validarFaltaInput(valTexto) {
  const v = valTexto.trim();
  const vNum = Number(v);
  if (v !== "" && Number.isInteger(vNum) && vNum >= 0) {
    return { valido: true, valor: vNum };
  }
  return { valido: false, valor: null };
}

btnSalvar.addEventListener("click", async () => {
  msgEdicao.className = "mensagem-status";
  msgEdicao.textContent = "Salvando...";

  let temErro = false;
  const linhas = corpoTabela.querySelectorAll("tr");
  const novosDados = [];

  linhas.forEach((linha, idx) => {
    const itemOriginal = dadosAtuais[idx];
    const inputs = linha.querySelectorAll("input");

    let valTri1 = itemOriginal.tri1;
    let valTri2 = itemOriginal.tri2;
    let valTri3 = itemOriginal.tri3;
    let f1 = 0, f2 = 0, f3 = 0;

    inputs.forEach((inp) => {
      inp.classList.remove("campo-invalido");
      const campo = inp.dataset.campo;

      if (["tri1", "tri2", "tri3"].includes(campo)) {
        const checagem = validarNotaInput(inp.value);
        if (!checagem.valido) {
          inp.classList.add("campo-invalido");
          temErro = true;
        } else {
          if (campo === "tri1") valTri1 = checagem.valor;
          if (campo === "tri2") valTri2 = checagem.valor;
          if (campo === "tri3") valTri3 = checagem.valor;
        }
      }

      if (["f1", "f2", "f3"].includes(campo)) {
        const checagem = validarFaltaInput(inp.value);
        if (!checagem.valido) {
          inp.classList.add("campo-invalido");
          temErro = true;
        } else {
          if (campo === "f1") f1 = checagem.valor;
          if (campo === "f2") f2 = checagem.valor;
          if (campo === "f3") f3 = checagem.valor;
        }
      }
    });

    novosDados.push({
      disciplina: itemOriginal.disciplina,
      tri1: valTri1,
      tri2: valTri2,
      tri3: valTri3,
      faltas: [f1, f2, f3]
    });
  });

  if (temErro) {
    msgEdicao.className = "mensagem-status erro";
    msgEdicao.textContent = "Existem campos com valores inválidos. Verifique os campos destacados.";
    return;
  }

  try {
    const resposta = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/salvar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinSessao,
        dados: {
          disciplinas: novosDados
        }
      })
    });

    if (!resposta.ok) {
      msgEdicao.className = "mensagem-status erro";
      msgEdicao.textContent = "Erro ao salvar alterações. Tente novamente.";
      return;
    }

    dadosAtuais = novosDados;
    modoEdicao = false;
    btnAlternarEdicao.textContent = "Alterar dados";
    btnSalvar.style.display = "none";
    msgEdicao.className = "mensagem-status sucesso";
    msgEdicao.textContent = "Dados salvos com sucesso.";

    renderizarTela();

  } catch (err) {
    msgEdicao.className = "mensagem-status erro";
    msgEdicao.textContent = "Erro de conexão ao salvar alterações. Tente novamente.";
  }
});