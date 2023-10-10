// Quando o cadastro for bem-sucedido
function exibirMensagemSucesso() {
    var mensagem = document.getElementById("mensagem");
    mensagem.textContent = "Cadastro realizado com sucesso!";
    mensagem.className = "mensagem sucesso";
    mensagem.style.display = "block";
  }
  
  // Quando ocorrer um erro no cadastro
  function exibirMensagemErro() {
    var mensagem = document.getElementById("mensagem");
    mensagem.textContent = "Erro ao cadastrar. Por favor, tente novamente.";
    mensagem.className = "mensagem erro";
    mensagem.style.display = "block";
  }
