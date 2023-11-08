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
    const idProdutoInput = document.getElementById("id_produto");
    const productId = idProdutoInput.value;

    // Fazer uma solicitação AJAX para obter informações do produto com base no ID
    fetch(`/get_product_info?product_id=${productId}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else if (data.vendido) {
                alert('Este produto já consta como vendido');
            } else {
                // Obtenha a instância da tabela DataTables
                const tabelaCadastroVendas = $('#tabelaCadastroVendas').DataTable();

                // Adicione uma nova linha com os dados do produto
                tabelaCadastroVendas.row.add([
                    productId,
                    data.descricao,
                    data.categoria,
                    data.tamanho,
                    data.cor,
                    data.marca,
                    data.preco_venda,
                    data.foto,
                    '<button class="remover-produto"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z"/></svg></button>'
                ]).draw();
                idProdutoInput.value = '';
            }
        });
}

$(document).ready(function () {
    // Configurar a tabela DataTables
    const tabelaCadastroVendas = $('#tabelaCadastroVendas').DataTable({
        searching: false,  // Remove a barra de pesquisa
        paging: false,     // Remove a paginação
        info: false,       // Remove as informações "Showing X of Y entries"
        lengthChange: false,  // Remove o seletor de quantidade de registros exibidos
        ordering: false    // Remove a ordenação de colunas
    });

    // Adicionar manipuladores de eventos para o botão "Remover" depois de configurar a tabela
    $('#tabelaCadastroVendas').on('click', '.obter-info-produto', function () {
        var row = $(this).closest('tr');
        var productID = row.find('td:first').text(); // ID do produto na primeira coluna

        $.ajax({
            type: 'GET',
            url: '/get_product_info',
            data: { product_id: productID },
            success: function (data) {
                // Atualize as células da tabela com os dados retornados
                if (!data.error) {
                    row.find('td:eq(1)').text(data.descricao);
                    row.find('td:eq(2)').text(data.categoria);
                    row.find('td:eq(3)').text(data.tamanho);
                    row.find('td:eq(4)').text(data.cor);
                    row.find('td:eq(5)').text(data.marca);
                    row.find('td:eq(6)').text(data.preco_venda);
                    row.find('td:eq(7)').text(data.foto);
                } else {
                    alert('Produto não encontrado');
                }
            },
            error: function () {
                alert('Erro ao buscar informações do produto.');
            }
        });
    });

    // Adicionar um evento de clique para os botões de remoção após a tabela ter sido configurada
    $('#tabelaCadastroVendas').on('click', '.remover-produto', function () {
        var row = $(this).closest('tr');
        tabelaCadastroVendas.row(row).remove().draw();
    });
});
// Função para calcular o valor total da compra com base nos produtos adicionados
function calcularValorTotalCompra() {
    const tabelaCadastroVendas = $('#tabelaCadastroVendas').DataTable();
    const linhas = tabelaCadastroVendas.rows().data();
    let valorTotal = 0;

    // Percorra todas as linhas e some os valores de venda
    for (let i = 0; i < linhas.length; i++) {
        const rowData = linhas[i];
        const valorVenda = parseFloat(rowData[6].replace('R$', '').replace(',', '.')) || 0;
        valorTotal += valorVenda;
    }

    // Atualize o campo de valor total da compra
    const valorTotalInput = document.getElementById("val_total");
    valorTotalInput.value = valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Chame a função para calcular o valor total da compra sempre que um produto for adicionado ou removido da tabela
$('#tabelaCadastroVendas').on('draw.dt', calcularValorTotalCompra);


// Função para calcular o valor total pago com base no valor total e desconto
function calcularValorPago() {
    const valorTotalInput = document.getElementById("val_total");
    const descontoInput = document.getElementById("desconto");
    const valorPagoInput = document.getElementById("val_pago");

    const valorTotal = parseFloat(valorTotalInput.value.replace('R$', '').replace(',', '.')) || 0;
    const desconto = parseFloat(descontoInput.value) || 0;

    const valorComDesconto = valorTotal - (valorTotal * (desconto / 100));
    
    valorPagoInput.value = valorComDesconto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Adicionar um ouvinte de evento de entrada para calcular o valor pago em tempo real
document.getElementById("desconto").addEventListener("input", calcularValorPago);


