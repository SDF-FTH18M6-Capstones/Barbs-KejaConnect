import os
import re
import socket
from types import SimpleNamespace

os.environ["APP_SETTINGS"] = "tests.settings.TestingConfig"

import pytest
from sendgrid import SendGridAPIClient

from app import create_app
from app.config import db


class FakeSendGrid:
    """Stands in for SendGrid: records emails, never touches the network."""

    def __init__(self):
        self.sent = []

    def send(self, message):
        self.sent.append(message)
        return SimpleNamespace(status_code=202)

    def last_html(self):
        assert self.sent, "No email was sent"
        return self.sent[-1].get()["content"][0]["value"]

    def last_token(self):
        """The raw verification token from the link in the last email ("<raw>.<id>")."""
        match = re.search(r"verify-email/([A-Za-z0-9_\-.]+)", self.last_html())
        assert match, "No verification link found in the email"
        return match.group(1).rstrip(".")


def _route(app, resource_name):
    """Find a URL by its Flask-RESTful resource class, so tests don't hardcode paths."""
    wanted = resource_name.lower()
    rules = [r for r in app.url_map.iter_rules() if r.endpoint.split(".")[-1] == wanted]
    assert rules, (
        f"No route found for {resource_name}. "
        f"Endpoints: {sorted(r.endpoint for r in app.url_map.iter_rules())}"
    )
    return rules[0].rule


@pytest.fixture(autouse=True)
def block_network(monkeypatch):
    """No test may open a network connection. If one tries, it fails loudly."""

    def refuse(*args, **kwargs):
        raise RuntimeError("Network access is blocked in tests")

    monkeypatch.setattr(socket.socket, "connect", refuse)


@pytest.fixture(scope="session")
def app():
    app = create_app()
    assert app.config["SQLALCHEMY_DATABASE_URI"].startswith("sqlite"), (
        "Refusing to run tests against a non-SQLite database"
    )
    return app


@pytest.fixture(scope="session")
def urls(app):
    return SimpleNamespace(
        signup=_route(app, "SignupResource"),
        login=_route(app, "LoginResource"),
        verify=_route(app, "VerifyEmailResource"),  # contains a <token> placeholder
        me=_route(app, "WhoAmI"),
    )


@pytest.fixture()
def mailbox(monkeypatch):
    """Replaces SendGrid for the test, so no real email can ever be sent."""
    fake = FakeSendGrid()

    def fake_send(client_self, message):
        return fake.send(message)
    monkeypatch.setattr(SendGridAPIClient, "send", fake_send)
    monkeypatch.setattr("app.services.authService.FROM_EMAIL", "noreply@kejaconnect.test", raising=False)
    monkeypatch.setattr("app.services.authService.BACKEND_URL", "http://localhost:5000", raising=False)
    return fake


@pytest.fixture()
def client(app, mailbox):
    """A test client with a fresh, empty database. Depends on mailbox on purpose."""
    with app.app_context():
        db.create_all()
        yield app.test_client()
        db.session.remove()
        db.drop_all()