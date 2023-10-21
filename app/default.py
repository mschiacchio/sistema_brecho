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

def fornecedor_existe(id_fornecedor):
    fornecedor = Fornecedor.query.get(id_fornecedor)
    return fornecedor is not None

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
            if fornecedor_existe(id_fornecedor):
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
            else:
                flash('ID do fornecedor não existe. Cadastre o fornecedor primeiro.', 'error')

    return render_template("comprascadastro.html")
@login_required
@app.route("/excluircompras/<int:id>", methods=['GET'])
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

@login_required
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
            if fornecedor_existe(id_fornecedor):
                compras.id_fornecedor = id_fornecedor
                compras.qtd_pecas = qtd_pecas
                compras.val_total_pg = val_total_pg
                compras.lote = lote
                compras.dta_compra = dta_compra
                try:
                    db.session.commit()
                    flash('Compra editada com sucesso!', 'success')
                    return redirect(url_for('compras'))
                except Exception as e:
                    print(f'Erro durante a edição', e)
                    db.session.rollback()
                    flash('Erro ao editar a compra', 'error')
            else:
                flash('ID do fornecedor não existe. Cadastre o fornecedor primeiro.', 'error')
        
    return render_template("editarcompras.html", compras=compras) 

@login_required
@app.route("/fornecedores", methods=['GET', 'POST'])
def fornecedores():
    fornecedores = Fornecedor.query.filter_by(id_usuario=current_user.id).all()
    return render_template("fornecedores.html", fornecedores=fornecedores)

@login_required
@app.route("/fornecedorescadastro", methods=['GET', 'POST'])
def fornecedores_cadastro():
    session.pop('success', None)
    session.pop('error', None)    

    if request.method == 'POST':
        nome = request.form.get('nome')
        celular = request.form.get('celular')

        if not celular:
            celular = ""

        if nome:
            fornecedores = Fornecedor(nome, celular)
            db.session.add(fornecedores)
            fornecedores.id_usuario = current_user.id
            try:
                db.session.commit()
                flash('Cadastro do fornecedor realizado com sucesso!', 'success')
            except Exception as e:
                print(f'Erro durante o cadastro', e)
                db.session.rollback()
                flash('Erro ao cadastrar o fornecedor', 'error')
        
    return render_template("fornecedorescadastro.html")

@login_required
@app.route("/excluirfornecedores/<int:id>", methods=['GET'])
def excluir_fornecedores(id):
    fornecedores = Fornecedor.query.filter_by(id=id, id_usuario=current_user.id).first()

    if fornecedores is None:
        return jsonify({"error": "Fornecedor não encontrado"}), 404

    db.session.delete(fornecedores)

    try:
        db.session.commit()
        flash('Fornecedor excluído com sucesso!', 'success')
        return redirect(url_for("fornecedores"))
    except Exception as e:
        db.session.rollback()
        flash('Erro ao excluir fornecedor', 'error')
        print(f'Erro durante a exclusão do fornecedor: {str(e)}')

    return render_template('fornecedores.html')

@login_required
@app.route("/editarfornecedores/<int:id>", methods=['GET', 'POST'])
def editar_fornecedores(id):
    fornecedores = Fornecedor.query.filter_by(id=id, id_usuario=current_user.id).first()

    if fornecedores is None:
        return jsonify({"error": "Fornecedor não encontrado"}), 404
    
    if request.method == "POST":
        nome = request.form.get('nome')
        celular = request.form.get('celular')
        
        if not celular:
            celular = ""

        if nome:
            fornecedores.nome = nome
            fornecedores.celular = celular

            db.session.commit()
            flash('Fornecedor editado com sucesso!', 'success')
            return redirect(url_for("fornecedores"))
        
    return render_template("editarfornecedores.html", fornecedores=fornecedores)

@login_required
@app.route("/vendas", methods=['GET', 'POST'])
def vendas():
    return render_template("vendas.html")

def produto_existe(id_produto):
    produto = Produto.query.get(id_produto)
    return produto is not None

@login_required
@app.route("/vendascadastro", methods=['GET', 'POST'])
def vendas_cadastro():
    session.pop('success', None)
    session.pop('error', None)    

    if request.method == 'POST':
        id_produto = request.form.get('id_produto')
        desconto = request.form.get('desconto')
        val_total_str = request.form.get('val_total')
        val_total_str = val_total_str.replace('R$', '')
        val_total_str = val_total_str.replace(',', '.')
        forma_pagamento = request.form.get('forma_pagamento')
        tipo_venda = request.form.get('tipo_venda')
        dta_venda = datetime.strptime(request.form.get('dta_venda'), '%Y-%m-%d').date()

        try:
            val_total = float(val_total_str)
        except ValueError:
            val_total = None

        if not desconto:
            desconto = ""

        if id_produto and val_total and forma_pagamento and tipo_venda and dta_venda:
            if produto_existe(id_produto):
                vendas = Venda(id_produto, desconto, val_total, forma_pagamento, tipo_venda, dta_venda)
                db.session.add(vendas)
                vendas.id_usuario = current_user.id
                try:
                    db.session.commit()
                    flash('Cadastro da venda realizado com sucesso!', 'success')
                except Exception as e:
                    print(f'Erro durante o cadastro', e)
                    db.session.rollback()
                    flash('Erro ao cadastrar as compras', 'error')
            else:
                flash('ID do produto não existe. Cadastre o produto primeiro.', 'error')

    return render_template("vendascadastro.html")

