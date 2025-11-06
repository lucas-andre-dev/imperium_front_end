const API_URL = "http://localhost:8080/chamados";
const tableBody = document.getElementById("chamadosTable");

// Função para carregar todos os chamados
async function carregarChamados() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Erro ao carregar chamados");

    const dados = await response.json();
    window.chamados = dados; // guarda globalmente
    renderChamados();
  } catch (error) {
    console.error(error);
    tableBody.innerHTML = `
      <tr><td colspan="7" class="text-center text-danger">
        Erro ao carregar chamados.
      </td></tr>
    `;
  }
}

// Renderiza todos os chamados na tabela
function renderChamados() {
  tableBody.innerHTML = "";

  if (!window.chamados || window.chamados.length === 0) {
    tableBody.innerHTML = `
      <tr><td colspan="7" class="text-center text-muted">
        Nenhum chamado encontrado.
      </td></tr>
    `;
    return;
  }

  window.chamados.forEach(ch => {
    const row = document.createElement("tr");

    // Formata a data corretamente
    const dataFormatada = ch.data
      ? new Date(ch.data).toLocaleDateString()
      : "-";

    row.innerHTML = `
      <td>${ch.user ? ch.user.nome : "-"}</td>
      <td>${ch.setor}</td>
      <td>${ch.assunto}</td>
      <td>${ch.descricao}</td>
      <td>${dataFormatada}</td>
      <td>
        <span class="badge ${ch.status === 'ABERTO' ? 'bg-warning' : 'bg-success'}">
          ${ch.status}
        </span>
      </td>
      <td>
        <button class="btn btn-sm  me-1 btn btn-success"" onclick="editarChamado(${ch.id})">
          <i class="bi bi-check2-circle"></i>
        </button>
        ${
          ch.status === "ABERTO"
            ? `<button class="btn btn-sm btn-success" onclick="resolverChamado(${ch.id})">
                 <i class="bi bi-check-lg"></i> Resolver
               </button>`
            : "-"
        }
      </td>
    `;

    tableBody.appendChild(row);
  });
}

// Atualiza o status para RESOLVIDO
async function resolverChamado(id) {
  if (!confirm("Deseja marcar este chamado como RESOLVIDO?")) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "RESOLVIDO" })
    });

    if (!response.ok) throw new Error("Erro ao atualizar status");

    // Atualiza localmente sem recarregar a página
    window.chamados = window.chamados.map(c =>
      c.id === id ? { ...c, status: "RESOLVIDO" } : c
    );
    renderChamados();
  } catch (error) {
    console.error(error);
    alert("Erro ao atualizar o status do chamado.");
  }
}

// Redireciona para a página de edição do chamado
function editarChamado(id) {
  localStorage.setItem("chamadoId", id);
  window.location.href = "editarChamado.html";
}

// Inicialização
document.addEventListener("DOMContentLoaded", carregarChamados);
