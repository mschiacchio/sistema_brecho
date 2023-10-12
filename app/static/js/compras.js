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