@login_required
@app.route("/produtos", methods=['GET', 'POST'])
def produtos():
    produtos = Produto.query.filter_by(id_usuario=current_user.id).all()
    return render_template("produtos.html", produtos=produtos)

@login_required
@app.route("/produtoscadastro", methods=['GET', 'POST'])
def produtos_cadastro():
    session.pop('success', None)
    session.pop('error', None)    

    if request.method == 'POST':
        descricao = request.form.get('descricao')
        categoria = request.form.get('categoria')
        sub_categoria = request.form.get('sub_categoria')
        tamanho = request.form.get('tamanho')
        cor = request.form.get('cor')
        medidas = request.form.get('medidas')
        marca = request.form.get('marca')
        preco_custo = request.form.get('preco_custo')
        preco_venda = request.form.get('preco_venda')
        foto = request.files.get('foto')
        if foto:
            foto_data = foto.read()
        else:
            foto_data = None


        if not sub_categoria and cor and medidas and marca and preco_custo and foto_data:
            sub_categoria = None
            cor = None
            medidas = None
            marca = None
            preco_custo = None
            foto_data = None


        if descricao and categoria and tamanho and preco_venda:
            produtos = Produto(descricao, categoria, sub_categoria, tamanho, cor, medidas, marca, preco_custo, preco_venda, foto)
            db.session.add(produtos)
            produtos.id_usuario = current_user.id
            try:
                db.session.commit()
                flash('Cadastro do produto realizado com sucesso!', 'success')
            except Exception as e:
                print(f'Erro durante o cadastro', e)
                db.session.rollback()
                flash('Erro ao cadastrar o produto', 'error')

    return render_template("produtoscadastro.html")

@login_required
@app.route("/excluirprodutos/<int:id>", methods=['GET'])
def excluir_produtos(id):
    produtos = Produto.query.filter_by(id=id, id_usuario=current_user.id).first()

    if produtos is None:
        return jsonify({"error": "Produto não encontrado"}), 404

    db.session.delete(produtos)

    try:
        db.session.commit()
        flash('Produto excluído com sucesso!', 'success')
        return redirect(url_for("produtos"))
    except Exception as e:
        db.session.rollback()
        flash('Erro ao excluir produto', 'error')
        print(f'Erro durante a exclusão do produto: {str(e)}')

    return render_template('produtos.html')

@login_required
@app.route("/clientes", methods=['GET', 'POST'])
def clientes():
    clientes = Cliente.query.filter_by(id_usuario=current_user.id).all()
    return render_template('clientes.html', clientes=clientes)

@login_required
@app.route("/clientescadastro", methods=['GET', 'POST'])
def clientes_cadastro():
    session.pop('success', None)
    session.pop('error', None)    

    if request.method == 'POST':
        nome = request.form.get('nome')
        apelido = request.form.get('apelido')
        celular = request.form.get('celular')

        if not apelido and celular:
            apelido = ""
            celular = ""

        if nome:
            clientes = Cliente(nome, apelido, celular)
            db.session.add(clientes)
            clientes.id_usuario = current_user.id
            try:
                db.session.commit()
                flash('Cadastro do cliente realizado com sucesso!', 'success')
            except Exception as e:
                print(f'Erro durante o cadastro', e)
                db.session.rollback()
                flash('Erro ao cadastrar o cliente', 'error')

    return render_template("clientescadastro.html")

@login_required
@app.route("/editarclientes/<int:id>", methods=['GET', 'POST'])
def editar_clientes(id):
    clientes = Cliente.query.filter_by(id=id, id_usuario=current_user.id).first()

    if clientes is None:
        return jsonify({"error": "Cliente não encontrado"}), 404
    
    if request.method == "POST":
        nome = request.form.get('nome')
        apelido = request.form.get('apelido')
        celular = request.form.get('celular')
        
        if not apelido and celular:
            apelido = ""
            celular = ""

        if nome:
            clientes.nome = nome
            clientes.apelido = apelido
            clientes.celular = celular

            db.session.commit()
            flash('Cliente editado com sucesso!', 'success')
            return redirect(url_for("clientes"))
        
    return render_template("editarclientes.html", clientes=clientes)

@login_required
@app.route("/excluirclientes/<int:id>", methods=['GET'])
def excluir_clientes(id):
    clientes = Cliente.query.filter_by(id=id, id_usuario=current_user.id).first()

    if clientes is None:
        return jsonify({"error": "Cliente não encontrado"}), 404

    db.session.delete(clientes)

    try:
        db.session.commit()
        flash('Cliente excluído com sucesso!', 'success')
        return redirect(url_for("clientes"))
    except Exception as e:
        db.session.rollback()
        flash('Erro ao excluir cliente', 'error')
        print(f'Erro durante a exclusão do cliente: {str(e)}')

    return render_template('clientes.html')