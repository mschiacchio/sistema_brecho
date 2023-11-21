"""Remoção de id_venda e id_produto

Revision ID: b2cd4c304a6f
Revises: dfe23d221219
Create Date: 2023-11-20 22:20:01.290308

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b2cd4c304a6f'
down_revision = 'dfe23d221219'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('produtos', schema=None) as batch_op:
        batch_op.drop_constraint('fk_vendas_id_venda', type_='foreignkey')
        batch_op.drop_column('id_venda')

    with op.batch_alter_table('vendas', schema=None) as batch_op:
        batch_op.drop_constraint('produtos.id', type_='foreignkey')
        batch_op.drop_column('id_produto')


    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('vendas', schema=None) as batch_op:
        batch_op.add_column(sa.Column('id_produto', sa.INTEGER(), nullable=True))
        batch_op.create_foreign_key(None, 'produtos', ['id_produto'], ['id'])

    with op.batch_alter_table('produtos', schema=None) as batch_op:
        batch_op.add_column(sa.Column('id_venda', sa.INTEGER(), nullable=True))
        batch_op.create_foreign_key('fk_vendas_id_venda', 'vendas', ['id_venda'], ['id'])

    # ### end Alembic commands ###
