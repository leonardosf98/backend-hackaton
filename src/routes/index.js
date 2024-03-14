const { Router } = require('express');
const userControllers = require('../controllers/userControllers');

const projectController = require('../controllers/projectController');

const routes = new Router();

routes.post('/register', userControllers.register);
routes.post('/project/add', projectController.registerProject);
routes.put('/edituserinfo', userControllers.editUserInfo);
routes.get('/user/info', userControllers.getUserInfo);

routes.post('/project/add', projectControllers.addProject);
routes.put('/project/edit', projectControllers.editProject);
routes.delete('/project/delete', projectControllers.deleteProject);

module.exports = routes;
