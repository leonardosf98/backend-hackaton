require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");

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

const User = connection.promise().query(`
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(45) NOT NULL,
        surname VARCHAR(255) NOT NULL
    )
`);

app.post("/register", async (req, res) => {
  try {
    const { username, email, password, name, surname } = req.body;
    await connection
      .promise()
      .query("INSERT INTO users (username, email, password, name, surname) VALUES (?, ?, ?, ?, ?)", [
        username,
        email,
        password,
        name,
        surname
      ]);
    res.status(201).json({ message: "Usuário registrado com sucesso" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erro ao registrar usuário" });
  }
});

app.post("/user", async (req, res)=>{
  try{
    const id = req.body;
    const [userToFind] = await connection.promise().query("SELECT name, surname, email FROM users WHERE id = ?", [id]);
    if(userToFind.length > 0){
      const {name, surname, email} = userToFind[0];
      res.status(200).json({name: name, surname: surname, email: email});
    } else {
      res.status(404).json({message: "Usuário não encontrado"})
    }
  }catch(error){
    console.log(error)
    res.status(500).json({message: "Erro interno do servidor"})

  }

})
app.listen(port, () => {
  console.log(`Servidor backend rodando em http://localhost:${port}`);
});
