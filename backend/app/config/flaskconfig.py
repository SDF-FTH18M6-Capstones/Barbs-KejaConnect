import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    TESTING = False
    SECRET_KEY = os.getenv("SECRET_KEY", "default-key-if-none")
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class Development(Config):
    TESTING = True
    FLASK_ENV = "development"
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite://kejaconnect.db")


class Production(Config):
    TESTING = False
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")
