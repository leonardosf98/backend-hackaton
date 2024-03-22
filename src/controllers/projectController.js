const projectModel = require("../model/projectModel");

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

      const userToCheck = await projectModel.verifyUserExistence(userId);

      if (userToCheck) {
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
          .json({ message: "Projeto cadastrado com sucesso!" });
      }
      return res.status(404).json({ message: "Usuário não encontrado" });
    } catch (error) {
      return res.status(500).json({ message: "Erro ao cadastrar projeto" });
    }
  },
  async getInfo(req, res) {
    const { id } = req.params;
    const result = await projectModel.verifyProjectExistence(projectId);
    if (result) {
      const [info] = await projectModel.getInfo(projectId);
      return res.status(200).json({ message: info });
    }
    return res.status(404).json({ message: "Projeto não encontrado" });
  },
  async editProject(req, res) {
    const { projectId } = req.body;
    const result = await projectModel.verifyProjectExistence(projectId);
    if (result) {
      try {
        await projectModel.editProject(req);
        return res
          .status(200)
          .json({ message: "Projeto alterado com sucesso" });
      } catch (error) {
        return res.status(500).json({ message: "Erro ao cadastrar projeto" });
      }
    }
    return res.status(404).json({ message: "Projeto não encontrado" });
  },
  async deleteProject(req, res) {
    try {
      const { projectId } = req.body;
      const result = await projectModel.verifyProjectExistence(projectId);
      if (result) {
        await projectModel.delete(projectId);
        return res
          .status(200)
          .json({ message: "Projeto deletado com sucesso" });
      }
      return res.status(404).json({ message: "Projeto não encontrado" });
    } catch (error) {
      return res.status(500).json({ message: "Erro ao deletar projeto" });
    }
  },
  async getProjectFromTag(req, res) {
    const { tags, page, limit } = req.body;
    try {
      const [projects] = await projectModel.getProjectsByTag(tags, page, limit);
      return res.status(201).json({ message: projects });
    } catch (error) {
      return res.status(500).json({ message: "Erro ao requerir projetos" });
    }
  },
};
