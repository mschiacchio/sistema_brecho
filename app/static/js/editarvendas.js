$(document).ready(function() {
    // Inicializa o DataTable
    var tabelaProdutos = $('#tabelaProdutos').DataTable({
        searching: false,  // Remove a barra de pesquisa
        paging: false,     // Remove a paginação
        info: false,       // Remove as informações "Showing X of Y entries"
        lengthChange: false,  // Remove o seletor de quantidade de registros exibidos
        ordering: false,    // Remove a ordenação de colunas
        language: {
            "emptyTable": "Nenhum produto adicionado",
        }
    });

    // Obtém o ID da venda da URL (substitua pela sua lógica real)
    var vendaId = obterIdVendaDaURL();

    // Realiza uma solicitação AJAX para obter os produtos vinculados à venda
    $.ajax({
        url: '/api/produtos_por_venda/' + vendaId,
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            // Limpa o corpo da tabela
            tabelaProdutos.clear().draw();

            // Preenche a tabela com os dados dos produtos
            $.each(data.produtos, function(index, produto) {
                tabelaProdutos.row.add([
                    produto.id,
                    produto.descricao,
                    produto.categoria,
                    produto.tamanho,
                    produto.cor,
                    produto.marca,
                    produto.preco_venda,
                    produto.preco_final,
                    produto.foto,
                ]).draw();
            });
        },
        error: function(error) {
            console.log('Erro na solicitação AJAX: ' + error);
        }
    });

    // Função de exemplo para obter o ID da venda da URL
    function obterIdVendaDaURL() {
        // Obtém a parte final da URL, que deve ser o ID da venda
        var urlPartes = window.location.href.split('/');
        return parseInt(urlPartes[urlPartes.length - 1], 10);
    }
});

