document.addEventListener("DOMContentLoaded", () => {
  if (!verificarLogin()) return;
  configurarLogout();

  const usuario = getUsuarioLogado();
  carregarMeusChamados(usuario.id);

  const form = document.getElementById("formChamado");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = document.getElementById("idChamadoEdicao").value;
    const chamado = {
      setor: document.getElementById("setor").value,
      assunto: document.getElementById("assunto").value,
      descricao: document.getElementById("descricao").value,
      usuarioId: usuario.id
    };

    if (id) {
      await atualizarChamado(id, chamado);
    } else {
      await criarChamado(chamado);
    }

    form.reset();
    document.getElementById("idChamadoEdicao").value = "";
    carregarMeusChamados(usuario.id);
  });
});

async function carregarMeusChamados(idUsuario) {
  try {
    const resposta = await fetch(`http://localhost:8080/chamados/${idUsuario}`);
    const chamados = await resposta.json();
    preencherTabela(chamados);
  } catch (erro) {
    console.error("Erro ao carregar chamados:", erro);
  }
}

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
      <td>
        <span class="badge ${chamado.status === 'PENDENTE' ? 'bg-warning' : 'bg-success'}">
          ${chamado.status}
        </span>
      </td>
      <td>${new Date(chamado.dataCriacao).toLocaleDateString()}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary me-2" onclick="editarChamado(${chamado.id})"><i class="bi bi-pencil"></i></button>
        <button class="btn btn-sm btn-outline-danger" onclick="excluirChamado(${chamado.id})"><i class="bi bi-trash"></i></button>
      </td>
    `;
    tabela.appendChild(tr);
  });
}

async function criarChamado(chamado) {
  await fetch("http://localhost:8080/chamados", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(chamado)
  });
}

async function atualizarChamado(id, chamado) {
  await fetch(`http://localhost:8080/chamados/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(chamado)
  });
}

async function excluirChamado(id) {
  if (confirm("Deseja realmente excluir este chamado?")) {
    await fetch(`http://localhost:8080/chamados/${id}`, { method: "DELETE" });
    const usuario = getUsuarioLogado();
    carregarMeusChamados(usuario.id);
  }
}

async function editarChamado(id) {
  const resposta = await fetch(`http://localhost:8080/chamados/${id}`);
  const chamado = await resposta.json();

  document.getElementById("idChamadoEdicao").value = chamado.id;
  document.getElementById("setor").value = chamado.setor;
  document.getElementById("assunto").value = chamado.assunto;
  document.getElementById("descricao").value = chamado.descricao;

  window.scrollTo({ top: 0, behavior: "smooth" });
}
