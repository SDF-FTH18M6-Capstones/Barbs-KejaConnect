import os
from flask import Flask
from flask_migrate import Migrate
from app.blueprints import v1
from .config import db, bcrypt
from .models import *
from .schemas import *


def create_app():
    app = Flask(__name__)

    # load config
    config = os.getenv("APP_SETTINGS", "config.flaskconfig.Development")
    app.config.from_object(config)

    migrate = Migrate(app, db)
    db.init_app(app)
    bcrypt.init_app(app)

    app.register_blueprint(v1, url_prefix="/api/v1")

    return app
