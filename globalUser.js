document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    // Se não estiver logado, redireciona para login
    if (!usuario || !usuario.logado) {
        alert("Acesso negado! Faça login primeiro.");
        window.location.href = "../index.html";
        return;
    }

    // Se for ADMIN tentando acessar página de usuário, também bloqueia
    if (usuario.roles !== "USER") {
        alert("Acesso restrito a usuários comuns!");
        window.location.href = "../Admin/admin.html";
        return;
    }

    // Exemplo: mostra o nome do usuário logado no header
    const nomeElemento = document.getElementById("nomeUsuario");
    if (nomeElemento) {
        nomeElemento.textContent = usuario.nome;
    }
});
