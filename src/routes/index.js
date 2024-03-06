const { Router } = require('express');
const userControllers = require('../controllers/userControllers');
const projectController = require('../controllers/projectController');

const routes = new Router();

routes.post('/register', userControllers.register);
routes.post('/project/add', projectController.registerProject);

module.exports = routes;
