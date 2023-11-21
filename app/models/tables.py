from app import db, login_manager
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

class Usuario(db.Model, UserMixin):
    __tablename__ = "usuarios"

    def get_id(self):
        return str(self.id)

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome_brecho = db.Column(db.String(100))
    email = db.Column(db.String(84), unique=True)
    usuario = db.Column(db.String(80), unique=True)
    senha = db.Column(db.String(128))

    clientes = db.relationship("Cliente", backref="usuario")
    produtos = db.relationship("Produto", backref="usuario")
    fornecedores = db.relationship("Fornecedor", backref="usuario")
    compras = db.relationship("Compra", backref="usuario")
    vendas = db.relationship("Venda", backref="usuario")


    def __init__(self, nome_brecho, email, usuario, senha):
        self.nome_brecho = nome_brecho
        self.email = email
        self.usuario = usuario
        self.senha = generate_password_hash(senha)

    def verify_password(self, pwd):
        return check_password_hash(self.senha, pwd)

    def __repr__(self):
        return "<Usuario %r>" % self.usuario
    
class Cliente(db.Model):
    __tablename__ = "clientes"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome = db.Column(db.String(80))
    apelido = db.Column(db.String(80))
    celular = db.Column(db.Integer)
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuarios.id'))

    vendas = db.relationship("Venda", backref="cliente")


    def __init__(self, nome, apelido, celular):
        self.nome = nome
        self.apelido = apelido
        self.celular = celular

    def __repr__(self):
        return "<Cliente %r>" % self.nome
    
produtos_vendas = db.Table('produtos_vendas',
    db.Column('id_produto', db.Integer, db.ForeignKey('produtos.id')),
    db.Column('id_venda', db.Integer, db.ForeignKey('vendas.id'))
)
class Produto(db.Model):
    __tablename__ = "produtos"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    descricao = db.Column(db.String(120))
    categoria = db.Column(db.String(80))
    sub_categoria = db.Column(db.String(80))
    tamanho = db.Column(db.String(30))
    cor = db.Column(db.String(30))
    medidas = db.Column(db.Integer)
    marca = db.Column(db.String(80))
    preco_custo = db.Column(db.Integer)
    preco_venda = db.Column(db.Integer)
    foto = db.Column(db.LargeBinary)
    vendido = db.Column(db.Boolean, default=False)
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuarios.id'))

    vendas = db.relationship('Venda', secondary=produtos_vendas, back_populates='produtos')

    def __init__(self, descricao, categoria, sub_categoria, tamanho, cor, medidas, marca, preco_custo, preco_venda, foto):
        self.descricao = descricao
        self.categoria = categoria
        self.sub_categoria = sub_categoria
        self.tamanho = tamanho
        self.cor = cor
        self.medidas = medidas
        self.marca = marca
        self.preco_custo = preco_custo
        self.preco_venda = preco_venda
        self.foto = foto

    def __repr__(self):
        return "<Produto %r>" % self.id

class Fornecedor(db.Model):
    __tablename__ = "fornecedores"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome = db.Column(db.String(80))
    celular = db.Column(db.Integer)
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuarios.id'))


    def __init__(self, nome, celular):
        self.nome = nome
        self.celular = celular

    def __repr__(self):
        return "<Fornecedor %r>" % self.id

class Compra(db.Model):
    __tablename__ = "compras"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_fornecedor = db.Column(db.Integer, db.ForeignKey('fornecedores.id'))
    qtd_pecas = db.Column(db.Integer)
    lote = db.Column(db.String(3))
    val_total_pg = db.Column(db.Float)
    dta_compra = db.Column(db.Date)
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuarios.id'))

    fornecedor = db.relationship('Fornecedor', foreign_keys=id_fornecedor)

    def __init__(self, id_fornecedor, qtd_pecas, lote, val_total_pg, dta_compra):
        self.id_fornecedor = id_fornecedor
        self.qtd_pecas = qtd_pecas
        self.lote = lote
        self.val_total_pg = val_total_pg
        self.dta_compra = dta_compra

    def __repr__(self):
        return "<Compra %r>" % self.id

class Venda(db.Model):
    __tablename__ = "vendas"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    desconto = db.Column(db.Integer) 
    val_total = db.Column(db.Float)
    forma_pagamento = db.Column(db.String(50))
    tipo_venda = db.Column(db.String(10))
    dta_venda = db.Column(db.Date) 
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuarios.id'))
    nome_cliente = db.Column(db.String, db.ForeignKey('clientes.nome'))

    produtos = db.relationship('Produto', secondary=produtos_vendas, back_populates='vendas')

    def __init__(self, desconto, val_total, forma_pagamento, tipo_venda, dta_venda, nome_cliente):
        self.desconto = desconto
        self.val_total = val_total
        self.forma_pagamento = forma_pagamento
        self.tipo_venda = tipo_venda
        self.dta_venda = dta_venda
        self.nome_cliente = nome_cliente

    def __repr__(self):
        return "<Venda %r>" % self.id
