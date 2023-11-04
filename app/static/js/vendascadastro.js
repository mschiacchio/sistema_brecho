function formatarCampoReais(input) {
    var valor = input.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos

    // Formatação em Reais
    if (valor.length > 2) {
        var parteDecimal = valor.substring(valor.length - 2);
        var parteInteira = valor.substring(0, valor.length - 2);
        valor = 'R$' + parteInteira.replace(/^0+/, '') + ',' + parteDecimal;
    } else if (valor.length > 0) {
        valor = 'R$0,' + valor;
    } else {
        valor = 'R$0,00';
    }

    input.value = valor;
}
// Função para adicionar manipuladores de eventos de formatação a todos os campos relevantes
function adicionarManipuladoresDeEventos() {
    var camposFormatarReais = document.querySelectorAll('.formatar-reais');
    camposFormatarReais.forEach(input => {
        input.addEventListener('input', function () {
            formatarCampoReais(this);
        });
    });
}

// Chame a função para adicionar manipuladores de eventos quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function () {
    adicionarManipuladoresDeEventos();
});

// Adicione um evento de entrada (input) para formatar o campo em tempo real
var camposFormatarReais = document.querySelectorAll('.formatar-reais');
camposFormatarReais.forEach(input => {
    input.addEventListener('input', function () {
        formatarCampoReais(this);
    });
});

function adicionarProduto() {
    const produtosContainer = document.getElementById('produtos-container');
    const novoCampoProduto = document.querySelector('.campo-produto').cloneNode(true);
    produtosContainer.appendChild(novoCampoProduto);

    // Após a clonagem, limpe os valores dos campos clonados
    limparCamposClonados(novoCampoProduto);

    // Atualize a visibilidade do botão de remover
    atualizarVisibilidadeBotaoRemover();
}

function limparCamposClonados(campoClonado) {
    // Selecione todos os campos de entrada dentro do campo clonado
    const camposDeEntrada = campoClonado.querySelectorAll('input, select');

    // Limpe os valores de todos os campos
    camposDeEntrada.forEach((campo) => {
        campo.value = '';
    });
}

function removerProduto(button) {
    const produtosContainer = document.getElementById('produtos-container');
    if (produtosContainer.children.length > 1) {
        produtosContainer.removeChild(button.parentElement);

        // Após a remoção, atualize novamente a visibilidade do botão de remover
        atualizarVisibilidadeBotaoRemover();
    }
}

function atualizarVisibilidadeBotaoRemover() {
    const produtosContainer = document.getElementById('produtos-container');
    const botoesRemover = produtosContainer.querySelectorAll('button.remove-produto');

    if (produtosContainer.children.length > 1) {
        // Se houver mais de uma seção, torne os botões de remover visíveis
        botoesRemover.forEach((botao) => {
            botao.style.display = 'block';
        });
    } else {
        // Se houver apenas uma seção ou nenhuma, torne os botões de remover invisíveis
        botoesRemover.forEach((botao) => {
            botao.style.display = 'none';
        });
    }
}

// Chame a função para garantir a visibilidade correta no carregamento da página
atualizarVisibilidadeBotaoRemover();
