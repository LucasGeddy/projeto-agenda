exports.checkCsrfError = (err, req, res, next) => {
    if (err) {
        return res.render('404');
    }
};

exports.csrfMiddleware = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    res.locals.errors = req.flash('errors');
    res.locals.success = req.flash('success');
    res.locals.user = req.session.user;
    next();
};

exports.loginRequired = (req, res, next) => {
    if (!req.session.user) {
        req.flash('errors', 'Por favor, entre com seu usuário para acessar esta página.');
        req.session.save(() => res.redirect('/login/index'));
        return;
    }

    next();
}

exports.logoutRequired = (req, res, next) => {
    if (req.session.user) {
        req.flash('errors', 'Por favor, saia da sua conta para acessar esta página.');
        req.session.save(() => res.redirect('/'));
        return;
    }

    next();
}