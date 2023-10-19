$(document).ready(function() {
    $('#tabelaVendas').on('click', '.excluir-venda', function(e) {
        e.preventDefault();
        var vendaId = $(this).data('id');
        var confirmMessage = $(this).data('confirm');

        if (window.confirm(confirmMessage)) {
            window.location.href = "/excluirvendas/" + vendaId;
        }
    });

    $('#tabelaVendas').DataTable({
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
