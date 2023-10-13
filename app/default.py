from flask import Flask, render_template, redirect, request, url_for, flash, session, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from datetime import datetime
from . import app, db, login_manager
from .models.tables import Usuario, Cliente, Produto, Fornecedor, Compra, Venda

@login_manager.unauthorized_handler
def unauthorized():
    flash('Faça login para acessar esta página.', 'error')
    return redirect(url_for('login'))

@login_manager.user_loader
def load_user(id_usuario):
    return Usuario.query.get(int(id_usuario))

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
        if nome_brecho and email and usuario and pwd:
            if usuario_ja_existente(email, usuario):
                flash('Email ou nome de usuário já existente. Por favor, insira outros dados.', 'error')
                print('Email ou nome de usuário já existente. Por favor, insira outros dados.')
            else:
                u = Usuario(nome_brecho, email, usuario, pwd)
                db.session.add(u)
                try:
                    db.session.commit()
                    flash('Cadastro realizado com sucesso!', 'sucesso')
                    print('Cadastro realizado com sucesso!', 'sucesso')
                    return redirect(url_for('login'))
                except Exception as e:
                    print(f'Erro durante o cadastro', e)
                    db.session.rollback()
                    flash('Erro ao cadastrar usuário', 'error')
    return render_template("signup.html")

@login_required
@app.route("/compras", methods=['GET', 'POST'])
def compras():
    compras = Compra.query.filter_by(id_usuario=current_user.id).all()
    return render_template('compras.html', compras=compras)

@login_required
@app.route("/comprascadastro", methods=['GET', 'POST'])
def compras_cadastro():
    session.pop('success', None)
    session.pop('error', None)    

    if request.method == 'POST':
        id_fornecedor = request.form.get('id_fornecedor')
        qtd_pecas = request.form.get('qtd_pecas')
        lote = request.form.get('lote')
        val_total_pg_str = request.form.get('val_total_pg')
        val_total_pg_str = val_total_pg_str.replace('R$', '')
        val_total_pg_str = val_total_pg_str.replace(',', '.')
        dta_compra = datetime.strptime(request.form.get('dta_compra'), '%Y-%m-%d').date()

        try:
            val_total_pg = float(val_total_pg_str)
        except ValueError:
            # Trate erros de conversão, se necessário
            val_total_pg = None


        if id_fornecedor and qtd_pecas and val_total_pg and lote and dta_compra:
            compras = Compra(id_fornecedor, qtd_pecas, lote, val_total_pg, dta_compra)
            db.session.add(compras)
            compras.id_usuario = current_user.id
            try:
                db.session.commit()
                flash('Cadastro da compra realizado com sucesso!', 'success')
            except Exception as e:
                print(f'Erro durante o cadastro', e)
                db.session.rollback()
                flash('Erro ao cadastrar as compras', 'error')
        
    return render_template("comprascadastro.html")

@app.route("/excluircompras/<int:id>", methods=['GET'])
@login_required
def excluir_compras(id):
    compras = Compra.query.filter_by(id=id, id_usuario=current_user.id).first()

    if compras is None:
        return jsonify({"error": "Compra não encontrada"}), 404

    db.session.delete(compras)

    try:
        db.session.commit()
        flash('Compra excluída com sucesso!', 'success')
        return redirect(url_for("compras"))
    except Exception as e:
        db.session.rollback()
        flash('Erro ao excluir compra', 'error')
        print(f'Erro durante a exclusão da compra: {str(e)}')

    return render_template('compras.html')

@app.route("/editarcompras/<int:id>", methods=['GET', 'POST'])
def editar_compras(id):
    compras = Compra.query.filter_by(id=id, id_usuario=current_user.id).first()

    if compras is None:
        return jsonify({"error": "Compra não encontrada"}), 404
    
    if request.method == "POST":
        id_fornecedor = request.form.get('id_fornecedor')
        qtd_pecas = request.form.get('qtd_pecas')
        lote = request.form.get('lote')
        val_total_pg_str = request.form.get('val_total_pg')
        val_total_pg_str = val_total_pg_str.replace('R$', '')
        val_total_pg_str = val_total_pg_str.replace(',', '.')
        dta_compra = datetime.strptime(request.form.get('dta_compra'), '%Y-%m-%d').date()

        try:
            val_total_pg = float(val_total_pg_str)
        except ValueError:
            val_total_pg = None

        if id_fornecedor and qtd_pecas and val_total_pg and lote and dta_compra:
            compras.id_fornecedor = id_fornecedor
            compras.qtd_pecas = qtd_pecas
            compras.val_total_pg = val_total_pg
            compras.lote = lote
            compras.dta_compra = dta_compra

            db.session.commit()
            return redirect(url_for("compras"))
        
    return render_template("editarcompras.html", compras=compras) 
   
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