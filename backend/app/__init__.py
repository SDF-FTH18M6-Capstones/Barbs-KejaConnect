import os
from flask import Flask


def create_app():
    app = Flask(__name__)

    # load config
    config = os.getenv("APP_SETTINGS", "config.flaskconfig.Development")
    app.config.from_object(config)

    @app.route("/health")
    def health_check():
        return {"message": "The website is live"}, 200

    return app
