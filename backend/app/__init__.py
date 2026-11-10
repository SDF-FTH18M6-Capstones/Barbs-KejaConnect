import os
from flask import Flask
from app.blueprints import v1


def create_app():
    app = Flask(__name__)

    # load config
    config = os.getenv("APP_SETTINGS", "config.flaskconfig.Development")
    app.config.from_object(config)

    app.register_blueprint(v1, url_prefix="/api/v1")

    return app
