from app import db

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(80), unique=True)
    password = db.Column(db.String(80))
    email = db.Column(db.String(120), unique=True)

    def __init__(self, username, password, email):
        self.username = username
        self.password = password
        self.email = email

    def __repr__(self):
        return "<User %r>" % self.username
    
class Cliente(db.Model):
    __tablename__ = "clientes"

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(80))
    apelido = db.Column(db.String(80))
    celular = db.Column(db.Integer(11))

    def __init__(self, nome, apelido, email, celular):
        self.nome = nome
        self.apelido = apelido
        self.celular = celular

    def __repr_(self):
        return "<Cliente %r>" % self.nome

class Produto(db.Model):
    __tablename__ = "produtos"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    categoria = db.column(db.String(80))
    sub_categoria = db.column(db.String(80))
    descricao = db.column(db.String(120))
    tamanho = db.column(db.String(30))
    cor = db.column(db.String(30))
    medidas = db.column(db.Integer)
    marca = db.column(db.String(80))
    foto = db.Column(db.LargeBinary)
    preco_custo = db.column(db.Integer)
    preco_venda = db.column(db.Integer)

    def __init__(self, categoria, sub_categoria, descricao, tamanho, cor, medidas, marca, foto, preco_custo, preco_venda):
        self.categoria = categoria
        self.sub_categoria = sub_categoria
        self.descricao = descricao
        self.cor = cor
        self.medidas = medidas
        self.marca = marca
        self.foto = foto
        self.preco_custo = preco_custo
        self.preco_venda = preco_venda

    def __repr_(self):
        return "<Produto %r>" % self.id

class Fornecedor(db.Model):
    __tablename__ = "fornecedores"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome = db.column(db.String(80))
    celular = db.Column(db.Integer(11))

    def __init__(self, nome, celular):
        self.nome = nome
        self.celular = celular

    def __repr_(self):
        return "<Fornecedor %r>" % self.id

class Compra(db.Model):
    __tablename__ = "compras"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_fornecedor = db.Column(db.Integer, db.ForeignKey('fornecedores.id'))
    qtd_pecas = db.Column(db.Integer)
    lote = db.Column(db.Boolean)
    val_total_pg = db.column(db.Integer)

    fornecedor = db.relationship('Fornecedor', foreign_keys=fornecedor_id)

    def __init__(self, id_fornecedor, qtd_pecas, lote, val_total_pg):
        self.id_fornecedor = id_fornecedor
        self.qtd_pecas = qtd_pecas
        self.lote = lote
        self.val_total_pg = val_total_pg

    def __repr_(self):
        return "<Compra %r>" % self.id

class Venda(db.Model):
    __tablename__ = "vendas"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_produto = db.Column(db.Integer, db.ForeignKey('produtos.id'))
    desconto = db.Column(db.Integer) 
    forma_pagamento = db.column(db.String(50))
    val_total = db.Column(db.Integer) 

    produto = db.relationship('Produto', foreign_keys=produto_id)

    def __init__(self, id_produto, desconto, forma_pagamento, val_total):
        self.id_produto = id_produto
        self.desconto = desconto
        self.forma_pagamento = forma_pagamento
        self.val_total = val_total

    def __repr_(self):
        return "<Venda %r>" % self.id
