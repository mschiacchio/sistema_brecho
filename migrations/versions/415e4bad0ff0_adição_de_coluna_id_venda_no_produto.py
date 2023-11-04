"""Adição de coluna 'id_venda' no produto

Revision ID: 415e4bad0ff0
Revises: 55e76f869262
Create Date: 2023-11-03 20:45:37.353560

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '415e4bad0ff0'
down_revision = '55e76f869262'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('produtos', schema=None) as batch_op:
        batch_op.add_column(sa.Column('id_venda', sa.Integer(), nullable=True))
        batch_op.create_foreign_key('fk_vendas_id_venda', 'vendas', ['id_venda'], ['id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('produtos', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_column('id_venda')

    # ### end Alembic commands ###
