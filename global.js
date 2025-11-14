// VERIFICA SE USUARIO ESTÁ LOGADO EM CADA PAGINA QUE NAVEGAR
function verificarLogin() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario || usuario.logado !== true) {
        alert("Acesso negado! Faça login novamente.");
        window.location.href = "../Login/index.html";
        return false;
    }

    return true;
}

// USA O RECURSO LOCAL STORAGE PARA ARMAZENAR OS DADOS DO USUARIO
function getUsuarioLogado() {
    return JSON.parse(localStorage.getItem("usuario"));
}

// AO CLICAR EM SAIR, ELE RESETA O LOCAL STORAGE
function configurarLogout() {
    const logoutBtn = document.getElementById("logout");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function (event) {
            event.preventDefault();

            if (confirm("Deseja realmente sair?")) {
                localStorage.removeItem("usuario"); // limpa apenas os dados do usuário
                window.location.href = "../index.html";
            }
        });
    }
}

// ESSE RECURSO FORÇA A VERIFICAÇÃO ASSIM QUE HTML CARREGA
document.addEventListener("DOMContentLoaded", function () {
    // Verifica login antes de exibir a página
    if (!verificarLogin()) return;

    // Configura botão de logout
    configurarLogout();
});
