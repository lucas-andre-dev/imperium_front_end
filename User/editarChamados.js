document.addEventListener("DOMContentLoaded", async () => {
  const id = localStorage.getItem("chamadoId");
  if (!id) {
    alert("Nenhum chamado selecionado.");
    window.location.href = "userChamados.html";
    return;
  }

  try {
    const response = await fetch(`https://imperium-api-1.onrender.com//chamados/listar/${id}`);
    if (!response.ok) throw new Error("Erro ao buscar chamado");

    const chamado = await response.json();

    // Preenche os campos com os dados vindos do banco
    document.getElementById("setor").value = chamado.setor;
    document.getElementById("assunto").value = chamado.assunto;
    document.getElementById("descricao").value = chamado.descricao;

  } catch (error) {
    console.error(error);
    alert("Erro ao carregar dados do chamado.");
  }
});



let form = document.getElementById("formEditarChamado")
form.addEventListener("submit",async (event)=>{
    event.preventDefault();

    let id = localStorage.getItem("chamadoId");
    let setor = document.getElementById("setor").value;
    let assunto = document.getElementById("assunto").value;
    let descricao = document.getElementById("descricao").value;
    

    const chamado = {
        setor:setor,
        assunto: assunto,
        descricao: descricao
    }
    atualizarChamado(id,chamado);
});


// Atualiza um chamado existente

async function atualizarChamado(id, chamado) {
  const response = await fetch(`https://imperium-api-1.onrender.com/chamados/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(chamado),
  });
    if (response.ok) {
    alert("Chamado atualizado com sucesso!");
    localStorage.removeItem("chamadoId");
    window.location.href = "userChamados.html";
  } else {
    alert("Erro ao atualizar o chamado.");
  }
}