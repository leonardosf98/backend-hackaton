const connection = require('../database/connection');

module.exports = {
  checkDuplicity(email, username) {
    return connection
      .promise()
      .query(
        'SELECT COUNT(*) AS total FROM USERS WHERE user_username = ? OR user_email = ?',
        [username, email]
      );
  },
  registerUser(username, email, cryptoPass, name, surname) {
    return connection
      .promise()
      .query(
        'INSERT INTO users (user_username, user_email, user_password, user_name, user_surname) VALUES (?, ?, ?, ?, ?)',
        [username, email, cryptoPass, name, surname]
      );
  },
};
