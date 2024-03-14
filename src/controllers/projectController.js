const projectModel = require('../model/projectModel');

module.exports = {
  async registerProject(req, res) {
    try {
      const {
        userId,
        projectName,
        projectDescription,
        projectLink,
        projectTags,
        projectImage,
      } = req.body;

      const dataEnum = {
        TABLE: 'users',
        COLUMN: 'user_id',
      };

      const userToCheck = await projectModel.verifyId(
        dataEnum.TABLE,
        dataEnum.COLUMN,
        userId
      );

      if (userToCheck === 1) {
        await projectModel.insertProject(
          userId,
          projectName,
          projectDescription,
          projectLink,
          projectImage,
          projectTags
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
    const dataEnum = {
      TABLE: 'projects',
      COLUMN: 'project_id',
    };
    const result = await projectModel.verifyId(
      dataEnum.TABLE,
      dataEnum.COLUMN,
      projectId
    );
    if (result === 1) {
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
  async deleteProject(req, res) {
    try {
      const { projectId } = req.body;
      const dataEnum = {
        TABLE: 'projects',
        COLUMN: 'project_id',
      };
      const result = await projectModel.verifyId(
        dataEnum.TABLE,
        dataEnum.COLUMN,
        projectId
      );
      if (result === 1) {
        await projectModel.delete(projectId);
        return res
          .status(200)
          .json({ message: 'Projeto deletado com sucesso' });
      }
      return res.status(404).json({ message: 'Projeto não encontrado' });
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao deletar projeto' });
    }
  },
};
