// Inicializar toasts
const toastSuccessEl = document.getElementById('toast-success');
const toastErrorEl = document.getElementById('toast-error');
const toastSuccess = new bootstrap.Toast(toastSuccessEl);
const toastError = new bootstrap.Toast(toastErrorEl);

// Função para exibir toast de sucesso
function showSuccess(message = "Operação realizada com sucesso!") {
    toastSuccessEl.querySelector('.toast-body').textContent = message;
    toastSuccess.show();
}

// Função para exibir toast de erro
function showError(message = "Ocorreu um erro. Verifique os dados e tente novamente.") {
    toastErrorEl.querySelector('.toast-body').textContent = message;
    toastError.show();
}

/* Função que formata o campo de entrada como valor monetário */
function formatarCampoMonetario(campo) {
    // Remove tudo que não é dígito
    let valor = campo.value.replace(/\D/g, '');

    // Se for vazio, define como 0
    if (valor === '') {
        valor = '0';
    }

    // Converte para número inteiro
    let valorNumerico = parseInt(valor, 10);

    // Se NaN, define como 0
    if (isNaN(valorNumerico)) {
        valorNumerico = 0;
    }

    // Divide por 100 para obter centavos
    valorNumerico = valorNumerico / 100;

    // Formata para o padrão monetário brasileiro
    let valorFormatado = valorNumerico.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    // Define o valor formatado
    campo.value = valorFormatado;

    // Coloca o cursor no final
    campo.selectionStart = campo.selectionEnd = campo.value.length;
}

// Função para remover formatação monetária e retornar um número
function obterValorNumerico(campo) {
    let valor = campo.value.replace(/\D/g, '');
    return parseFloat(valor) / 100 || 0;
}

// Adicionar event listeners para os campos de faturamento
const camposMonetarios = ["faturamento-realizado", "faturamento-acelerador"];
camposMonetarios.forEach(id => {
    const campo = document.getElementById(id);
    campo.addEventListener('input', () => {
        formatarCampoMonetario(campo);
        calcularPontuacao();
    });
});

// Função para calcular e atualizar o Saldo em tempo real
function atualizarSaldo() {
    const qtdInicios = parseInt(document.getElementById("qtd-inicios").value, 10) || 0;
    const qtdCessadas = parseInt(document.getElementById("qtd-cessadas").value, 10) || 0;
    const ciclos = parseInt(document.getElementById("ciclos").value, 10) || 1;
    const grupos = parseInt(document.getElementById("grupos").value, 10) || 1;

    if (ciclos > 0 && grupos > 0) {
        const saldo = ((qtdInicios - qtdCessadas) / ciclos) / grupos;
        document.getElementById("resultado-saldo").value = saldo.toFixed(2);
    } else {
        document.getElementById("resultado-saldo").value = "0.00";
    }
}

// Adicionar event listeners para campos que influenciam no Saldo
const camposSaldo = ["qtd-inicios", "qtd-cessadas", "ciclos", "grupos"];
camposSaldo.forEach(id => {
    document.getElementById(id).addEventListener("input", () => {
        atualizarSaldo();
        calcularPontuacao();
    });
});

