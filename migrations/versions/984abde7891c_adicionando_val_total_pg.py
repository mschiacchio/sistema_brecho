"""Adicionando val_total_pg

Revision ID: 984abde7891c
Revises: 
Create Date: 2023-10-11 19:53:50.244409

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '984abde7891c'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('compras', schema=None) as batch_op:
        batch_op.add_column(sa.Column('val_total_pg', sa.Integer(), nullable=True))

    with op.batch_alter_table('fornecedores', schema=None) as batch_op:
        batch_op.add_column(sa.Column('nome', sa.String(length=80), nullable=True))

    with op.batch_alter_table('produtos', schema=None) as batch_op:
        batch_op.add_column(sa.Column('categoria', sa.String(length=80), nullable=True))
        batch_op.add_column(sa.Column('sub_categoria', sa.String(length=80), nullable=True))
        batch_op.add_column(sa.Column('descricao', sa.String(length=120), nullable=True))
        batch_op.add_column(sa.Column('tamanho', sa.String(length=30), nullable=True))
        batch_op.add_column(sa.Column('cor', sa.String(length=30), nullable=True))
        batch_op.add_column(sa.Column('medidas', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('marca', sa.String(length=80), nullable=True))
        batch_op.add_column(sa.Column('preco_custo', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('preco_venda', sa.Integer(), nullable=True))

    with op.batch_alter_table('vendas', schema=None) as batch_op:
        batch_op.add_column(sa.Column('forma_pagamento', sa.String(length=50), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('vendas', schema=None) as batch_op:
        batch_op.drop_column('forma_pagamento')

    with op.batch_alter_table('produtos', schema=None) as batch_op:
        batch_op.drop_column('preco_venda')
        batch_op.drop_column('preco_custo')
        batch_op.drop_column('marca')
        batch_op.drop_column('medidas')
        batch_op.drop_column('cor')
        batch_op.drop_column('tamanho')
        batch_op.drop_column('descricao')
        batch_op.drop_column('sub_categoria')
        batch_op.drop_column('categoria')

    with op.batch_alter_table('fornecedores', schema=None) as batch_op:
        batch_op.drop_column('nome')

    with op.batch_alter_table('compras', schema=None) as batch_op:
        batch_op.drop_column('val_total_pg')

    # ### end Alembic commands ###