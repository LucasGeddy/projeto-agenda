exports.checkCsrfError = (err, req, res, next) => {
    if (err) {
        return res.render('404');
    }
};

exports.csrfMiddleware = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    res.locals.erros = req.flash('erros');
    res.locals.successo = req.flash('successo');
    res.locals.usuario = req.session.usuario;
    next();
};

exports.loginRequired = (req, res, next) => {
    if (!req.session.usuario) {
        req.flash('erros', 'Por favor, entre com seu usuário para acessar esta página.');
        req.session.save(() => res.redirect('/login/index'));
        return;
    }

    next();
}

exports.logoutRequired = (req, res, next) => {
    if (req.session.usuario) {
        req.flash('erros', 'Por favor, saia da sua conta para acessar esta página.');
        req.session.save(() => res.redirect('/'));
        return;
    }

    next();
}