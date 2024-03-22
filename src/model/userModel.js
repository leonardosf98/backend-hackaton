const connection = require("../database/connection");

module.exports = {
  async checkDuplicity(email) {
    const [[result]] = await connection
      .promise()
      .query(
        "SELECT COUNT(*) AS total FROM cadastro.users WHERE user_email = ?",
        [email]
      );
    return result.total;
  },
  register(email, cryptoPass, name, surname) {
    return connection
      .promise()
      .query(
        "INSERT INTO users ( user_email, user_password, user_name, user_surname) VALUES ( ?, ?, ?, ?)",
        [email, cryptoPass, name, surname]
      );
  },
  getInfo(id) {
    try {
      return connection
        .promise()
        .query(
          "SELECT user_name, user_surname FROM cadastro.users WHERE user_id = ?",
          [id]
        );
    } catch (error) {
      throw error;
    }
  },
};
