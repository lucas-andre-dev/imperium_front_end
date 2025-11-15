let email = document.getElementById("email");
let senha = document.getElementById("senha");
let btn = document.getElementById("btn");

// AO CLICAR EM ENTRAR CAPTURA OS CAMPOS PARA UMA CONST
btn.addEventListener("click", async function(event) {
    event.preventDefault();

    const dados = {
        email: email.value.trim(),
        senha: senha.value.trim()
    };

    // VALIDAÇÃO EMAIL E SENHA
    if (!dados.email || !dados.senha) {
        alert("Por favor, preencha usuário e senha!");
        return;
    }

    try {
        const response = await fetch("http://172.20.13.53:8080/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });

        if (!response.ok) {
            throw new Error("Usuário ou senha incorretos");
        }

        const usuario = await response.json();


        // SALVA TUDO EM LOCAL STORAGE
        localStorage.setItem("usuario", JSON.stringify({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            roles: usuario.roles,
            logado: true
        }));

        // VERIFICA A ROLE DO USUARIO E REDIRECIONA PARA SUAS RESPECTIVAS PAGINAS
        // ADMIN | USER
        switch (usuario.roles) {
            case "ADMIN":
                window.location.href = "../Admin/admin.html";
                break;
            case "USER":
                window.location.href = "../User/user.html";
                break;
            default:
                alert("Tipo de usuário desconhecido!");
                break;
        }

    } catch (err) {
        console.error(err);
        alert(err.message);
    }
});
