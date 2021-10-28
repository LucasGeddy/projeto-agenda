const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    async register() {
        this.valida();
        if (await this.findUser()) this.errors.push('Usuário já existente!');
        if (this.errors.length > 0) return;

        const salt = bcryptjs.genSaltSync();
        this.body.password = bcryptjs.hashSync(this.body.password, salt);
        this.user = await LoginModel.create(this.body);
    }

    async login() {
        this.valida();
        if (this.errors.length > 0) return;
        
        const loginFailMsg = 'Dados inválidos.';
        this.user = await this.findUser();
        if (!this.user) this.errors.push(loginFailMsg);
        if (this.errors.length > 0) return;

        if (!bcryptjs.compareSync(this.body.password, this.user.password)) {
            this.errors.push(loginFailMsg);
            this.user = null;
            return;
        }
    }

    valida() {
        this.cleanUp();
        if (!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');

        if (this.body.password.length < 8 || this.body.password.length > 50) {
            this.errors.push('Senha inválida. A senha precisa ser composta por 8 a 50 caracteres.');
        }
    }

    cleanUp() {
        for (const key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        };

        this.body = {
            email: this.body.email.toLowerCase(),
            password: this.body.password
        }
    }

    async findUser() {
        return await LoginModel.findOne({ email: this.body.email.toLowerCase() });
    }
}

module.exports = Login;