// Função para calcular o valor total da compra com base nos produtos adicionados
function calcularValorTotalCompra() {
    const tabelaCadastroVendas = $('#tabelaCadastroVendas').DataTable();
    const linhas = tabelaCadastroVendas.rows().data();
    let valorTotal = 0;

    // Percorra todas as linhas e some os valores de venda
    for (let i = 0; i < linhas.length; i++) {
        const rowData = linhas[i];
        const valorVenda = parseFloat(rowData[7].replace('R$', '').replace(',', '.')) || 0;
        valorTotal += valorVenda;
    }

    // Atualize o campo de valor total da compra
    const valorInput = document.getElementById("valor");
    valorInput.value = valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    
    const valorTotalInput = document.getElementById("val_total");
    valorTotalInput.value = valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Chame a função para calcular o valor total da compra sempre que um produto for adicionado ou removido da tabela
$('#tabelaCadastroVendas').on('draw.dt', calcularValorTotalCompra);


// Função para calcular o valor total pago com base no valor total e desconto
function calcularValorPago() {
    const valorTotalInput = document.getElementById("valor");
    const descontoInput = document.getElementById("desconto");
    const valorPagoInput = document.getElementById("val_total");
    const tipoDescontoRadios = document.querySelectorAll('input[name="tipo_desconto"]');


    const valorTotal = parseFloat(valorTotalInput.value.replace('R$', '').replace(',', '.')) || 0;
    const desconto = descontoInput.value.trim() === "" ? 0 : parseFloat(descontoInput.value) || 0;

    let valorComDesconto = valorTotal;

    const tipoDescontoSelecionado = [...tipoDescontoRadios].find(radio => radio.checked).value;

    if (tipoDescontoSelecionado === 'porcentagem' && desconto > 0) {
        valorComDesconto = valorTotal - (valorTotal * (desconto / 100));
    } else if (tipoDescontoSelecionado === 'valor' && desconto > 0) {
        valorComDesconto = valorTotal - desconto;
    }

    valorPagoInput.value = valorComDesconto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Adicionar um ouvinte de evento de entrada para calcular o valor pago em tempo real
document.getElementById("desconto").addEventListener("input", calcularValorPago);

// Adicionar um ouvinte de evento de mudança para calcular o valor pago quando o tipo de desconto mudar
document.querySelectorAll('input[name="tipo_desconto"]').forEach(radio => {
    radio.addEventListener('change', calcularValorPago);
});

// Adicionar um ouvinte de evento de entrada para calcular o valor pago quando o valor total mudar
document.getElementById("valor").addEventListener("input", calcularValorPago);

// Fechar o modal quando o botão "Fechar" é clicado
$('#editarProdutoModal').on('click', '#fecharModal', function () {
    fecharModal();
    $('#overlay').hide();
});

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

// Função para calcular o valor total da compra com base nos produtos adicionados
function calcularValorTotalCompra() {
    const tabelaCadastroVendas = $('#tabelaCadastroVendas').DataTable();
    const linhas = tabelaCadastroVendas.rows().data();
    let valorTotal = 0;

    // Percorra todas as linhas e some os valores de venda
    for (let i = 0; i < linhas.length; i++) {
        const rowData = linhas[i];
        const valorVenda = parseFloat(rowData[7].replace('R$', '').replace(',', '.')) || 0;
        valorTotal += valorVenda;
    }

    // Atualize o campo de valor total da compra
    const valorInput = document.getElementById("valor");
    valorInput.value = valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    
    const valorTotalInput = document.getElementById("val_total");
    valorTotalInput.value = valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Chame a função para calcular o valor total da compra sempre que um produto for adicionado ou removido da tabela
$('#tabelaCadastroVendas').on('draw.dt', calcularValorTotalCompra);

// Função para formatar o campo de desconto com base no tipo selecionado
function formatarCampoDesconto(input, tipoDesconto) {
    var valor = input.value;

    if (tipoDesconto === 'porcentagem') {
        valor = valor.replace(/\D/g, ''); // Remover caracteres não numéricos
        if (valor.length > 0) {
            valor += '%';
        }
    } else if (tipoDesconto === 'valor') {
        valor = valor.replace(/\D/g, ''); // Remover caracteres não numéricos
        if (valor.length > 2) {
            var parteDecimal = valor.substring(valor.length - 2);
            var parteInteira = valor.substring(0, valor.length - 2);
            valor = 'R$' + parteInteira.replace(/^0+/, '') + ',' + parteDecimal;
        } else if (valor.length > 0) {
            valor = 'R$0,' + valor;
        } else {
            valor = 'R$0,00';
        }
    }

    input.value = valor;
}

document.addEventListener('DOMContentLoaded', function () {
    const tipoDescontoRadios = document.querySelectorAll('input[name="tipo_desconto"]');
    const descontoInput = document.getElementById('desconto');

    tipoDescontoRadios.forEach(function (radio) {
        radio.addEventListener('change', function () {
            formatarCampoDesconto(descontoInput, this.value);
        });
    });

    // Adicione um ouvinte de eventos para formatar o campo quando a página carregar
    formatarCampoDesconto(descontoInput, document.querySelector('input[name="tipo_desconto"]:checked').value);
});


// Função para adicionar manipuladores de eventos de formatação a todos os campos relevantes
function adicionarManipuladoresDeEventos() {
    var camposFormatarDesconto = document.querySelectorAll('.formatar-desconto');
    camposFormatarDesconto.forEach(input => {
        input.addEventListener('input', function () {
            const tipoDescontoSelecionado = document.querySelector('input[name="tipo_desconto"]:checked').value;
            formatarCampoDesconto(this, tipoDescontoSelecionado);
        });
    });
}

// Chame a função para adicionar manipuladores de eventos quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function () {
    adicionarManipuladoresDeEventos();
});

// Adicione um evento de entrada (input) para formatar o campo em tempo real
var camposFormatarDesconto = document.querySelectorAll('.formatar-desconto');
camposFormatarDesconto.forEach(input => {
    input.addEventListener('input', function () {
        const tipoDescontoSelecionado = document.querySelector('input[name="tipo_desconto"]:checked').value;
        formatarCampoDesconto(this, tipoDescontoSelecionado);
    });
});