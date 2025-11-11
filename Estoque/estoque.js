const form = document.getElementById("formProduto");
const tabela = document.getElementById("tabelaEstoque");
const alerta = document.getElementById("alert");

// Salvar produto
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const quantidade = parseInt(document.getElementById("quantidade").value);
  const valor = parseFloat(document.getElementById("valor").value);

  if (!nome || quantidade <= 0 || valor <= 0) {
    alert("Preencha todos os campos corretamente!");
    return;
  }

  const produto = { nome, quantidade, valor };

  try {
    const url = "http://localhost:8080/estoque";               
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(produto)
    });

    if (!response.ok) {
      throw new Error(`Erro: ${response.status}`);
    }

    alerta.innerHTML = `
      <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        Produto adicionado com sucesso!
      </div>`;
    
    form.reset();
    atualizarTabela();

  } catch (error) {
    console.error("Erro ao adicionar produto:", error);
    alerta.innerHTML = `
      <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        Falha ao adicionar o produto. Tente novamente!
      </div>`;
  }
  // apaga mensagem alerta
  setTimeout(() => alerta.innerHTML = `<div></div>`, 3000);
});

// Atualizar tabela
async function atualizarTabela() {
  const url = "http://localhost:8080/estoque";
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erro: ${response.status}`);
    const result = await response.json();

    tabela.innerHTML = "";

    result.forEach(produto => {
      tabela.innerHTML += `
        <tr>
          <td>${produto.id}</td>
          <td>${produto.nome}</td>
          <td>${produto.quantidade}</td>
          <td>${produto.valor}</td>
          <td>${(produto.quantidade * produto.valor).toFixed(2)}</td>
          <td><button type="button" class="btn btn-danger" onclick="abrirModal(${produto.id})">Excluir</button></td>

        </tr>`;
    });

    alerta.innerHTML = "";

  } catch (error) {
    console.error("Erro ao atualizar tabela:", error);
    alerta.innerHTML = `
      <div class="alert alert-warning" role="alert">
        Não foi possível carregar os dados do estoque!
      </div>`;
  }
}

// excluir
async function deletarProd(id){
const url = `http://localhost:8080/estoque/excluir/${id}`;
try{
  const response = await fetch(url,{method:"DELETE"});
  
  alerta.innerHTML = `
    <div class="alert alert-warning" role="alert">
        Produto deletado com sucesso!
    </div>`;
  if(!response.ok){
      alerta.innerHTML = `
      <div class="alert alert-warning" role="alert">
        Não foi possível deletar o produto!
      </div>`;    
  }
  alerta.innerHTML = `
    <div class="alert alert-warning" role="alert">
        Produto deletado com sucesso!
    </div>`;
  atualizarTabela();
  setTimeout(()=>(alerta.innerHTML=""),3000);

}
catch{
      alerta.innerHTML = `
      <div class="alert alert-warning" role="alert">
        Não foi possível deletar o produto!
      </div>`;

}




}

// Atualiza a tabela a cada 10s
setInterval(atualizarTabela, 10000);

// Inicializa
atualizarTabela();
let idParaExcluir = null; // guarda o ID do produto que o usuário quer excluir

function abrirModal(id) {
  idParaExcluir = id;
  const modal = new bootstrap.Modal(document.getElementById("confirmarExclusaoModal"));
  modal.show();

  document.getElementById("confirmarExcluirBtn").addEventListener("click", async () => {
  if (idParaExcluir !== null) {
    await deletarProd(idParaExcluir);
    idParaExcluir = null;

    const modalEl = document.getElementById("confirmarExclusaoModal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
  }
});
}



