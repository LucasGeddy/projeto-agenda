const Login = require('../models/LoginModel')

exports.index = (req, res) => {
    return res.render('login');
};

exports.register = async (req, res) => {
    try {
        const login = new Login(req.body);
        await login.register();

        if (login.errors.length > 0) {
            req.flash('errors', login.errors);
            req.session.save(() => res.redirect('back'));
            return;
        }

        req.flash('success', 'Usuário criado com sucesso!');
        req.session.save(() => res.redirect('back'));
        return;
    } catch (e) {
        console.log(e);
        res.render('404');
    }
}

exports.login = async (req, res) => {
    try {
        const login = new Login(req.body);
        await login.login();

        if (login.errors.length > 0) {
            req.flash('errors', login.errors);
            req.session.save(() => res.redirect('back'));
            return;
        }

        req.flash('success', 'Login efetuado com sucesso!');
        req.session.user = login.user;
        req.session.save(() => res.redirect('/'));
        return;
    } catch (e) {
        console.log(e);
        res.render('404');
    }
}

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
}