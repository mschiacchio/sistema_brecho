$(document).ready(function() {
    $('#tabelaCompras').on('click', '.excluir-compra', function(e) {
        e.preventDefault();
        var compraId = $(this).data('id');
        var confirmMessage = $(this).data('confirm');

        if (window.confirm(confirmMessage)) {
            window.location.href = "/excluircompras/" + compraId;
        }
    });

    $('#tabelaCompras').DataTable({
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
