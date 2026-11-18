import os

os.environ["APP_SETTINGS"] = "tests.settings.TestConfig"

import pytest

from app import create_app
from app.config import db


@pytest.fixture(scope="session")
def app():
    app = create_app()
    assert app.config["SQLALCHEMY_DATABASE_URI"].startswith("sqlite"), (
        "Refusing to run tests against a non-SQLite database"
    )
    return app


@pytest.fixture()
def client(app):
    """A test client with a fresh, empty database for every test."""
    with app.app_context():
        db.create_all()
        yield app.test_client()
        db.session.remove()
        db.drop_all()