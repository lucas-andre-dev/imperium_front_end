const apiUrl = "http://localhost:8080/usuarios";

// pega o ID passado na URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// pega os campos do formulário
const form = document.getElementById("formEditar");
const idUsuario = document.getElementById("idUsuario");
const nome = document.getElementById("nome");
const email = document.getElementById("email");
const senha = document.getElementById("senha");
const roles = document.getElementById("roles");

// carrega dados do usuário
fetch(`${apiUrl}/${id}`)
  .then(res => res.json())
  .then(u => {
    idUsuario.value = u.id;
    nome.value = u.nome;
    email.value = u.email;
    roles.value = u.roles;
  })
  .catch(() => alert("Erro ao carregar dados do usuário!"));

// evento de envio (salvar alterações)
form.addEventListener("submit", e => {
  e.preventDefault();

  // Pega os valores e remove espaços extras
  const nomeValue = nome.value.trim();
  const emailValue = email.value.trim();
  const senhaValue = senha.value.trim();
  const rolesValue = roles.value.trim();

  // Validação de campos obrigatórios
  if (!nomeValue || !emailValue || !senhaValue || !rolesValue) {
      alert("Atenção: Todos os campos (Nome, Email, Senha e Setor/Role) são obrigatórios!");
      return;
  }

  // Cria o objeto do usuário atualizado
  const usuarioAtualizado = {
    id: idUsuario.value,
    nome: nomeValue,
    email: emailValue,
    senha: senhaValue,
    roles: rolesValue
  };

  // Envia a requisição PUT
  fetch(`${apiUrl}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuarioAtualizado)
  })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao atualizar usuário");
      alert("Usuário atualizado com sucesso!");
      window.location.href = "usuarios.html"; // volta para a lista de usuários
    })
    .catch(err => {
      console.error(err);
      alert("Falha ao salvar alterações, Esse email não está disponivel, tente outro!");
    });
    //VERIFICA SE USUARIO É ADMIN E ESTÁ LOGADO
    document.addEventListener("DOMContentLoaded", () => {
      const usuario = JSON.parse(localStorage.getItem("usuario"));

      if (!usuario || !usuario.logado || !usuario.roles.includes("ADMIN")) {
        alert("Acesso negado! Esta página é exclusiva para administradores.");
        window.location.href = "../User/user.html";
  }
});
});