// Função para calcular a pontuação total
function calcularPontuacao() {
    // Captura dos valores de Faturamento
    const faturamentoRealizado = obterValorNumerico(document.getElementById("faturamento-realizado"));
    const faturamentoAcelerador = obterValorNumerico(document.getElementById("faturamento-acelerador"));

    // Calcula o Resultado de Faturamento
    let porcentagemFaturamento = 0;
    if (faturamentoAcelerador !== 0) {
        porcentagemFaturamento = (faturamentoRealizado / faturamentoAcelerador) * 100;
    }
    document.getElementById("resultado-faturamento").value = porcentagemFaturamento.toFixed(2) + "%";

    // Calcula os Pontos de Faturamento
    let pontosFaturamento = 0;
    if (porcentagemFaturamento >= 102.5) {
        pontosFaturamento = 4;
    } else if (porcentagemFaturamento >= 97.5 && porcentagemFaturamento < 102.5) {
        pontosFaturamento = 2;
    }
    document.getElementById("pontos-faturamento").innerText = pontosFaturamento;

    // Captura dos valores de Ativas
    const ativasRealizado = parseInt(document.getElementById("ativas-realizado").value, 10) || 0;
    const ativasAcelerador = parseInt(document.getElementById("ativas-acelerador").value, 10) || 0;
    let porcentagemAtivas = 0;
    if (ativasAcelerador !== 0) {
        porcentagemAtivas = (ativasRealizado / ativasAcelerador) * 100;
    }
    document.getElementById("resultado-ativas").value = porcentagemAtivas.toFixed(2) + "%";
    let pontosAtivas = 0;
    if (porcentagemAtivas >= 102.5) {
        pontosAtivas = 4;
    } else if (porcentagemAtivas >= 97.5 && porcentagemAtivas < 102.5) {
        pontosAtivas = 2;
    }
    document.getElementById("pontos-ativas").innerText = pontosAtivas;

    // Captura dos valores de Cadastro Prata+
    const cadastroPrataRealizado = parseInt(document.getElementById("cadastro-prata-realizado").value, 10) || 0;
    const cadastroPrataAcelerador = parseInt(document.getElementById("cadastro-prata-acelerador").value, 10) || 0;
    let porcentagemCadastroPrata = 0;
    if (cadastroPrataAcelerador !== 0) {
        porcentagemCadastroPrata = (cadastroPrataRealizado / cadastroPrataAcelerador) * 100;
    }
    document.getElementById("resultado-cadastro-prata").value = porcentagemCadastroPrata.toFixed(2) + "%";
    let pontosCadastroPrata = 0;
    if (porcentagemCadastroPrata >= 102.5) {
        pontosCadastroPrata = 2;
    } else if (porcentagemCadastroPrata >= 97.5 && porcentagemCadastroPrata < 102.5) {
        pontosCadastroPrata = 1;
    }
    document.getElementById("pontos-cadastro-prata").innerText = pontosCadastroPrata;

    // Cálculo do Saldo
    const saldo = parseFloat(document.getElementById("resultado-saldo").value) || 0;
    let pontosSaldo = 0;
    if (saldo >= 1) {
        pontosSaldo = 2;
    } else if (saldo >= 0 && saldo < 1) {
        pontosSaldo = 1;
    }
    // Saldo negativo recebe 0 pontos
    document.getElementById("pontos-saldo").innerText = pontosSaldo;

    // Cálculo para Ativas CPV
    const ativasCpvRealizado = parseInt(document.getElementById("ativas-cpv-realizado").value, 10) || 0;
    const ativasCpvAcelerador = parseInt(document.getElementById("ativas-cpv-acelerador").value, 10) || 0;
    let porcentagemAtivasCpv = 0;
    if (ativasCpvAcelerador !== 0) {
        porcentagemAtivasCpv = (ativasCpvRealizado / ativasCpvAcelerador) * 100;
    }
    document.getElementById("resultado-ativas-cpv").value = porcentagemAtivasCpv.toFixed(2) + "%";
    let pontosAtivasCpv = 0;
    if (porcentagemAtivasCpv >= 102.5) {
        pontosAtivasCpv = 2;
    } else if (porcentagemAtivasCpv >= 97.5 && porcentagemAtivasCpv < 102.5) {
        pontosAtivasCpv = 1;
    }
    document.getElementById("pontos-ativas-cpv").innerText = pontosAtivasCpv;

    // Cálculo para Ativas Mistas
    const ativasMistasRealizado = parseInt(document.getElementById("ativas-mistas-realizado").value, 10) || 0;
    const ativasMistasAcelerador = parseInt(document.getElementById("ativas-mistas-acelerador").value, 10) || 0;
    let porcentagemAtivasMistas = 0;
    if (ativasMistasAcelerador !== 0) {
        porcentagemAtivasMistas = (ativasMistasRealizado / ativasMistasAcelerador) * 100;
    }
    document.getElementById("resultado-ativas-mistas").value = porcentagemAtivasMistas.toFixed(2) + "%";
    let pontosAtivasMistas = 0;
    if (porcentagemAtivasMistas >= 102.5) {
        pontosAtivasMistas = 2;
    } else if (porcentagemAtivasMistas >= 97.5 && porcentagemAtivasMistas < 102.5) {
        pontosAtivasMistas = 1;
    }
    document.getElementById("pontos-ativas-mistas").innerText = pontosAtivasMistas;

    // Cálculo para Líderes em IAP
    const totalLideresIap = parseInt(document.getElementById("total-lideres-iap").value, 10) || 0;
    const lideresComPontos = parseInt(document.getElementById("lideres-com-pontos").value, 10) || 0;
    let porcentagemLideresIap = 0;
    if (totalLideresIap !== 0) {
        porcentagemLideresIap = (lideresComPontos / totalLideresIap) * 100;
    }
    document.getElementById("resultado-lideres-iap").value = porcentagemLideresIap.toFixed(2) + "%";
    let pontosLideresIap = 0;
    if (porcentagemLideresIap >= 90) {
        pontosLideresIap = 2;
    } else if (porcentagemLideresIap >= 75 && porcentagemLideresIap < 90) {
        pontosLideresIap = 1;
    }
    document.getElementById("pontos-lideres-iap").innerText = pontosLideresIap;

    // Cálculo da pontuação total
    let pontuacao = pontosFaturamento + pontosAtivas + pontosCadastroPrata + pontosSaldo + pontosAtivasCpv + pontosAtivasMistas + pontosLideresIap;

    // Atualizar o resultado na página
    if (isNaN(pontuacao)) {
        document.getElementById("pontuacao").innerText = "Erro no cálculo";
    } else {
        document.getElementById("pontuacao").innerText = pontuacao.toFixed(2);
    }
}

