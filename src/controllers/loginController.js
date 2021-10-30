const Login = require('../models/LoginModel')

exports.index = (req, res) => {
    return res.render('login');
};

exports.registrar = async (req, res) => {
    try {
        const login = new Login(req.body);
        await login.registra();

        if (login.erros.length > 0) {
            req.flash('erros', login.erros);
            req.session.save(() => res.redirect('back'));
            return;
        }

        req.flash('successo', 'Usuário criado com sucesso!');
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

        if (login.erros.length > 0) {
            req.flash('erros', login.erros);
            req.session.save(() => res.redirect('back'));
            return;
        }

        req.flash('successo', 'Login efetuado com sucesso!');
        req.session.usuario = login.usuario;
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