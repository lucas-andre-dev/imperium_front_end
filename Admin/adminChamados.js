const API_URL = "http://localhost:8080/chamados";
const API_URL_TODOS = "http://localhost:8080/chamados";
const API_URL_PENDENTE = "http://localhost:8080/chamados/status/pendente";
const API_URL_RESOLVIDO = "http://localhost:8080/chamados/status/resolvido";
const tableBody = document.getElementById("chamadosTable");
const option = document.getElementById("filtroStatus");


// Função para carregar todos os chamados
async function carregarChamados() {
  try {
    if(option.value === "todos"){
      const response = await fetch(API_URL_TODOS);
      if (!response.ok) throw new Error("Erro ao carregar chamados");

      const dados = await response.json();
      window.chamados = dados; // guarda globalmente
      renderChamados();
    }

    if(option.value === "pendente"){
      const response = await fetch(API_URL_PENDENTE);
      if (!response.ok) throw new Error("Erro ao carregar chamados");

      const dados = await response.json();
      window.chamados = dados; // guarda globalmente
      renderChamados();
    }
    if(option.value == "resolvido"){
      const response = await fetch(API_URL_RESOLVIDO);
      if (!response.ok) throw new Error("Erro ao carregar chamados");

      const dados = await response.json();
      window.chamados = dados; // guarda globalmente
      renderChamados();
    }
  } catch (error) {
    console.error(error);
    tableBody.innerHTML = `
      <tr><td colspan="7" class="text-center text-danger">
        Erro ao carregar chamados.
      </td></tr>
    `;
  }
}
// AO MUDAR O FILTRO RECARREGA CHAMADOS
option.addEventListener("change",()=>{carregarChamados()});

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
       <span class="badge ${
          ch.status === "pendente" ? "bg-warning" : "bg-success"
        }">
          ${ch.status}
        </span>
      
      </td>
  
      <td>
        ${
          
          ch.status === "pendente"
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
  if (!confirm("Deseja marcar este chamado como RESOLVIDO?")) ;

  try {
    const response = await fetch(`${API_URL}/${"resolvido"}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "resolvido" })
    });

    if (!response.ok) throw new Error("Erro ao atualizar status");

    // Atualiza localmente sem recarregar a página
    window.chamados = window.chamados.map(c =>
      c.id === id ? { ...c, status: "resolvido" } : c
    );
    renderChamados();
  } catch (error) {
    console.error(error);
    alert("Erro ao atualizar o status do chamado.");
  }
}


// Inicialização
document.addEventListener("DOMContentLoaded", carregarChamados);
