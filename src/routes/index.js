const { Router } = require('express');
const userControllers = require('../controllers/userControllers');

const routes = new Router();

routes.post('/register', userControllers.register);
module.exports = routes;
