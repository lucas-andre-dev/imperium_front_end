document.getElementById('formChamado').addEventListener('submit', function (e) {
  e.preventDefault();

  const setor = document.getElementById('setor').value;
  const assunto = document.getElementById('assunto').value;
  const descricao = document.getElementById('descricao').value;

  if (!setor || !assunto || !descricao) {
    alert('Preencha todos os campos antes de enviar!');
    return;
  }

  alert(`Chamado criado com sucesso!\n\nSetor: ${setor}\nAssunto: ${assunto}`);
  this.reset();

  
});
