// script.js

// Inicializar toasts
const toastSuccessEl = document.getElementById('toast-success');
const toastErrorEl = document.getElementById('toast-error');
const toastSuccess = new bootstrap.Toast(toastSuccessEl);
const toastError = new bootstrap.Toast(toastErrorEl);

// Função para exibir toast de sucesso
const showSuccess = (message = "Operação realizada com sucesso!") => {
    toastSuccessEl.querySelector('.toast-body').textContent = message;
    toastSuccess.show();
}

// Função para exibir toast de erro
const showError = (message = "Ocorreu um erro. Verifique os dados e tente novamente.") => {
    toastErrorEl.querySelector('.toast-body').textContent = message;
    toastError.show();
}

/* Função que formata o campo de entrada como valor monetário */
const formatarCampoMonetario = (campo) => {
    let valor = campo.value.replace(/\D/g, '');

    valor = valor || '0';

    let valorNumerico = parseInt(valor, 10) || 0;

    valorNumerico = valorNumerico / 100;

    const valorFormatado = valorNumerico.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    campo.value = valorFormatado;

    campo.selectionStart = campo.selectionEnd = campo.value.length;
}

// Função para remover formatação monetária e retornar um número
const obterValorNumerico = (campo) => {
    const valor = parseFloat(campo.value.replace(/\D/g, '')) / 100 || 0;
    return valor;
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
const atualizarSaldo = () => {
    const qtdInicios = parseInt(document.getElementById("qtd-inicios").value, 10) || 0;
    const qtdCessadas = parseInt(document.getElementById("qtd-cessadas").value, 10) || 0;
    const ciclos = parseInt(document.getElementById("ciclos").value, 10) || 1;
    const grupos = parseInt(document.getElementById("grupos").value, 10) || 1;

    let saldo = 0;
    if (ciclos > 0 && grupos > 0) {
        saldo = ((qtdInicios - qtdCessadas) / ciclos) / grupos;
    }
    document.getElementById("resultado-saldo").value = saldo.toFixed(2);
}

// Adicionar event listeners para campos que influenciam no Saldo
const camposSaldo = ["qtd-inicios", "qtd-cessadas", "ciclos", "grupos"];
camposSaldo.forEach(id => {
    const campo = document.getElementById(id);
    campo.addEventListener("input", () => {
        atualizarSaldo();
        calcularPontuacao();
    });
})

// Função para calcular a pontuação total
const calcularPontuacao = () => {
    // Captura dos valores de Faturamento
    const faturamentoRealizado = obterValorNumerico(document.getElementById("faturamento-realizado"));
    const faturamentoAcelerador = obterValorNumerico(document.getElementById("faturamento-acelerador"));

    // Calcula o Resultado de Faturamento
    let porcentagemFaturamento = faturamentoAcelerador ? (faturamentoRealizado / faturamentoAcelerador) * 100 : 0;
    document.getElementById("resultado-faturamento").value = `${porcentagemFaturamento.toFixed(2)}%`;

    // Calcula os Pontos de Faturamento
    let pontosFaturamento = 0;
    if (porcentagemFaturamento >= 102.5) pontosFaturamento = 4;
    else if (porcentagemFaturamento >= 97.5) pontosFaturamento = 2;
    document.getElementById("pontos-faturamento").innerText = pontosFaturamento;

    // Captura dos valores de Ativas
    const ativasRealizado = parseInt(document.getElementById("ativas-realizado").value, 10) || 0;
    const ativasAcelerador = parseInt(document.getElementById("ativas-acelerador").value, 10) || 0;
    let porcentagemAtivas = ativasAcelerador ? (ativasRealizado / ativasAcelerador) * 100 : 0;
    document.getElementById("resultado-ativas").value = `${porcentagemAtivas.toFixed(2)}%`;
    let pontosAtivas = 0;
    if (porcentagemAtivas >= 102.5) pontosAtivas = 4;
    else if (porcentagemAtivas >= 97.5) pontosAtivas = 2;
    document.getElementById("pontos-ativas").innerText = pontosAtivas;

    // Captura dos valores de Cadastro Prata+
    const cadastroPrataRealizado = parseInt(document.getElementById("cadastro-prata-realizado").value, 10) || 0;
    const cadastroPrataAcelerador = parseInt(document.getElementById("cadastro-prata-acelerador").value, 10) || 0;
    let porcentagemCadastroPrata = cadastroPrataAcelerador ? (cadastroPrataRealizado / cadastroPrataAcelerador) * 100 : 0;
    document.getElementById("resultado-cadastro-prata").value = `${porcentagemCadastroPrata.toFixed(2)}%`;
    let pontosCadastroPrata = 0;
    if (porcentagemCadastroPrata >= 102.5) pontosCadastroPrata = 2;
    else if (porcentagemCadastroPrata >= 97.5) pontosCadastroPrata = 1;
    document.getElementById("pontos-cadastro-prata").innerText = pontosCadastroPrata;

    // Cálculo do Saldo
    atualizarSaldo();
    const saldo = parseFloat(document.getElementById("resultado-saldo").value) || 0;
    let pontosSaldo = 0;
    if (saldo >= 1) pontosSaldo = 2;
    else if (saldo >= 0) pontosSaldo = 1;
    document.getElementById("pontos-saldo").innerText = pontosSaldo;

    // Cálculo para Ativas CPV
    const ativasCpvRealizado = parseInt(document.getElementById("ativas-cpv-realizado").value, 10) || 0;
    const ativasCpvAcelerador = parseInt(document.getElementById("ativas-cpv-acelerador").value, 10) || 0;
    let porcentagemAtivasCpv = ativasCpvAcelerador ? (ativasCpvRealizado / ativasCpvAcelerador) * 100 : 0;
    document.getElementById("resultado-ativas-cpv").value = `${porcentagemAtivasCpv.toFixed(2)}%`;
    let pontosAtivasCpv = 0;
    if (porcentagemAtivasCpv >= 102.5) pontosAtivasCpv = 2;
    else if (porcentagemAtivasCpv >= 97.5) pontosAtivasCpv = 1;
    document.getElementById("pontos-ativas-cpv").innerText = pontosAtivasCpv;

    // Cálculo para Ativas Mistas
    const ativasMistasRealizado = parseInt(document.getElementById("ativas-mistas-realizado").value, 10) || 0;
    const ativasMistasAcelerador = parseInt(document.getElementById("ativas-mistas-acelerador").value, 10) || 0;
    let porcentagemAtivasMistas = ativasMistasAcelerador ? (ativasMistasRealizado / ativasMistasAcelerador) * 100 : 0;
    document.getElementById("resultado-ativas-mistas").value = `${porcentagemAtivasMistas.toFixed(2)}%`;
    let pontosAtivasMistas = 0;
    if (porcentagemAtivasMistas >= 102.5) pontosAtivasMistas = 2;
    else if (porcentagemAtivasMistas >= 97.5) pontosAtivasMistas = 1;
    document.getElementById("pontos-ativas-mistas").innerText = pontosAtivasMistas;

    // Cálculo para Líderes em IAP
    const totalLideresIap = parseInt(document.getElementById("total-lideres-iap").value, 10) || 0;
    const lideresComPontos = parseInt(document.getElementById("lideres-com-pontos").value, 10) || 0;
    let porcentagemLideresIap = totalLideresIap ? (lideresComPontos / totalLideresIap) * 100 : 0;
    document.getElementById("resultado-lideres-iap").value = `${porcentagemLideresIap.toFixed(2)}%`;
    let pontosLideresIap = 0;
    if (porcentagemLideresIap >= 90) pontosLideresIap = 2;
    else if (porcentagemLideresIap >= 75) pontosLideresIap = 1;
    document.getElementById("pontos-lideres-iap").innerText = pontosLideresIap;

    // Cálculo da pontuação total
    const pontuacao = pontosFaturamento + pontosAtivas + pontosCadastroPrata + pontosSaldo + pontosAtivasCpv + pontosAtivasMistas + pontosLideresIap;

    // Atualizar o resultado na página
    document.getElementById("pontuacao").innerText = isNaN(pontuacao) ? "Erro no cálculo" : pontuacao.toFixed(2);
}

// Função para salvar dados em JSON
const saveToJSON = () => {
    console.log("Função saveToJSON chamada");

    // Captura dos valores
    const getValue = (id, parseFunc = parseInt, defaultValue = 0) => {
        const value = document.getElementById(id).value;
        return parseFunc(value, 10) || defaultValue;
    }

    const faturamentoRealizado = obterValorNumerico(document.getElementById("faturamento-realizado"));
    const faturamentoAcelerador = obterValorNumerico(document.getElementById("faturamento-acelerador"));
    const ativasRealizado = getValue("ativas-realizado");
    const ativasAcelerador = getValue("ativas-acelerador");
    const cadastroPrataRealizado = getValue("cadastro-prata-realizado");
    const cadastroPrataAcelerador = getValue("cadastro-prata-acelerador");
    const qtdInicios = getValue("qtd-inicios");
    const qtdCessadas = getValue("qtd-cessadas");
    const ciclos = getValue("ciclos", parseInt, 1);
    const grupos = getValue("grupos", parseInt, 1);
    const saldo = parseFloat(document.getElementById("resultado-saldo").value) || 0;
    const ativasCpvRealizado = getValue("ativas-cpv-realizado");
    const ativasCpvAcelerador = getValue("ativas-cpv-acelerador");
    const ativasMistasRealizado = getValue("ativas-mistas-realizado");
    const ativasMistasAcelerador = getValue("ativas-mistas-acelerador");
    const totalLideresIap = getValue("total-lideres-iap");
    const lideresComPontos = getValue("lideres-com-pontos");

    console.log("Dados capturados:", {
        faturamentoRealizado,
        faturamentoAcelerador,
        ativasRealizado,
        ativasAcelerador,
        cadastroPrataRealizado,
        cadastroPrataAcelerador,
        qtdInicios,
        qtdCessadas,
        ciclos,
        grupos,
        saldo,
        ativasCpvRealizado,
        ativasCpvAcelerador,
        ativasMistasRealizado,
        ativasMistasAcelerador,
        totalLideresIap,
        lideresComPontos
    });

    // Validação de entradas antes de salvar
    if (ciclos <= 0 || grupos <= 0 || lideresComPontos > totalLideresIap) {
        showError("Por favor, verifique os valores inseridos antes de salvar.");
        console.error("Validação falhou: ciclos <= 0 || grupos <= 0 || lideresComPontos > totalLideresIap");
        return;
    }

    // Criar o objeto JSON
    const dados = {
        FaturamentoRealizado: faturamentoRealizado,
        FaturamentoAcelerador: faturamentoAcelerador,
        AtivasRealizado: ativasRealizado,
        AtivasAcelerador: ativasAcelerador,
        CadastroPrataRealizado: cadastroPrataRealizado,
        CadastroPrataAcelerador: cadastroPrataAcelerador,
        QtdInicios: qtdInicios,
        QtdCessadas: qtdCessadas,
        Ciclos: ciclos,
        Grupos: grupos,
        Saldo: saldo,
        AtivasCPVRealizado: ativasCpvRealizado,
        AtivasCPVAcelerador: ativasCpvAcelerador,
        AtivasMistasRealizado: ativasMistasRealizado,
        AtivasMistasAcelerador: ativasMistasAcelerador,
        TotalLideresIAP: totalLideresIap,
        LideresComPontos: lideresComPontos
    }

    console.log("Objeto JSON criado:", dados);

    // Converter o objeto JSON para string
    const jsonString = JSON.stringify(dados, null, 4); // Indentação para legibilidade

    // Criar um Blob com o JSON
    const blob = new Blob([jsonString], { type: "application/json" });

    // Criar um link para download
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = "data.json";

    // Adicionar o link ao documento e clicar nele
    document.body.appendChild(link);
    link.click();

    // Remover o link e revogar a URL
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Mostrar toast de sucesso
    showSuccess("Dados salvos com sucesso como data.json!");
}

// Função para carregar dados de JSON
const loadFromJSON = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => parseJSON(e.target.result);
    reader.readAsText(file);
}

