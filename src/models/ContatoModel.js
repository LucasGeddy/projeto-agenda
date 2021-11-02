const mongoose = require('mongoose');
const validator = require('validator');

const ContatoSchema = new mongoose.Schema({
    usuarioId: { type: String, required: true },
    nome: { type: String, required: true },
    sobrenome: { type: String, required: false, default: '' },
    email: { type: String, required: false, default: '' },
    telefone: { type: String, required: false, default: '' },
    dataCriacao: { type: Date, default: Date.now },
});

const ContatoModel = mongoose.model('Contato', ContatoSchema);

class Contato {
    constructor(body) {
        this.body = body;
        this.erros = [];
        this.contato = null;
    };

    async registra() {
        this.valida();
        if (this.erros.length > 0) return;

        this.contato = await ContatoModel.create(this.body);
    };

    async editar(id) {
        this.valida();
        if (this.erros.length > 0) return;

        this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true });
    };

    async excluir(id) {
        if (typeof id !== 'string') return;
        const contato = await ContatoModel.findByIdAndDelete(id);
        return contato;
    };

    valida() {
        this.limpaObj();
        if (this.body.email && !validator.isEmail(this.body.email)) this.erros.push('E-mail inválido');

        if (!this.body.nome) this.erros.push('Nome é obrigatório.');
        if (!this.body.email && !this.body.telefone) this.erros.push('Preencha um telefone ou email.');
    };

    limpaObj() {
        for (const key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = '';
            };
        };

        this.body = {
            usuarioId: this.body.usuarioId,
            nome: this.body.nome,
            sobrenome: this.body.sobrenome,
            email: this.body.email.toLowerCase(),
            telefone: this.body.telefone
        };
    };

    // Métodos estáticos
    static async buscaPorId(id) {
        if (typeof (id) !== 'string') return;
        const contato = await ContatoModel.findById(id);
        return contato;
    };

    static async buscaContatosPorUsuario(usuarioId) {
        if (typeof (usuarioId) !== 'string' || !usuarioId) return [];
        const contatos = await ContatoModel.find({ usuarioId: usuarioId }).sort({ criadoEm: -1 });
        return contatos;
    };
}

module.exports = Contato;