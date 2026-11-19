import itertools
import re

_ids = itertools.count(1)

def signup_payload(**overrides):
    """A valid signup body with a unique email and phone each time."""
    n = next(_ids)
    payload = {
        "full_name": "Test User",
        "email": f"user{n}@example.com",
        "phone": f"07{n:08d}",
        "password": "Password123",
        "role": "tenant",
    }
    payload.update(overrides)
    return payload

def verify_path(urls, token):
    """Fill the <token> placeholder in the verify-email route."""
    return re.sub(r"<[^>]+>", token, urls.verify)

def create_user(client, urls, **overrides):
    payload = signup_payload(**overrides)
    res = client.post(urls.signup, json=payload)
    assert res.status_code == 201, res.get_json()
    return payload

def create_verified_user(client, urls, mailbox, **overrides):
    payload = create_user(client, urls, **overrides)
    res = client.get(verify_path(urls, mailbox.last_token()))
    assert res.status_code == 200, res.get_json()
    return payload

def login(client, urls, payload):
    return client.post(
        urls.login, json={"email": payload["email"], "password": payload["password"]}
    )