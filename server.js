// Variáveis de ambiente
require('dotenv').config();

// Iniciando Express
const express = require('express');
const app = express();

// Conectando no Mongo
const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTIONSTRING)
    .then(() => {
        console.log('conectado ao MongoDB');
        app.emit('dbConnected');
    })
    .catch((e) => console.log(e));

// Componentes para Sessions
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

// Iniciando Rotas
const route = require('./routes');
const path = require('path');

// Iniciando segurança
const helmet = require('helmet');
const csrf = require('csurf');

// Middlewares locais
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware');

// Ativando encoding de conteúdo de requisição
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static
app.use(express.static(path.resolve(__dirname, 'public')));

// Configurando Sessions
const sessionOptions = session({
    secret: 'asdfbdsagfhasdfbawsr',
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
});
app.use(sessionOptions);
app.use(flash());

// Views
app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(csrf());
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(route);

// Starting app
app.on('dbConnected', () => {
    app.listen(process.env.LISTENPORT, () => {
        console.log(`Executando aplicação na porta ${process.env.LISTENPORT}`);
        console.log(`Acessar: http://localhost:${process.env.LISTENPORT}`);
    })
});