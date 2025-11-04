document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formSugestao");
  const lista = document.getElementById("listaSugestoes");
  const inputId = document.getElementById("sugestaoId");

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario) {
    alert("Você precisa estar logado!");
    window.location.href = "../Login/login.html";
    return;
  }
  const userID = usuario.id;
  const apiUrl = "http://localhost:8080/sugestoes";

  // Carregar sugestões do usuário
  async function carregarSugestoes() {
    try {
      const response = await fetch(`${apiUrl}/${userID}`);
      if (!response.ok) throw new Error("Erro ao carregar sugestões");
      const sugestoes = await response.json();
      lista.innerHTML = "";

      if (sugestoes.length === 0) {
        lista.innerHTML = `<p class="text-center text-light">Nenhuma sugestão enviada ainda.</p>`;
        return;
      }

      sugestoes.forEach(s => {
        const card = document.createElement("div");
        card.className = "col-md-5";
        card.innerHTML = `
          <div class="card p-3 h-100 shadow-sm">
            <h5 class="text-primary">${s.titulo}</h5>
            <p class="text-dark">${s.sugestao}</p>
            <small class="text-muted">Enviada em: ${new Date(s.dataCriacao).toLocaleString()}</small>
            <div class="mt-2">
              <button class="btn btn-warning btn-sm me-2" onclick="editarSugestao(${s.id})"><i class="bi bi-pencil"></i> Editar</button>
              <button class="btn btn-danger btn-sm" onclick="deletarSugestao(${s.id})"><i class="bi bi-trash"></i> Excluir</button>
            </div>
          </div>`;
        lista.appendChild(card);
      });
    } catch (err) {
      console.error(err);
      lista.innerHTML = `<p class="text-center text-light">Erro ao carregar sugestões.</p>`;
    }
  }

  // Criar ou atualizar sugestão
  form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const titulo = form.titulo.value.trim();
  const sugestao = form.sugestao.value.trim();
  const id = inputId.value;

  if (!titulo || !sugestao) {
    alert("Preencha todos os campos!");
    return;
  }

  try {
    let response;
    if (id) {
      // Alterando sugestão: envia id no corpo
      response = await fetch(apiUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: parseInt(id),      // ID da sugestão
          titulo,
          sugestao,
          userEntity: { id: userID } // Mantém relação com usuário
        })
      });
    } else {
      // Criando nova sugestão
      response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, sugestao, userEntity: { id: userID } })
      });
    }

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Erro ao salvar sugestão");
    }

    alert(id ? "Sugestão atualizada!" : "Sugestão enviada com sucesso!");
    form.reset();
    inputId.value = "";
    carregarSugestoes();
  } catch (err) {
    console.error(err);
    alert("Falha ao enviar sugestão! Veja console para detalhes.");
  }
});


  // Excluir sugestão
  window.deletarSugestao = async function(id) {
    if (!confirm("Tem certeza que deseja excluir esta sugestão?")) return;
    try {
      const response = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Erro ao excluir sugestão");
      alert("Sugestão excluída!");
      carregarSugestoes();
    } catch (err) {
      console.error(err);
      alert("Falha ao excluir sugestão!");
    }
  };

  // Editar sugestão (preenche formulário)
  window.editarSugestao = function(id) {
    const card = document.querySelector(`#listaSugestoes button[onclick='editarSugestao(${id})']`).closest(".card");
    form.titulo.value = card.querySelector("h5").innerText;
    form.sugestao.value = card.querySelector("p").innerText;
    inputId.value = id;
  };

  carregarSugestoes();
});
