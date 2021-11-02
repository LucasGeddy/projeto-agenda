const express = require('express');
const route = express.Router();

const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const contatoController = require('./src/controllers/contatoController');
const { loginRequired, logoutRequired } = require('./src/middlewares/middleware');

// Rotas da home
route.get('/', homeController.index);

// Rotas de login
route.get('/login/index', logoutRequired, loginController.index);
route.post('/login/register', logoutRequired, loginController.registrar);
route.post('/login/login', logoutRequired, loginController.login);
route.get('/login/logout', loginController.logout);

// Rotas de contato
route.get('/contato/index', loginRequired, contatoController.index);
route.post('/contato/register', loginRequired, contatoController.registrar);
route.get('/contato/index/:id', loginRequired, contatoController.editar);
route.post('/contato/edit/:id', loginRequired, contatoController.salvarEdicao);
route.get('/contato/delete/:id', loginRequired, contatoController.excluir);

module.exports = route;