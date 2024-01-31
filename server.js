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
  const { username, email, password, name, surname } = req.body;
  const cryptoPass = await bcrypt.hash(password, saltRounds);
  const [userToCheck] = await connection
    .promise()
    .query(
      "SELECT COUNT(user_id) AS userCount FROM USERS WHERE user_username = ?",
      [email]
    );
  const [emailToCheck] = await connection
    .promise()
    .query(
      "SELECT COUNT(user_id) AS emailCount FROM USERS WHERE user_email = ?",
      [email]
    );
  if (userToCheck[0].userCount > 0) {
    return res.status(409).json({ message: "Usuário já cadastrado" });
  }
  if (emailToCheck[0].emailCount > 0) {
    return res.status(409).json({ message: "E-mail já cadastrado" });
  }
  await connection
    .promise()
    .query(
      "INSERT INTO users (user_username, user_email, user_password, user_name, user_surname) VALUES (?, ?, ?, ?, ?)",
      [username, email, cryptoPass, name, surname]
    );
  return res.status(201).json({ message: "Usuário cadastrado com sucesso" });
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

app.listen(port, () => {
  console.log(`Servidor backend rodando em http://localhost:${port}`);
});
