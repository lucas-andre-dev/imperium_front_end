let produtos = JSON.parse(localStorage.getItem("estoque")) || [];
let editIndex = null;

const form = document.getElementById("formProduto");
const tabela = document.getElementById("tabelaEstoque");

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

  if (editIndex === null) {
    produtos.push(produto);
  } else {
    produtos[editIndex] = produto;
    editIndex = null;
  }

  salvarLocal();
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

// Editar produto
function editar(index) {
  const p = produtos[index];
  document.getElementById("nome").value = p.nome;
  document.getElementById("categoria").value = p.categoria;
  document.getElementById("quantidade").value = p.quantidade;
  document.getElementById("valor").value = p.valor;
  editIndex = index;
}

// Remover produto
function remover(index) {
  if (confirm("Deseja remover este produto?")) {
    produtos.splice(index, 1);
    salvarLocal();
    atualizarTabela();
  }
}

// Salvar no localStorage
function salvarLocal() {
  localStorage.setItem("estoque", JSON.stringify(produtos));
}

// Inicializa
atualizarTabela();
