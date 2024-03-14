const connection = require('../database/connection');
const projectModel = require('../model/projectModel');

module.exports = {
  async addProject(req, res) {
    try {
      const { userId, projectName, projectDescription, projectLink } = req.body;
      const [result] = await connection
        .promise()
        .query(
          'SELECT COUNT(user_id) AS userToCheck FROM cadastro.users WHERE user_id = ?',
          [userId]
        );
      const [{ userToCheck }] = result;
      if (userToCheck === 1) {
        await connection
          .promise()
          .query(
            'INSERT INTO cadastro.projects (user_id, project_name, project_description, project_link) VALUES (?, ?, ?, ?)',
            [userId, projectName, projectDescription, projectLink]
          );
        return res
          .status(201)
          .json({ message: 'Projeto cadastrado com sucesso!' });
      }
      return res.status(404).json({ message: 'Usuário não encontrado' });
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao cadastrar projeto' });
    }
  },
  async editProject(req, res) {
    const projectToCheck = await projectModel.verifyId(
      'projects',
      'project_id',
      req.body.projectId
    );
    if (projectToCheck === true) {
      try {
        await projectModel.editProject(req);
        return res
          .status(200)
          .json({ message: 'Projeto alterado com sucesso' });
      } catch (error) {
        return res.status(500).json({ message: 'Erro ao cadastrar projeto' });
      }
    }
    return res.status(404).json({ message: 'Projeto não encontrado' });
  },
};
