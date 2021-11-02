const Contato = require('../models/ContatoModel');

exports.index = async (req, res) => {
    const contatos = await Contato.buscaContatosPorUsuario(req.session.usuario ? req.session.usuario._id : '');
    
    res.render('index', { contatos });
    return;
};