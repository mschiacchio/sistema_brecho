from app import app, db
from sqlalchemy import inspect

if __name__ == "__main__":
    with app.app_context():
        inspector = inspect(db.engine)
        if not inspector.has_table("usuarios"):
            db.create_all()
        if not inspector.has_table("clientes"):
            db.create_all()
        if not inspector.has_table("produtos"):
            db.create_all()
        if not inspector.has_table("fornecedores"):
            db.create_all()
        if not inspector.has_table("compras"):
            db.create_all()
        if not inspector.has_table("vendas"):
            db.create_all()
    
    app.run(debug=True)