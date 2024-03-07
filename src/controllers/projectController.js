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
        const projectId = await projectModel.insertProject(
          userId,
          projectName,
          projectDescription,
          projectLink,
          projectImage
        );

        await projectModel.registerTag(projectId, projectTags);

        return res
          .status(201)
          .json({ message: 'Projeto cadastrado com sucesso!' });
      }
      return res.status(404).json({ message: 'Usuário não encontrado' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Erro ao cadastrar projeto' });
    }
  },
};
