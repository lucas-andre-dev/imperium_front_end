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
    alerta.innerHTML=`<div>Preencha todos os campos corretamente!</div>`;
    return;
  }

  const produto = {nome,quantidade,valor};

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

    if(response.ok){
      alerta.innerHTML = `
        <div class="alert alert-success" role="alert" aria-live="assertive" aria-atomic="true">
          Produto adicionado com sucesso!
        </div>`;

    }
    
    form.reset();
    atualizarTabela();

  } 
  catch (error) {
    console.error("Erro ao adicionar produto:", error);
    alerta.innerHTML = `
      <div class="alert alert-danger" role="alert" aria-live="assertive" aria-atomic="true">
        Falha ao adicionar o produto. Tente novamente!
      </div>`;
  }
  // apaga mensagem alerta
  setTimeout(() => alerta.innerHTML = ``, 3000);
});
// MODAL DE ALTERAÇÃO 
function abrirModalEdicao(id,nome,quantidade,valor){
  document.getElementById("editarNome").value= nome ;
  document.getElementById("editarQuantidade").value = quantidade ;
  document.getElementById("editarValor").value = valor ;
  const btn = document.getElementById("btnSalvarEdicao");
  const modalEditar = document.getElementById("modalEditarProduto");
  const modal = new bootstrap.Modal(modalEditar) ;
  modal. show();
  btn.addEventListener("click",()=>{
  const nomeEditar = document.getElementById("editarNome").value.trim();
  const quantidadeEditar = parseInt(document.getElementById("editarQuantidade").value);
  const valorEditar = parseFloat(document.getElementById("editarValor").value);
    editarProd(id,nomeEditar,quantidadeEditar,valorEditar);
    modal.hide();
  })
}
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
          <td>
            <button type="button" class="btn btn-danger bi bi-trash" onclick="abrirModal(${produto.id})"></button>
            <button type="button" class = "bi bi-pencil btn btn-warning" onclick="abrirModalEdicao(${produto.id},'${produto.nome}',${produto.quantidade},${produto.valor})"></button>
          </td>

        </tr>`;
    });



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
  
  if(response.status == 200||response.status == 204){
      alerta.innerHTML = `
      <div class="alert alert-success" role="alert" aria-live="assertive" aria-atomic="true">
        produto deletado com sucesso
      </div>`;
  }else{
    alerta.innerHTML=`<div class="alert alert-warning" role="alert">
        Não foi possível alterar o produto!
      </div>`;
  }

  atualizarTabela();
  setTimeout(()=>(alerta.innerHTML=""),3000);

}
catch(error){
    alerta.innerHTML = `<div class="alert alert-danger" role="alert">
      Erro ao deletar: ${error.message}
    </div>`;
    setTimeout(() => (alerta.innerHTML = ""), 3000);
    console.error(error);
  

}




}
// ALTERAR
async function editarProd(id,nome,quantidade,valor){
  
  const dados = {
    id: parseInt(id),
    nome: nome,
    quantidade: parseInt(quantidade),
    valor: parseFloat(valor)
  };
  try{
    const url ="http://localhost:8080/estoque";
    const response = await fetch(url,{method:"PUT",
                                      headers:{"Content-Type": "application/json"},
                                      body: JSON.stringify(dados)
    })
  if(response.status == 200||response.status == 204){
      alerta.innerHTML = `
      <div class="alert alert-success">Produto alterado com sucesso!</div>`;
      setTimeout(() => (alerta.innerHTML = ""), 3000);
  }else{
    alerta.innerHTML=`<div class="alert alert-warning" role="alert">
        Não foi possível alterar o produto!
      </div>`;
      setTimeout(() => (alerta.innerHTML = ""), 3000);
  }

    atualizarTabela()
  }
  catch(error){
    alerta.innerHTML = `<div class="alert alert-danger" role="alert">
      Erro ao deletar: ${error.message}
    </div>`;
    setTimeout(() => (alerta.innerHTML = ""), 3000);
    console.error(error);

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



