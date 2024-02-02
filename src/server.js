require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const cors = require("cors");

//Variáveis para criptografia
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(cors());
const connection = mysql.createConnection({
  host: process.env.HOST_ADRESS,
  user: process.env.NAME,
  password: process.env.PASS,
  database: process.env.DB,
});

connection.connect((error) => {
  if (error) {
    console.log("Erro ao conectar ao MySQL:", error);
  } else {
    console.log("conectado ao MySQL");
  }
});

app.post("/register", async (req, res) => {
  try {
    const { username, email, password, name, surname } = req.body;
    const cryptoPass = await bcrypt.hash(password, saltRounds);
    await connection
      .promise()
      .query(
        "INSERT INTO users (username, email, password, name, surname) VALUES (?, ?, ?, ?, ?)",
        [username, email, cryptoPass, name, surname]
      );
    res.status(201).json({ message: "Usuário registrado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao registrar usuário" });
  }
});

app.put("/editprofile", async (req, res) => {
  try {
    const { user_id, user_username, user_email, user_name, user_surname } =
      req.body;
    const [emailResult] = await connection
      .promise()
      .query(
        "SELECT COUNT(*) AS count FROM cadastro.users WHERE user_email = ? AND user_id <> ?",
        [user_email, user_id]
      );
    const [userResult] = await connection
      .promise()
      .query(
        "SELECT COUNT(*) AS count FROM cadastro.users WHERE user_username = ? AND user_id <> ?",
        [user_username, user_id]
      );
    const [idResult] = await connection
      .promise()
      .query(
        "SELECT COUNT(user_id) AS count FROM cadastro.users WHERE user_id = ?",
        [user_id]
      );
    if (idResult[0].count === 0) {
      return res.status(422).json({ message: "Número de ID inválido" });
    }
    if (emailResult[0].count > 0) {
      return res.status(422).json({ message: "E-mail já cadastrado" });
    }
    if (userResult[0].count > 0) {
      return res.status(422).json({ message: "Nome de usuário já cadastrado" });
    }
    await connection
      .promise()
      .query(
        "UPDATE cadastro.users SET user_name = ?, user_surname = ?, user_email = ?, user_username = ? WHERE user_id = ?",
        [user_name, user_surname, user_email, user_username, user_id]
      );
    return res.status(201).json({ message: "Dados atualizados com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao alterar dados do usuário" });
  }
});

app.post("/user", async (req, res) => {
  try {
    const id = req.body.id;
    const [userToFind] = await connection
      .promise()
      .query("SELECT name, surname, email FROM users WHERE id = ?", [id]);
    if (userToFind.length > 0) {
      const { name, surname, email } = userToFind[0];
      return res
        .status(200)
        .json({ name: name, surname: surname, email: email });
    }
    return res.status(404).json({ message: "Usuário não encontrado" });
  } catch (error) {
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
});
app.post("/addproject", async (req, res) => {
  try {
    const { userId, projectName, projectDescription, projectLink, tagsIds } =
      req.body;

    const [result] = await connection
      .promise()
      .query(
        "SELECT COUNT(user_id) AS userToCheck FROM cadastro.users WHERE user_id = ?",
        [userId]
      );
    const [{ userToCheck }] = result;

    if (userToCheck === 1) {
      const response = await registerProject(
        userId,
        projectName,
        projectDescription,
        projectLink,
        tagsIds
      );
      switch (response) {
        case 1:
          return res
            .status(201)
            .json({ message: "Projeto cadastrado com suceso" });
        case 0:
          return res
            .status(500)
            .json({ message: "Erro ao cadastrar projeto no banco de dados" });
      }
    }
    return res.status(404).json({ message: "Usuário não encontrado" });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao cadastrar projeto" });
  }
});
async function registerProject(
  userId,
  projectName,
  projectDescription,
  projectLink,
  tagsIds
) {
  try {
    await connection.promise().beginTransaction();

    const [projectResult] = await connection
      .promise()
      .query(
        "INSERT INTO cadastro.projects (user_id, project_name, project_description, project_link) VALUES (?, ?, ?, ?)",
        [userId, projectName, projectDescription, projectLink]
      );
    let doesTagExist;
    const projectId = projectResult.insertId;
    await Promise.all(
      tagsIds.map(async (tagId) => {
        const [result] = await connection
          .promise()
          .query(
            "SELECT COUNT(tag_id) AS tagToCheck FROM cadastro.project_tag_relationship WHERE tag_id = ?",
            [tagId]
          );
        const [{ tagToCheck }] = result;
        if (tagToCheck === 1) {
          doesTagExist = true;
        }
        await connection
          .promise()
          .query(
            "INSERT INTO cadastro.project_tag_relationship (project_id, tag_id) VALUES (?, ?)",
            [projectId, tagId]
          );
      })
    );
    if (doesTagExist) {
      await connection.promise().commit();
      return 1;
    }
    return 0;
  } catch (error) {
    await connection.promise().rollback();
    return 0;
  }
}
app.listen(port, () => {
  console.log(`Servidor backend rodando em http://localhost:${port}`);
});
