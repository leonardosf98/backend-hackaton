const connection = require('../database/connection');

module.exports = {
  checkDuplicity(email) {
    return connection
      .promise()
      .query('SELECT COUNT(*) AS total FROM USERS WHERE user_email = ?', [
        email,
      ]);
  },
  registerUser(email, cryptoPass, name, surname) {
    return connection
      .promise()
      .query(
        'INSERT INTO users (user_username, user_email, user_password, user_name, user_surname) VALUES (?, ?, ?, ?, ?)',
        [email, cryptoPass, name, surname]
      );
  },
};
