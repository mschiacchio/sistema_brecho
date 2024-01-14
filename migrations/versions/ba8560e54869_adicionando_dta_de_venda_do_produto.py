"""Adicionando dta de venda do produto

Revision ID: ba8560e54869
Revises: 04ca2f5aecc3
Create Date: 2024-01-13 22:21:40.185831

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ba8560e54869'
down_revision = '04ca2f5aecc3'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('produtos', schema=None) as batch_op:
        batch_op.add_column(sa.Column('dta_venda_produto', sa.Date(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('produtos', schema=None) as batch_op:
        batch_op.drop_column('dta_venda_produto')

    # ### end Alembic commands ###