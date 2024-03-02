
function adicionarProduto() {
    console.log('executando a função: adicionarProduto');
    const idProdutoInput = document.getElementById("id_produto");
    const productId = idProdutoInput.value;

    // Verificar se o produto já está na tabela
    const tabelaProdutos = $('#tabelaProdutos').DataTable();
    const produtosIds = tabelaProdutos.column(0).data().toArray();
    if (produtosIds.includes(productId)) {
        alert('Este produto já foi adicionado');
        return;
    }
    if (!productId) {
        alert('Por favor, insira um ID de produto válido');
        return;
    }
    // Fazer uma solicitação AJAX para obter informações do produto com base no ID
    fetch(`/get_product_info?product_id=${productId}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else if (data.vendido) {
                alert('Este produto já consta como vendido');
                document.getElementById('id_produto').value = '';
            } else {
                data.preco_final = data.preco_venda;

                // Adicione uma nova linha com os dados do produto
                tabelaProdutos.row.add([
                    productId,
                    data.descricao,
                    data.categoria,
                    data.tamanho,
                    data.cor,
                    data.marca,
                    data.preco_venda,
                    data.preco_final,
                    data.foto,
                    '<button class="remover-produto"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z"/></svg></button>'
                ]).draw();
                idProdutoInput.value = '';
                var secaoProduto = document.createElement("div");
                secaoProduto.style.display = "none";
                secaoProduto.innerHTML = `
                    <input type="hidden" name="id_produto[]" value="${productId}">
                    <input type="hidden" name="preco_final${productId}" value="${data.preco_final}">
                `;

                document.getElementById("formEditarVenda").appendChild(secaoProduto);
            }
            calcularValorTotalCompra();
            calcularValorPago();
        });
}
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

            // Limpa a seção de produtos
            $('#secaoProduto').empty();
            const idProdutoInput = document.getElementById("id_produto");

            // Preenche a tabela com os dados dos produtos
            $.each(data.produtos, function(index, produto) {

                var precoVendaFormatado = 'R$ ' + produto.preco_venda.toFixed(2);
                var precoFinalFormatado = 'R$ ' + produto.preco_final.toFixed(2);

                tabelaProdutos.row.add([
                    produto.id,
                    produto.descricao,
                    produto.categoria,
                    produto.tamanho,
                    produto.cor,
                    produto.marca,
                    precoVendaFormatado,
                    precoFinalFormatado,
                    produto.foto,
                    '<button class="remover-produto"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z"/></svg></button>'
                ]).draw();

                idProdutoInput.value = '';
                var secaoProduto = document.createElement("div");
                secaoProduto.style.display = "none";
                secaoProduto.innerHTML = `<input type="hidden" name="id_produto[]" value="${produto.id}">`;

                document.getElementById("formEditarVenda").appendChild(secaoProduto);
                calcularValorTotalCompra();
                calcularValorPago();
            });
        },
        error: function(error) {
            console.log('Erro na solicitação AJAX: ' + error);
        }
    });

    
    // Adicionar um evento de clique para os botões de remoção após a tabela ter sido configurada
    $('#tabelaProdutos').on('click', '.remover-produto', function (event) {
        // Evitar a ação padrão do botão (que pode ser o envio do formulário)
        event.preventDefault();
    
        var row = $(this).closest('tr');
        const productId = $(this).closest('tr').find('td:first').text();
        
        var numLinhas = tabelaProdutos.rows().count();
        // Se houver apenas uma linha (ou nenhuma), exclua a venda
        if (numLinhas <= 1) {
            if (confirm('Tem certeza que deseja remover este produto desta venda?\nATENÇÃO: Como essa venda só possui um produto, se removê-lo a venda será excluída!')) {
                atualizarStatusProduto(productId, false);

                vendaId = obterIdVendaDaURL();
                location.href = "/excluirvendas/" + vendaId;
                    
            } 
        } else{
             if (confirm('Tem certeza que deseja remover este produto desta venda?')) {
                atualizarStatusProduto(productId, false);
                removerAssociacaoProdutoVenda(productId, vendaId);
                tabelaProdutos.row(row).remove().draw();
                alert('Produto removido da venda com sucesso!');
                window.location.href = '/vendas';

            }
        }
        calcularValorTotalCompra();
        calcularValorPago();
    });
    $('#formEditarVenda').submit(function(event) {
        prepararEnvioFormulario();
    });
});

// Função de exemplo para obter o ID da venda da URL
function obterIdVendaDaURL() {
    console.log('executando a função: obterIdVendaDaURL');
    // Obtém a parte final da URL, que deve ser o ID da venda
    var urlPartes = window.location.href.split('/');
    return parseInt(urlPartes[urlPartes.length - 1], 10);
}

function atualizarStatusProduto(productId, novoStatus) {
    console.log('executando a função: atualizarStatusProduto');
    $.ajax({
        url: `/atualizar_status_produto/${productId}`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ status: novoStatus }),
        success: function (response) {
            console.log('Produto atualizado com sucesso!');
        },
        error: function (error) {
            console.error('Erro ao atualizar o status do produto:', error);
        }
    });
}

function removerAssociacaoProdutoVenda(produtoId, vendaId) {
    console.log('Executando a função: removerAssociacaoProdutoVenda');
    $.ajax({
        url: `/remover_associacao_produto_venda/${produtoId}/${vendaId}`,
        type: 'POST',
        contentType: 'application/json',
        success: function (response) {
            console.log('Associação produto-venda removida com sucesso!');
            // Adicione aqui qualquer lógica adicional para atualizar a interface do usuário, se necessário
        },
        error: function (error) {
            console.error('Erro ao remover a associação produto-venda:', error);
        }
    });
}

// Função para calcular o valor total da compra com base nos produtos adicionados
function calcularValorTotalCompra() {
    console.log('executando a função: calcularValorTotalCompra');
    const tabelaProdutos = $('#tabelaProdutos').DataTable();
    const linhas = tabelaProdutos.rows().data();
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
    //valorTotalInput.value = valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Chame a função para calcular o valor total da compra sempre que um produto for adicionado ou removido da tabela
$('#tabelaProdutos').on('draw.dt', calcularValorTotalCompra);


// Função para calcular o valor total pago com base no valor total e desconto
function calcularValorPago() {
    console.log('executando a função: calcularValorPago');
    const valorTotalInput = document.getElementById("valor");
    const descontoInput = document.getElementById("desconto-input");
    let valorPagoInput = document.getElementById("val_total");
    const tipoDescontoRadios = document.querySelectorAll('input[name="tipo_desconto"]');


    const valorTotal = parseFloat(valorTotalInput.value.replace('R$', '').replace(',', '.')) || 0;
    console.log('valorTotal: ' + valorTotal);

    const desconto = descontoInput.value.trim() === "" ? 0 : parseFloat(descontoInput.value) || 0;
    console.log('desconto: ' + desconto);

    let valorComDesconto = valorTotal;
    console.log('valorComDesconto: ' + valorComDesconto);

    const tipoDescontoSelecionadoRadio = [...tipoDescontoRadios].find(radio => radio.checked);

    if (tipoDescontoSelecionadoRadio) {
        const tipoDescontoSelecionado = tipoDescontoSelecionadoRadio.value;

        if (tipoDescontoSelecionado === 'Porcentagem' && desconto > 0) {
            valorComDesconto = valorTotal - (valorTotal * (desconto / 100));
            console.log('caiu no if');
        } else if (tipoDescontoSelecionado === 'Valor' && desconto > 0) {
            valorComDesconto = valorTotal - desconto;
            console.log('caiu no else if');
        }
    } else {
        console.log("Nenhum desconto selecionado");
    }
    
    console.log(valorComDesconto)
    valorPagoInput.value = valorComDesconto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
$(document).ready(function() {
    // Adicionar um ouvinte de evento de mudança para calcular o valor pago quando o tipo de desconto mudar
    $('input[name="tipo_desconto"]').change(calcularValorPago);
    $('input[id="desconto-input"]').change(calcularValorPago);
    $('input[id="valor"]').change(calcularValorPago);
});

/*
NÃO ESTÁ FUNCIONANDO
// Adicionar um ouvinte de evento de entrada para calcular o valor pago em tempo real
document.getElementById("desconto-input").addEventListener("input", calcularValorPago);
// Adicionar um ouvinte de evento de mudança para calcular o valor pago quando o tipo de desconto mudar
document.querySelectorAll('input[name="tipo_desconto"]').forEach(radio => {
    radio.addEventListener('change', calcularValorPago);
});
// Adicionar um ouvinte de evento de entrada para calcular o valor pago quando o valor total mudar
document.getElementById("valor").addEventListener("input", calcularValorPago);
*/

function formatarCampoReais(input) {
    console.log('executando a função: formatarCampoReais');
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

// Função para formatar o campo de desconto com base no tipo selecionado
function formatarCampoDesconto(input, tipoDesconto) {
    console.log('executando a função: formatarCampoDesconto');
    var valor = input.value;

    if (tipoDesconto === 'Porcentagem') {
        valor = valor.replace(/\D/g, ''); // Remover caracteres não numéricos
        if (valor.length > 0) {
            valor += '%';
        }
    } else if (tipoDesconto === 'Valor') {
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
