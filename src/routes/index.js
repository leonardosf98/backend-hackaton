const { Router } = require("express");

const userControllers = require("../controllers/userControllers");
const projectController = require("../controllers/projectController");

const routes = new Router();

routes.post("/register", userControllers.register);
routes.put("/user/edit", userControllers.editUserInfo);
routes.get("/user/info", userControllers.getUserInfo);

routes.post("/project/add", projectController.registerProject);
routes.put("/project/edit", projectController.editProject);
routes.delete("/project/delete", projectController.deleteProject);
routes.get("/project/:id", projectController.getInfo);
routes.get("/project/tag", projectController.getProjectFromTag);

module.exports = routes;
