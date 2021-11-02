import 'core-js/stable';
import 'regenerator-runtime/runtime';

import Login from './modulos/Login';

const cadastro = new Login('.form-cadastro');
const login = new Login('.form-login');

cadastro.init();
login.init();