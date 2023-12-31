"""Trocando tipo val_total

Revision ID: b3b50f88201c
Revises: e1efb032972e
Create Date: 2023-10-18 20:27:42.875493

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b3b50f88201c'
down_revision = 'e1efb032972e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('vendas', schema=None) as batch_op:
        batch_op.alter_column('val_total',
               existing_type=sa.INTEGER(),
               type_=sa.Float(),
               existing_nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('vendas', schema=None) as batch_op:
        batch_op.alter_column('val_total',
               existing_type=sa.Float(),
               type_=sa.INTEGER(),
               existing_nullable=True)

    # ### end Alembic commands ###
