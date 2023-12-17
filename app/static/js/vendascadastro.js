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

function adicionarProduto() {
    const idProdutoInput = document.getElementById("id_produto");
    const productId = idProdutoInput.value;

    // Verificar se o produto já está na tabela
    const tabelaCadastroVendas = $('#tabelaCadastroVendas').DataTable();
    const produtosIds = tabelaCadastroVendas.column(0).data().toArray();
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
            } else {
                data.preco_final = data.preco_venda;

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
                    //
                    data.preco_final,
                    data.foto,
                    '<button type="button" class="editar-produto" " data-toggle="modal" data-target="#editarProdutoModal" data-id="' + productId + '"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"/></svg></button>',
                    '<button class="remover-produto"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z"/></svg></button>'
                ]).draw();
                idProdutoInput.value = '';
                var secaoProduto = document.createElement("div");
                secaoProduto.style.display = "none";
                secaoProduto.innerHTML = `
                    <input type="hidden" name="id_produto[]" value="${productId}">
                    <input type="hidden" name="preco_final${productId}" value="${data.preco_final}">
                `;

                document.getElementById("formVendas").appendChild(secaoProduto);
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
        ordering: false,    // Remove a ordenação de colunas
        language: {
            "emptyTable": "Nenhum produto adicionado",
        }
    });

    // Adicionar manipuladores de eventos para o botão "Remover" depois de configurar a tabela
    $('#tabelaCadastroVendas').on('click', '.obter-info-produto', function () {
        var row = $(this).closest('tr');
        var productID = row.find('td:first').text(); // ID do produto na primeira coluna
        console.log('Clicou em "Obter Info Produto"');

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
                    row.find('td:eq(6)').text(data.preco_final);
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
    $('#tabelaCadastroVendas').on('click', '.editar-produto', function () {
        const productId = this.getAttribute('data-id');

        $('#formEditarProduto').attr('action', `/editarprodutosnavenda/${productId}`);

        // Fazer uma solicitação AJAX para obter informações do produto com base no ID
        fetch(`/get_product_info?product_id=${productId}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    // Preencher os inputs no modal com os dados obtidos
                    $('#editarProdutoModal input[name="descricao"]').val(data.descricao);
                    $('#editarProdutoModal select[name="categoria"]').val(data.categoria);
                    $('#editarProdutoModal input[name="sub_categoria"]').val(data.sub_categoria);
                    $('#editarProdutoModal input[name="tamanho"]').val(data.tamanho);
                    $('#editarProdutoModal input[name="cor"]').val(data.cor);
                    $('#editarProdutoModal input[name="medidas"]').val(data.medidas);
                    $('#editarProdutoModal input[name="marca"]').val(data.marca);
                    $('#editarProdutoModal input[name="preco_custo"]').val(data.preco_custo);
                    $('#editarProdutoModal input[name="preco_venda"]').val(data.preco_venda);
                    $('#editarProdutoModal input[name="preco_final"]').val(data.preco_venda);
    
                    // Exibir o modal e ativar o overlay
                    document.getElementById('editarProdutoModal').style.display = 'block';
                    var overlay = document.getElementById('overlay');
                    overlay.style.display = 'block';
                }
            });
    });

    $('#salvarEdicaoProduto').on('click', function() {
        // Envia o formulário quando o botão é clicado
        $('#formEditarProduto').submit();
    });
    
    function atualizarDataTable() {
        // Use a lógica apropriada para recarregar ou atualizar o DataTable
        // Exemplo de código (requer DataTables jQuery):
        $('#tabelaCadastroVendas').DataTable().ajax.reload();
    }

    
    // Adicionar um evento de clique para os botões de remoção após a tabela ter sido configurada
    $('#tabelaCadastroVendas').on('click', '.remover-produto', function () {
        var row = $(this).closest('tr');
        tabelaCadastroVendas.row(row).remove().draw();
    });

    $('#formVendas').submit(function (event) {
        // Verificar se a tabela está vazia
        if (tabelaCadastroVendas.data().count() === 0) {
            alert('Adicione pelo menos um produto antes de cadastrar a venda.');
            event.preventDefault(); // Impede o envio do formulário
        } else {
            // Remova o atributo 'required' do input do id_produto antes de enviar o formulário
            $('#id_produto').removeAttr('required');
            console.log('Required removido');

            // Desative o input de id do produto antes de enviar o formulário
            $('#id_produto').prop('disabled', true);
            console.log('Enviou o formulário');
            // Envie o formulário
            return true;
        }
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

function fecharModal() {
    // Esconda o modal
    document.getElementById('editarProdutoModal').style.display = 'none';
}


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



