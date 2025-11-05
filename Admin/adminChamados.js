const API_URL = "http://localhost:8080/chamados"; // ajuste se a porta for diferente
const tableBody = document.getElementById("chamadosTable");
const filtroStatus = document.getElementById("filtroStatus");

// Função para carregar chamados do backend
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

// Renderiza chamados na tabela
function renderChamados() {
  const filtro = filtroStatus.value;
  tableBody.innerHTML = "";

  const filtrados = window.chamados.filter(c => c.status.toLowerCase() === filtro);

  if (filtrados.length === 0) {
    tableBody.innerHTML = `
      <tr><td colspan="7" class="text-center text-muted">
        Nenhum chamado ${filtro === 'aberto' ? 'aberto' : 'resolvido'} encontrado.
      </td></tr>
    `;
    return;
  }

  filtrados.forEach(ch => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${ch.nome}</td>
      <td>${ch.setor}</td>
      <td>${ch.titulo}</td>
      <td>${ch.descricao}</td>
      <td>${ch.hora}</td>
      <td class="${ch.status === 'ABERTO' ? 'status-aberto' : 'status-resolvido'}">
        ${ch.status === 'ABERTO' ? 'Aberto' : 'Resolvido'}
      </td>
      <td>
        <button class="btn btn-sm ${ch.status === 'ABERTO' ? 'btn-success' : 'btn-warning'} btn-status"
          onclick="alterarStatus(${ch.id}, '${ch.status}')">
          <i class="bi ${ch.status === 'ABERTO' ? 'bi-check-circle' : 'bi-arrow-counterclockwise'}"></i>
          ${ch.status === 'ABERTO' ? 'Resolver' : 'Reabrir'}
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Atualiza o status no backend
async function alterarStatus(id, statusAtual) {
  const novoStatus = statusAtual === "ABERTO" ? "RESOLVIDO" : "ABERTO";

  if (!confirm(`Deseja marcar este chamado como ${novoStatus.toLowerCase()}?`)) return;

  try {
    const response = await fetch(`${API_URL}/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: novoStatus })
    });

    if (!response.ok) throw new Error("Erro ao atualizar status");

    // Atualiza localmente sem precisar recarregar a página
    window.chamados = window.chamados.map(c =>
      c.id === id ? { ...c, status: novoStatus } : c
    );

    renderChamados();
  } catch (error) {
    console.error(error);
    alert("Erro ao atualizar o status do chamado.");
  }
}

// Filtro de status
filtroStatus.addEventListener("change", renderChamados);

// Inicialização
carregarChamados();
