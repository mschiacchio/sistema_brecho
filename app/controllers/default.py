from app import app
from flask import Flask, render_template, redirect, request, url_for, flash
from flask_login import LoginManager, login_user, login_required, logout_user, current_user, UserMixin

login_manager = LoginManager()
login_manager.init_app(app)

@app.route("/home")
@app.route("/")
def home():
    return render_template("home.html")

@app.route("/cadastro", methods=['GET', 'POST'])
def cadastro():
    if request.method == "POST":
        nome_brecho = (request.form.get("nome_brecho"))
        usuario = (request.form.get("usuario"))
        senha = (request.form.get("senha"))

        if nome_brecho and usuario and senha:
            u = Usuario(nome_brecho, usuario, senha)
            db.session.add(u)

            try:
                db.session.commit()
                flash('Cadastro realizado com sucesso', 'success')
                return redirect(url_for('login'))
            except Exception as e:
                db.session.rollback()
                flash('Erro ao cadastrar brechó', 'error')
                print(f'Erro durante o cadastro: {str(e)}')

    return render_template("cadastro.html")