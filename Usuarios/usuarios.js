
const apiUrl = "http://localhost:8080/usuarios";
const tabela = document.querySelector("#tabelaUsuarios tbody");
const btnSalvar = document.getElementById("btnSalvar");

// CAPTURANDO OS CAMPOS NA CRIAÇÃO DE USUARIOS
const idUsuario = document.getElementById("idUsuario");
const nome = document.getElementById("nome");
const email = document.getElementById("email");
const senha = document.getElementById("senha");
const roles = document.getElementById("roles");

// LISTA TODOS OS USUARIO CADASTRADOS NO BANCO DE DADOS
function carregarUsuarios() {
  fetch(apiUrl)
    .then(res => res.json())
    .then(usuarios => {
      tabela.innerHTML = "";
      usuarios.forEach(u => {
        tabela.innerHTML += `
          <tr>
            <td>${u.id}</td>
            <td>${u.nome}</td>
            <td>${u.email}</td>
            <td>${u.roles}</td>
            <td>
              <button class="btn btn-warning btn-sm" onclick="editarUsuario(${u.id})"><i class="bi bi-pencil"></i></button>
              <button class="btn btn-danger btn-sm" onclick="deletarUsuario(${u.id})"><i class="bi bi-trash"></i></button>
            </td>
          </tr>`;
      });
    })
    .catch(err => console.error("Erro ao carregar usuários:", err));
}

//  VERIFICA SE HÁ CAMPOS NULOS, E SE OS CAMPOS SÃO ESPAÇOS VAZIOS
// E SALVA NO BANCO DE DADOS
btnSalvar.addEventListener("click", async () => { // ⬅️ Adicione 'async' aqui
    const nomeValue = nome.value.trim();
    const emailValue = email.value.trim();
    const senhaValue = senha.value.trim();
    const rolesValue = roles.value.trim();
    if (!nomeValue || !emailValue || !senhaValue || !rolesValue) {
        alert("Atenção: Todos os campos (Nome, Email, Senha e Setor/Role) são obrigatórios!");
        return;
    }
    // CAPTURA OS DADOS PARA DENTRO DE USUARIOS
    const usuario = {
        nome: nome.value,
        email: email.value,
        senha: senha.value,
        roles: roles.value
    };

    try {
        // REALIZA A REQUISIÇÃO POST ENVIANDO UM JSON NO END POINT CONFIGURADO EM APIURL
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuario)
        });

        // VERIFICA A REPOSTA 2XX 3XX 4XX 5XX
        if (!response.ok) {
            // Se houver um erro 4xx ou 5xx, lança o erro para o bloco 'catch'
            throw new Error(`Esse email já existe, tente novamente`);
        }

        // SE DER CERTO LIMPA O FORMULARIO E RECARREGA A LISTA
        alert("Usuário salvo com sucesso!");
        document.getElementById("formUsuario").reset();
        idUsuario.value = "";
        carregarUsuarios(); 
// TRATAMENTO DE ERRO COM CATCH CASO STATUS NÃO OK
    } catch (erro) {

        console.error("Erro ao salvar usuário:", erro);
        alert(`Não foi possível criar o usuário. Detalhes: ${erro.message}`);
    }
});
function resetFom(form){

}

// EDITAR USUARIO EXISTENTE
function editarUsuario(id) {
  // REDIRECIONA O USUARIO PARA PAGINA DE EDIÇÃO
  window.location.href = `editarUsuario.html?id=${id}`;
}

// DELETAR
function deletarUsuario(id) {
  if (confirm("Tem certeza que deseja excluir este usuário?")) {
    fetch(`${apiUrl}/${id}`, { method: "DELETE" })
      .then(res => {
        if (!res.ok) throw new Error("Erro ao deletar");
        carregarUsuarios();
      })
      .catch(err => console.error(err));
  }
}


// REGAREGA A LISTA DE USUARIOS, PARA MANTER ATUALIZIADA
carregarUsuarios();
