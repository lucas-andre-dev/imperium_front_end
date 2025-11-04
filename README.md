# Imperium Frontend

O **Imperium Frontend** é a interface web do sistema **Imperium**, desenvolvida com **HTML**, **CSS** e **JavaScript** puro.  
O sistema tem como objetivo oferecer uma interface moderna, intuitiva e responsiva para interação com a **API do Imperium**, permitindo o gerenciamento de **chamados de TI**, **usuários**, **estoque** e **sugestões**.

---

## 💻 Tecnologias utilizadas
- HTML5  
- CSS3  
- JavaScript (ES6+)  
- Bootstrap 5  
- Fetch API (integração com backend Spring Boot)

---

## 🔧 Funcionalidades principais
- Login e autenticação de usuários.  
- Criação e acompanhamento de **chamados de suporte de TI**.  
- Gerenciamento de **usuários e permissões**.  
- Controle e visualização de **itens de estoque**.  
- Envio e acompanhamento de **sugestões de melhoria**.  
- Painel administrativo para controle geral do sistema.  

---

## ⚙️ Como executar o projeto localmente

### 1. Clonar o repositório
```bash
git clone https://github.com/lucas-andre-dev/imperium-frontend.git
````
### 2. Executar o projeto

Basta abrir o arquivo index.html diretamente no navegador
ou utilizar uma extensão como Live Server (no VS Code).

Observação:
O backend (Imperium API) deve estar rodando localmente em
http://localhost:8080 para que as funcionalidades funcionem corretamente.

### 3. 🌐 Integração com o Backend

O frontend se comunica com o backend através de requisições HTTP via Fetch API, consumindo os endpoints da Imperium API.
As operações incluem:

Autenticação de usuários.

Criação e atualização de chamados.

Consulta e gerenciamento de dados administrativos.

Envio de sugestões.

### 📜 Licença

Este projeto é de uso interno e educativo.
Distribuição ou reprodução não autorizada sem o devido crédito é proibida.