const parseJSON = (jsonStr) => {
    try {
        const dados = JSON.parse(jsonStr);

        console.log("Dados carregados do JSON:", dados);

        // Validação básica dos dados
        const requiredFields = [
            "FaturamentoRealizado",
            "FaturamentoAcelerador",
            "AtivasRealizado",
            "AtivasAcelerador",
            "CadastroPrataRealizado",
            "CadastroPrataAcelerador",
            "QtdInicios",
            "QtdCessadas",
            "Ciclos",
            "Grupos",
            "Saldo",
            "AtivasCPVRealizado",
            "AtivasCPVAcelerador",
            "AtivasMistasRealizado",
            "AtivasMistasAcelerador",
            "TotalLideresIAP",
            "LideresComPontos"
        ];

        for (const field of requiredFields) {
            if (!(field in dados)) {
                throw new Error(`Campo ausente no JSON: ${field}`);
            }
        }

        // Preencher os campos do formulário
        document.getElementById("faturamento-realizado").value = formatarValorCarregado(dados.FaturamentoRealizado);
        document.getElementById("faturamento-acelerador").value = formatarValorCarregado(dados.FaturamentoAcelerador);
        document.getElementById("ativas-realizado").value = dados.AtivasRealizado;
        document.getElementById("ativas-acelerador").value = dados.AtivasAcelerador;
        document.getElementById("cadastro-prata-realizado").value = dados.CadastroPrataRealizado;
        document.getElementById("cadastro-prata-acelerador").value = dados.CadastroPrataAcelerador;
        document.getElementById("qtd-inicios").value = dados.QtdInicios;
        document.getElementById("qtd-cessadas").value = dados.QtdCessadas;
        document.getElementById("ciclos").value = dados.Ciclos;
        document.getElementById("grupos").value = dados.Grupos;
        document.getElementById("resultado-saldo").value = dados.Saldo.toFixed(2);
        document.getElementById("ativas-cpv-realizado").value = dados.AtivasCPVRealizado;
        document.getElementById("ativas-cpv-acelerador").value = dados.AtivasCPVAcelerador;
        document.getElementById("ativas-mistas-realizado").value = dados.AtivasMistasRealizado;
        document.getElementById("ativas-mistas-acelerador").value = dados.AtivasMistasAcelerador;
        document.getElementById("total-lideres-iap").value = dados.TotalLideresIAP;
        document.getElementById("lideres-com-pontos").value = dados.LideresComPontos;

        // Reaplicar a formatação monetária nos campos carregados
        camposMonetarios.forEach(id => formatarCampoMonetario(document.getElementById(id)));

        // Recalcular a pontuação automaticamente após carregar os dados
        calcularPontuacao();

        // Mostrar toast de sucesso
        showSuccess("Dados carregados com sucesso!");
    } catch (error) {
        showError(`Erro ao carregar JSON: ${error.message}`);
        console.error("Erro ao carregar JSON:", error);
    }
}

// Função para formatar valores carregados (assume que valor é um número)
const formatarValorCarregado = (valor) => {
    // Assume que valor é um número, formata para moeda
    const numero = parseFloat(valor) || 0;
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

// Adicionar event listeners para os botões após o DOM estar carregado
document.addEventListener("DOMContentLoaded", () => {
    const btnSalvar = document.getElementById("btn-salvar-dados");
    const inputLoad = document.getElementById("load-input");

    if (btnSalvar) {
        btnSalvar.addEventListener("click", saveToJSON);
    } else {
        console.error("Botão 'Salvar Dados' não encontrado!");
    }

    if (inputLoad) {
        inputLoad.addEventListener("change", loadFromJSON);
    } else {
        console.error("Input 'Carregar Dados' não encontrado!");
    }
});