// Função para salvar dados em XML
function saveToXML() {
    // Captura dos valores
    const faturamentoRealizado = obterValorNumerico(document.getElementById("faturamento-realizado"));
    const faturamentoAcelerador = obterValorNumerico(document.getElementById("faturamento-acelerador"));
    const ativasRealizado = parseInt(document.getElementById("ativas-realizado").value, 10) || 0;
    const ativasAcelerador = parseInt(document.getElementById("ativas-acelerador").value, 10) || 0;
    const cadastroPrataRealizado = parseInt(document.getElementById("cadastro-prata-realizado").value, 10) || 0;
    const cadastroPrataAcelerador = parseInt(document.getElementById("cadastro-prata-acelerador").value, 10) || 0;
    const qtdInicios = parseInt(document.getElementById("qtd-inicios").value, 10) || 0;
    const qtdCessadas = parseInt(document.getElementById("qtd-cessadas").value, 10) || 0;
    const ciclos = parseInt(document.getElementById("ciclos").value, 10) || 1;
    const grupos = parseInt(document.getElementById("grupos").value, 10) || 1;
    const saldo = parseFloat(document.getElementById("resultado-saldo").value) || 0;
    const ativasCpvRealizado = parseInt(document.getElementById("ativas-cpv-realizado").value, 10) || 0;
    const ativasCpvAcelerador = parseInt(document.getElementById("ativas-cpv-acelerador").value, 10) || 0;
    const ativasMistasRealizado = parseInt(document.getElementById("ativas-mistas-realizado").value, 10) || 0;
    const ativasMistasAcelerador = parseInt(document.getElementById("ativas-mistas-acelerador").value, 10) || 0;
    const totalLideresIap = parseInt(document.getElementById("total-lideres-iap").value, 10) || 0;
    const lideresComPontos = parseInt(document.getElementById("lideres-com-pontos").value, 10) || 0;

    // Validação de entradas antes de salvar
    if (
        ciclos <= 0 ||
        grupos <= 0 ||
        lideresComPontos > totalLideresIap
    ) {
        showError("Por favor, verifique os valores inseridos antes de salvar.");
        return;
    }

    // Criar o documento XML
    let xmlDoc = document.implementation.createDocument("", "", null);

    // Elemento raiz
    let root = xmlDoc.createElement("SimulacaoIAP");
    xmlDoc.appendChild(root);

    // Função auxiliar para adicionar elementos
    function addElement(parent, tag, value) {
        let elem = xmlDoc.createElement(tag);
        elem.textContent = value;
        parent.appendChild(elem);
    }

    // Adicionar dados ao XML
    addElement(root, "FaturamentoRealizado", faturamentoRealizado);
    addElement(root, "FaturamentoAcelerador", faturamentoAcelerador);
    addElement(root, "AtivasRealizado", ativasRealizado);
    addElement(root, "AtivasAcelerador", ativasAcelerador);
    addElement(root, "CadastroPrataRealizado", cadastroPrataRealizado);
    addElement(root, "CadastroPrataAcelerador", cadastroPrataAcelerador);
    addElement(root, "QtdInicios", qtdInicios);
    addElement(root, "QtdCessadas", qtdCessadas);
    addElement(root, "Ciclos", ciclos);
    addElement(root, "Grupos", grupos);
    addElement(root, "Saldo", saldo);
    addElement(root, "AtivasCPVRealizado", ativasCpvRealizado);
    addElement(root, "AtivasCPVAcelerador", ativasCpvAcelerador);
    addElement(root, "AtivasMistasRealizado", ativasMistasRealizado);
    addElement(root, "AtivasMistasAcelerador", ativasMistasAcelerador);
    addElement(root, "TotalLideresIAP", totalLideresIap);
    addElement(root, "LideresComPontos", lideresComPontos);

    // Converter o XML para string
    let serializer = new XMLSerializer();
    let xmlString = serializer.serializeToString(xmlDoc);

    // Criar um Blob com o XML
    let blob = new Blob([xmlString], { type: "application/xml" });

    // Criar um link para download
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "data.xml";

    // Adicionar o link ao documento e clicar nele
    document.body.appendChild(link);
    link.click();

    // Remover o link
    document.body.removeChild(link);

    // Mostrar toast de sucesso
    showSuccess("Dados salvos com sucesso como data.xml!");
}

// Função para carregar dados de XML
function loadFromXML(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const contents = e.target.result;
        parseXML(contents);
    };
    reader.readAsText(file);
}

