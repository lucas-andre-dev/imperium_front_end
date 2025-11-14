document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    // Se não estiver logado, redireciona
    if (!usuario || !usuario.logado) {
        alert("Acesso negado! Faça login primeiro.");
        window.location.href = "../index.html";
        return;
    }

    // Se não for ADMIN, bloqueia acesso
    if (usuario.roles !== "ADMIN") {
        alert("Acesso restrito a administradores!");
        window.location.href = "../User/user.html";
        return;
    }

    // Exemplo: mostra o nome do admin logado no header
    const nomeElemento = document.getElementById("nomeAdmin");
    if (nomeElemento) {
        nomeElemento.textContent = usuario.nome;
    }
});
