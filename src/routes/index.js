const { Router } = require('express');
const userControllers = require('../controllers/userControllers');

const projectController = require('../controllers/projectController');

const routes = new Router();

routes.post('/register', userControllers.register);
routes.post('/project/add', projectController.registerProject);
routes.put('/edituserinfo', userControllers.editUserInfo);
routes.get('/getuserinfo', userControllers.getUserInfo);

module.exports = routes;
