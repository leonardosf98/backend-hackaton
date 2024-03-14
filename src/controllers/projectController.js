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

      const userToCheck = await projectModel.verifyById(userId);

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
  async deleteProject(req, res) {
    try {
      const { projectId } = req.body;
      const result = await projectModel.verifyId(
        'projects',
        'project_id',
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
