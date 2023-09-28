from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
#from flask_login import LoginManager

app = Flask(__name__)
app.config.from_object('config')

#login_manager = LoginManager(app)

db = SQLAlchemy(app)
migrate = Migrate(app, db)

from app.controllers import default