const { Router } = require('express');
const userControllers = require('../controllers/userControllers');
const projectControllers = require('../controllers/projectController');

const routes = new Router();

routes.post('/register', userControllers.register);
routes.put('/edituserinfo', userControllers.editUserInfo);
routes.get('/getuserinfo', userControllers.getUserInfo);

routes.post('/projectadd', projectControllers.addProject);
module.exports = routes;
