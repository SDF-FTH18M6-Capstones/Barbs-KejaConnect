import os
from flask import Flask
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import cloudinary
from app.api import v1
from .config import db, bcrypt
from .models import *
from .schemas import *


def create_app():
    cloudinary.config(
        cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
        api_key=os.getenv("CLOUDINARY_API_KEY"),
        api_secret=os.getenv("CLOUDINARY_API_SECRET"),
        secure=True,
    )
    app = Flask(__name__)

    # load config
    config = os.getenv("APP_SETTINGS", "config.flaskconfig.Development")
    app.config.from_object(config)

    CORS(app=app)

    migrate = Migrate(app, db)
    db.init_app(app)
    bcrypt.init_app(app)
    JWTManager(app)

    app.register_blueprint(v1, url_prefix="/api/v1")

    return app
