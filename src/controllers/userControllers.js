const bcrypt = require('bcrypt');
const saltRounds = 10;

const connection = require('../database/connection');
module.exports = {
  async register(req, res) {
    const { username, email, password, name, surname } = req.body;
    const cryptoPass = await bcrypt.hash(password, saltRounds);
    const [dataToCheck] = await connection
      .promise()
      .query(
        'SELECT COUNT(*) AS userCount FROM USERS WHERE user_username = ? OR user_email = ?',
        [email, username]
      );

    if (dataToCheck[0].userCount > 0) {
      return res
        .status(409)
        .json({ message: 'Usuário e/ou e-mail já cadastrado' });
    }
    await connection
      .promise()
      .query(
        'INSERT INTO users (user_username, user_email, user_password, user_name, user_surname) VALUES (?, ?, ?, ?, ?)',
        [username, email, cryptoPass, name, surname]
      );
    return res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
  },

  async getUserInfo(req, res) {
    try {
      const id = req.body.id;
      const [userToFind] = await connection
        .promise()
        .query('SELECT name, surname, email FROM users WHERE id = ?', [id]);
      if (userToFind.length > 0) {
        const { name, surname, email } = userToFind[0];
        return res
          .status(200)
          .json({ name: name, surname: surname, email: email });
      }
      return res.status(404).json({ message: 'Usuário não encontrado' });
    } catch (error) {
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },
};
