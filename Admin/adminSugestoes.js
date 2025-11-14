// FUNÇÃO PARA CARREGAR TODAS AS SUGESTÕES DO BANCO
async function carregarSugestoes() {
  try {
    const response = await fetch('http://localhost:8080/sugestoes/all'); // ENDPOINT QUE RETORNA AS SUGESTÕES
    if (!response.ok) throw new Error('Erro ao carregar sugestões');

    const sugestoes = await response.json();
    const tabela = document.getElementById('sugestoesTable');
    tabela.innerHTML = '';

    sugestoes.forEach(s => {
      tabela.innerHTML += `
        <tr>
          <td>${s.userEntity.nome}</td>
          <td>${s.titulo}</td>
          <td>${s.sugestao}</td>
          <td>${new Date(s.dataCriacao).toLocaleString()}</td>
          <td>
            <button class="btn btn-sm btn-danger" onclick="desejaDeletar(${s.id},'${s.titulo}')"><i class="bi bi-trash"></i></button>
          </td>
        </tr>
      `;
    });
  } catch (err) {
    console.error(err);
  }
}
// perguntar se deseja realmente deletar
function desejaDeletar(id,titulo){

  if(confirm(`Deseja realmente deletar a sugestão de titulo ${titulo}?`)){
    deletarSugestao(id);
  }

}
// DELETAR SUGESTÕES DO BANCO
async function deletarSugestao(id) {
    try {
      const response = await fetch(`http://localhost:8080/sugestoes/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Erro ao deletar sugestão");

      alert(`Sugestão deletada com sucesso!`);
      carregarSugestoes();
    } catch (error) {
      console.error(error);
      alert("Erro ao deletar sugestão. Tente novamente mais tarde.");
    }
  
}


// CARREGA TODAS SIGESTÕES ASSIM QUE A PAGINA É ABERTA
window.onload = carregarSugestoes;
