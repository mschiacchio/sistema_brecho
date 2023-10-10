from flask import Flask, render_template, redirect, request, url_for, flash
from flask_login import login_user, logout_user, login_required
from . import app, db, login_manager
from .models.tables import Usuario, Cliente, Produto, Fornecedor, Compra, Venda

@login_manager.unauthorized_handler
def unauthorized():
    flash('Faça login para acessar esta página.', 'error')
    return redirect(url_for('login'))

@login_manager.user_loader
def load_user(user_id):
    return Usuario.query.get(int(user_id))

@app.route("/home")
@login_required
def home():
    return render_template("home.html")

@app.route("/")
@app.route("/login", methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        usuario = Usuario.query.filter_by(usuario=request.form['usuario']).first()
        if usuario and usuario.verify_password(request.form['senha']):
            login_user(usuario)
            return redirect(url_for('home'))
        else:
            flash('Usuário ou senha incorretos. Tente novamente.', 'error')
    return render_template("login.html")

@login_required
@app.route("/logout", methods=['POST'])
def logout():
    logout_user()
    return redirect(url_for('login'))

def usuario_ja_existente(email, usuario):
    # Verifique se já existe um usuário com o mesmo email ou nome de usuário
    usuario_existente = Usuario.query.filter(
        (Usuario.email == email) | (Usuario.usuario == usuario)).first()

    return usuario_existente is not None

@app.route("/cadastro", methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        nome_brecho = request.form.get("nome_brecho")
        email = request.form.get("email")
        usuario = request.form.get("usuario")
        pwd = request.form.get("senha")
        print('Teste')
        if nome_brecho and email and usuario and pwd:
            print('Entrou no 1º if')
            if usuario_ja_existente(email, usuario):
                flash('Email ou nome de usuário já existente. Por favor, insira outros dados.', 'error')
                print('Email ou nome de usuário já existente. Por favor, insira outros dados.')
            else:
                u = Usuario(nome_brecho, email, usuario, pwd)
                print("nome_brecho:", nome_brecho)
                print("email:", email)
                print("usuario:", usuario)
                print("pwd:", pwd)

                db.session.add(u)
                try:
                    db.session.commit()
                    flash('Cadastro realizado com sucesso!', 'sucesso')
                    print('Cadastro realizado com sucesso!', 'sucesso')
                    return redirect(url_for('login'))
                except Exception as e:
                    print(f'Erro durante o cadastro', e)
                    db.session.rollback()
                    flash('Erro ao cadastrar cliente', 'error')
    return render_template("signup.html")

@login_required
@app.route("/compras", methods=['GET', 'POST'])
def compras():
    return render_template("compras.html")

@login_required
@app.route("/vendas", methods=['GET', 'POST'])
def vendas():
    return render_template("vendas.html")

@login_required
@app.route("/produtos", methods=['GET', 'POST'])
def produtos():
    return render_template("produtos.html")

@login_required
@app.route("/fornecedores", methods=['GET', 'POST'])
def fornecedores():
    return render_template("fornecedores.html")

@login_required
@app.route("/clientes", methods=['GET', 'POST'])
def clientes():
    return render_template("clientes.html")