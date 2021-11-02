const Contato = require('../models/ContatoModel');

exports.index = async (req, res) => {
    const contatos = await Contato.buscaContatosPorUsuario() ?? [];
    
    res.render('index', { contatos });
    return;
};