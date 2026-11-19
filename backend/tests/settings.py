from app.config.flaskconfig import Config


class TestingConfig(Config):
    """Same settings as the real app, except the database and the secrets.

    Inheriting from Config means any setting the team adds later (JWT expiry,
    CORS, ...) is automatically tested too.
    """

    TESTING = True
    SECRET_KEY = "test-secret-key-long-enough-for-hs256-signing"
    JWT_SECRET_KEY = "test-jwt-secret-key-long-enough-for-hs256-signing"
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    BCRYPT_LOG_ROUNDS = 4  