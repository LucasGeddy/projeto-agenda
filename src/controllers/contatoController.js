const Contato = require('../models/ContatoModel');

exports.index = (req, res) => {    
    res.render('contato', { contato: {} });
    return;
};

exports.registrar = async (req, res) => {    
    try {
        const contato = new Contato(req.body, req.session.usuario);
        await contato.register();

        if (contato.erros.length > 0) {
            req.flash('erros', contato.erros);
            req.session.save(() => res.redirect('back'));
            return;
        }

        req.flash('successo', 'Contato registrado com sucesso.');
        req.session.save(() => res.redirect(`/contato/index/${contato.contato._id}`));
        return;
    } catch (e) {
        console.log(e);
        res.render('404');
    }
};

exports.editar = async (req, res) => {
    if (!req.params.id) return res.render('404');

    const contato = await Contato.buscaPorId(req.params.id);
    if (!contato) return res.render('404');

    res.render('contato', { contato });
};

exports.salvarEdicao = async (req, res) => {
    
    try {
        if (!req.params.id) return res.render('404');

        const contato = new Contato(req.body);
        await contato.edit(req.params.id);
        
        if (contato.erros.length > 0) {
            req.flash('erros', contato.erros);
            req.session.save(() => res.redirect('back'));
            return;
        }
    
        req.flash('successo', 'Contato alterado com sucesso.');
        req.session.save(() => res.redirect(`/contato/index/${contato.contato._id}`)); 
        return;        
    } catch (e) {
        console.log(e);
        res.render('404');
    }
};