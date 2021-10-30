const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
    email: { type: String, required: true },
    senha: { type: String, required: true },
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
    constructor(body) {
        this.body = body;
        this.erros = [];
        this.usuario = null;
    }

    async registrar() {
        this.valida();
        if (await this.buscaUsuario()) this.erros.push('Usuário já existente!');
        if (this.erros.length > 0) return;

        const salt = bcryptjs.genSaltSync();
        this.body.senha = bcryptjs.hashSync(this.body.senha, salt);
        this.usuario = await LoginModel.criar(this.body);
    }

    async login() {
        this.valida();
        if (this.erros.length > 0) return;
        
        const acessoFalhouMsg = 'Dados inválidos.';
        this.usuario = await this.buscaUsuario();
        if (!this.usuario) this.erros.push(loginFailMsg);
        if (this.erros.length > 0) return;

        if (!bcryptjs.compareSync(this.body.senha, this.usuario.senha)) {
            this.erros.push(acessoFalhouMsg);
            this.usuario = null;
            return;
        }
    }

    valida() {
        this.limpaObj();
        if (!validator.isEmail(this.body.email)) this.erros.push('E-mail inválido');

        if (this.body.senha.length < 8 || this.body.senha.length > 50) {
            this.erros.push('Senha inválida. A senha precisa ser composta por 8 a 50 caracteres.');
        }
    }

    limpaObj() {
        for (const key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        };

        this.body = {
            email: this.body.email.toLowerCase(),
            senha: this.body.senha
        }
    }

    async buscaUsuario() {
        return await LoginModel.findOne({ email: this.body.email.toLowerCase() });
    }
}

module.exports = Login;