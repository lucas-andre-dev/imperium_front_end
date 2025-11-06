document.addEventListener("DOMContentLoaded", () => {
  if (!verificarLogin()) return;
  configurarLogout();

  const usuario = getUsuarioLogado();
  carregarMeusChamados(usuario.id);

  const form = document.getElementById("formChamado");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const chamado = {
      setor: document.getElementById("setor").value,
      assunto: document.getElementById("assunto").value,
      descricao: document.getElementById("descricao").value,
      status: "pendente",
      user: { id: usuario.id },
    };

    await criarChamado(chamado);

    form.reset();
    document.getElementById("idChamadoEdicao").value = "";
    carregarMeusChamados(usuario.id);
  });
});

// ================== FUNÇÕES ===================

// Carrega os chamados do usuário logado
async function carregarMeusChamados(idUsuario) {
  try {
    const resposta = await fetch(`http://localhost:8080/chamados/${idUsuario}`);
    const chamados = await resposta.json();
    preencherTabela(chamados);
  } catch (erro) {
    console.error("Erro ao carregar chamados:", erro);
  }
}

// Cria um novo chamado
async function criarChamado(chamado) {
  await fetch("http://localhost:8080/chamados", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(chamado),
  });
}

// Preenche a tabela com os chamados
function preencherTabela(chamados) {
  const tabela = document.getElementById("tabelaChamadosUsuario");
  tabela.innerHTML = "";

  if (chamados.length === 0) {
    tabela.innerHTML = `<tr><td colspan="6">Nenhum chamado encontrado.</td></tr>`;
    return;
  }

  chamados.forEach((chamado) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${chamado.id}</td>
      <td>${chamado.setor}</td>
      <td>${chamado.assunto}</td>
      <td>${chamado.descricao}</td>
      <td>
        <span class="badge ${
          chamado.status === "PENDENTE" ? "bg-warning" : "bg-success"
        }">
          ${chamado.status}
        </span>
      </td>
      <td>${new Date(chamado.data).toLocaleString()}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary me-2" onclick="editarChamado(${chamado.id})">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="excluirChamado(${chamado.id})">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
    tabela.appendChild(tr);
  });
}

// Atualiza um chamado existente
async function atualizarChamado(id, chamado) {
  await fetch(`http://localhost:8080/chamados/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(chamado),
  });
}

// Exclui um chamado
async function excluirChamado(id) {
  if (confirm("Deseja realmente excluir este chamado?")) {
    await fetch(`http://localhost:8080/chamados/${id}`, { method: "DELETE" });
    const usuario = getUsuarioLogado();
    carregarMeusChamados(usuario.id);
  }
}

// Edita um chamado
async function editarChamado(id) {
    // Salva o ID no localStorage
    localStorage.setItem("chamadoId", id,assunto,descricao);

    // Redireciona para a página de edição
    window.location.href = "editarChamados.html";
}
