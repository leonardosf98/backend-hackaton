require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.HOST_ADRESS,
  user: process.env.NAME,
  password: process.env.PASS,
  database: process.env.DB,
});

connection.connect((error) => {
  if (error) {
    console.log('Erro ao conectar ao MySQL:', error);
  } else {
    console.log('conectado ao MySQL');
  }
});

module.exports = connection;
