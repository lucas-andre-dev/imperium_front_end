const form = document.getElementById("formProduto");
const tabela = document.getElementById("tabelaEstoque");

// conectar com api


// Salvar produto
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const categoria = document.getElementById("categoria").value.trim();
  const quantidade = parseInt(document.getElementById("quantidade").value);
  const valor = parseFloat(document.getElementById("valor").value);

  if (!nome || !categoria || quantidade <= 0 || valor <= 0) {
    alert("Preencha todos os campos corretamente!");
    return;
  }

  const produto = { nome, categoria, quantidade, valor };



  atualizarTabela();
  form.reset();
});

// Atualizar tabela
function atualizarTabela() {
  tabela.innerHTML = "";
  produtos.forEach((p, index) => {
    const total = (p.quantidade * p.valor).toFixed(2);
    tabela.innerHTML += `
      <tr>
        <td>${p.nome}</td>
        <td>${p.categoria}</td>
        <td>${p.quantidade}</td>
        <td>${p.valor.toFixed(2)}</td>
        <td>${total}</td>
        <td>
          <button class="btn btn-sm btn-warning" onclick="editar(${index})"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-danger" onclick="remover(${index})"><i class="bi bi-trash"></i></button>
        </td>
      </tr>
    `;
  });
}






// Inicializa
atualizarTabela();