function parseXML(xmlStr) {
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(xmlStr, "application/xml");

    // Verificar se há erros de parsing
    if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
        showError("Erro ao analisar o arquivo XML. Verifique se o arquivo está correto.");
        return;
    }

    // Função auxiliar para obter o texto de um elemento
    function getElementText(tag) {
        let elems = xmlDoc.getElementsByTagName(tag);
        return elems.length > 0 ? elems[0].textContent : "";
    }

    // Extrair dados do XML
    const faturamentoRealizado = getElementText("FaturamentoRealizado");
    const faturamentoAcelerador = getElementText("FaturamentoAcelerador");
    const ativasRealizado = getElementText("AtivasRealizado");
    const ativasAcelerador = getElementText("AtivasAcelerador");
    const cadastroPrataRealizado = getElementText("CadastroPrataRealizado");
    const cadastroPrataAcelerador = getElementText("CadastroPrataAcelerador");
    const qtdInicios = getElementText("QtdInicios");
    const qtdCessadas = getElementText("QtdCessadas");
    const ciclos = getElementText("Ciclos");
    const grupos = getElementText("Grupos");
    const saldo = getElementText("Saldo");
    const ativasCpvRealizado = getElementText("AtivasCPVRealizado");
    const ativasCpvAcelerador = getElementText("AtivasCPVAcelerador");
    const ativasMistasRealizado = getElementText("AtivasMistasRealizado");
    const ativasMistasAcelerador = getElementText("AtivasMistasAcelerador");
    const totalLideresIap = getElementText("TotalLideresIAP");
    const lideresComPontos = getElementText("LideresComPontos");

    // Preencher os campos do formulário
    document.getElementById("faturamento-realizado").value = formatarValorCarregado(faturamentoRealizado);
    document.getElementById("faturamento-acelerador").value = formatarValorCarregado(faturamentoAcelerador);
    document.getElementById("ativas-realizado").value = ativasRealizado;
    document.getElementById("ativas-acelerador").value = ativasAcelerador;
    document.getElementById("cadastro-prata-realizado").value = cadastroPrataRealizado;
    document.getElementById("cadastro-prata-acelerador").value = cadastroPrataAcelerador;
    document.getElementById("qtd-inicios").value = qtdInicios;
    document.getElementById("qtd-cessadas").value = qtdCessadas;
    document.getElementById("ciclos").value = ciclos;
    document.getElementById("grupos").value = grupos;
    document.getElementById("resultado-saldo").value = saldo;
    document.getElementById("ativas-cpv-realizado").value = ativasCpvRealizado;
    document.getElementById("ativas-cpv-acelerador").value = ativasCpvAcelerador;
    document.getElementById("ativas-mistas-realizado").value = ativasMistasRealizado;
    document.getElementById("ativas-mistas-acelerador").value = ativasMistasAcelerador;
    document.getElementById("total-lideres-iap").value = totalLideresIap;
    document.getElementById("lideres-com-pontos").value = lideresComPontos;

    // Reaplicar a formatação monetária nos campos carregados
    formatarCampoMonetario(document.getElementById("faturamento-realizado"));
    formatarCampoMonetario(document.getElementById("faturamento-acelerador"));

    // Recalcular a pontuação automaticamente após carregar os dados
    calcularPontuacao();

    // Mostrar toast de sucesso
    showSuccess("Dados carregados com sucesso!");
}

// Função para formatar valores carregados (remover R$ e formatar corretamente)
function formatarValorCarregado(valor) {
    // Remove R$ e espaços
    valor = valor.replace(/R\$\s?/, '');

    // Remove pontos e substitui vírgula por ponto
    valor = valor.replace(/\./g, '').replace(',', '.');

    // Converte para número
    let numero = parseFloat(valor);
    if (isNaN(numero)) {
        numero = 0;
    }

    // Formata novamente para o padrão monetário
    return numero.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

// Event listener para recalcular a pontuação sempre que um campo relevante for alterado
const camposPontuacao = [
    "faturamento-realizado",
    "faturamento-acelerador",
    "ativas-realizado",
    "ativas-acelerador",
    "cadastro-prata-realizado",
    "cadastro-prata-acelerador",
    "qtd-inicios",
    "qtd-cessadas",
    "ciclos",
    "grupos",
    "ativas-cpv-realizado",
    "ativas-cpv-acelerador",
    "ativas-mistas-realizado",
    "ativas-mistas-acelerador",
    "total-lideres-iap",
    "lideres-com-pontos"
];

camposPontuacao.forEach(id => {
    const elemento = document.getElementById(id);
    if (!camposMonetarios.includes(id)) {
        elemento.addEventListener("input", calcularPontuacao);
    }
});

// Adicionar event listeners adicionais para os campos monetários
camposMonetarios.forEach(id => {
    const elemento = document.getElementById(id);
    elemento.addEventListener("input", calcularPontuacao);
});