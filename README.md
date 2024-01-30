# Orange Portifolio - Back End Repo

Este é um projeto de backend desenvolvido em Node.js para o hackaton da Orange Juice (comunidade do Grupo FCamara). Não participei oficialmente mas como compartilharam a proposta do desafio do código, fiquei tentado a fazer.

## Participantes

- Leonardo Souza (Um mero mortal)

## Mentores e supervisores de código

### Front End

- Lucas Viana (@mechamobau)

### Back End

- Leonardo Santos (@leonardossev)

## Dependências

O projeto utiliza algumas dependências para seu funcionamento. Abaixo estão as principais bibliotecas:

- dotenv: Gerenciamento de variáveis de ambiente para configuração do projeto.

- express: Framework para construção de aplicativos web em Node.js, facilitando a criação de APIs REST.

- body-parser: Middleware para processar dados enviados no corpo das requisições HTTP, especialmente útil para parsing de JSON.

- mysql2: Pacote para interação com bancos de dados MySQL, permitindo consultas e manipulação de dados.

- cors: Middleware para lidar com política de mesma origem (CORS), habilitando o acesso controlado a recursos do servidor a partir de origens diferentes.

- bcrypt: Biblioteca para criptografia de senhas, utilizada para garantir a segurança no armazenamento de senhas no banco de dados.

## Configuação do projeto

Antes de executar o projeto, certifique-se de configurar as variáveis de ambiente. Crie um arquivo .env na raiz do projeto e adicione as seguintes variáveis:

```dotenv
PORT=3000
HOST_ADRESS=seu_host_mysql
NAME=seu_usuario_mysql
PASS=sua_senha_mysql
DB=seu_banco_de_dados_mysql
```

Além disso, instale as dependências do projeto usando:

```bash
npm install
```

## Funcionalidades

### Registro de Usuário

Endpoint para registrar novos usuários. Os dados incluem username, email, password, name, e surname. A senha é criptografada antes de ser armazenada no banco de dados.

URL: POST /register

- Entrada:

```json
{
  "username": "exemplo",
  "email": "exemplo@email.com",
  "password": "senha123",
  "name": "Nome",
  "surname": "Sobrenome"
}
```

- Saída de Sucesso:

```json
{
  "message": "Usuário registrado com sucesso"
}
```

- Códigos de Erro:
  - 409: Usuário ou e-mail já cadastrado
  - 500: Erro ao registrar usuário 2. 

### Recuperação de Informações do Usuário

Endpoint para recuperar informações de um usuário existente com base no ID.

URL: POST /user

- Entrada:

```json
{
  "id": 1
}
```

- Saída de Sucesso:

```json
{
  "name": "Nome",
  "surname": "Sobrenome",
  "email": "exemplo@email.com"
}
```

- Códigos de Erro:

  - 404: Usuário não encontrado
  - 500: Erro interno do servidor

## Executando o Projeto

Para iniciar o servidor, execute o seguinte comando:
```bash
npm start
```
O servidor estará rodando em http://localhost:${PORT}.