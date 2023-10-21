$(document).ready(function() {
    $('#tabelaProdutos').on('click', '.excluir-produto', function(e) {
        e.preventDefault();
        var produtoId = $(this).data('id');
        var confirmMessage = $(this).data('confirm');

        if (window.confirm(confirmMessage)) {
            window.location.href = "/excluirprodutos/" + produtoId;
        }
    });

    $('#tabelaProdutos').DataTable({
        "language": {
            "lengthMenu": "Mostrando _MENU_ registros por página",
            "zeroRecords": "Nenhum registro encontrado",
            "info": "Mostrando página _PAGE_ de _PAGES_",
            "infoEmpty": "Nenhum registro disponível",
            "oPaginate": {
                "sNext": "Próximo",
                "sPrevious": "Anterior",
                "sFirst": "Primeiro",
                "sLast": "Último"
            },
            "sLoadingRecords": "Carregando...",
            "sSearch": "Pesquisar:",
            "infoFiltered": "(filtrado de _MAX_ registros no total)"
        }
    });
});
