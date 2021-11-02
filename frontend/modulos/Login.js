import validator from 'validator';

export default class Login {
    constructor(formClass) {
        this.form = document.querySelector(formClass);
    }

    init() {
        this.events();
    }

    events() {
        if (!this.form) return;
        this.form.addEventListener('submit', e => {
            e.preventDefault();
            this.validate(e);
        });
    }

    validate(e) {
        const el = e.target;
        const emailInput = el.querySelector('input[name="email"]');
        const passwordInput = el.querySelector('input[name="senha"]');
        let erro = false;

        if (!validator.isEmail(emailInput.value)) {
            let previousAlert = emailInput.nextElementSibling;
            if (previousAlert) previousAlert.parentElement.removeChild(previousAlert);
            emailInput.insertAdjacentHTML('afterend', '<div class="alert alert-danger"> E-mail inválido! </div>');
            erro = true;
        }


        if (passwordInput.value.length < 8 || passwordInput.value.length > 50) {
            let previousAlert = passwordInput.nextElementSibling;
            if (previousAlert) previousAlert.parentElement.removeChild(previousAlert);
            passwordInput.insertAdjacentHTML('afterend', '<div class="alert alert-danger"> Senha precisa ter entre 8 e 50 caracteres! </div>');
            erro = true;
        }

        if (!erro) el.submit();

    }
}

