const bcrypt = require("bcrypt");
const saltRounds = 10;

const userModel = require("../model/userModel");
const projectModel = require("../model/projectModel");

module.exports = {
  async register(req, res) {
    const { email, password, name, surname } = req.body;
    const cryptoPass = await bcrypt.hash(password, saltRounds);

    const dataToCheck = await userModel.checkDuplicity(email);

    if (dataToCheck) {
      return res.status(409).json({ message: "E-mail já cadastrado" });
    }
    try {
      await userModel.register(email, cryptoPass, name, surname);
      return res
        .status(201)
        .json({ message: "Usuário cadastrado com sucesso" });
    } catch (error) {
      return res.status(401).json({ message: "Erro ao cadastrar usuário" });
    }
  },

  async getUserInfo(req, res) {
    try {
      const { userId } = req.body;
      const userToFind = await projectModel.verifyById(userId);
      if (userToFind) {
        const [result] = await userModel.getInfo(userId);
        console.log(result);
        return res
          .status(200)
          .json({ name: result[0].user_name, surname: result[0].user_surname });
      }
      return res.status(404).json({ message: "Usuário não encontrado" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  },
  async editUserInfo(req, res) {
    try {
      const { user_id, user_username, user_email, user_name, user_surname } =
        req.body;
      const [idResult] = await connection
        .promise()
        .query(
          "SELECT COUNT(user_id) AS count FROM cadastro.users WHERE user_id = ?",
          [user_id]
        );
      if (!idResult[0].count) {
        return res.status(400).json({ message: "Usuário não encontrado" });
      }
      await connection.promise().query(
        `UPDATE 
            cadastro.users 
          SET 
            user_name = ?, user_surname = ?, user_email = ?, user_username = ? 
          WHERE 
            user_id = ?`,
        [user_name, user_surname, user_email, user_username, user_id]
      );
      return res.status(200).json({ message: "Dados atualizados com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Erro ao alterar dados do usuário" });
    }
  },
};
