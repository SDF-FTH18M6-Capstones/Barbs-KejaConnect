from datetime import datetime, timedelta, timezone

import pytest

from app.config import db
from app.models import EmailVerificationToken
from tests.helpers import create_user, login, verify_path

VERIFIED = (200, 302)  

def test_emailed_token_verifies_the_user(client, urls, mailbox):
    payload = create_user(client, urls)
    res = client.get(verify_path(urls, mailbox.last_token()))
    assert res.status_code in VERIFIED
    assert login(client, urls, payload).status_code == 200

def test_token_can_only_be_used_once(client, urls, mailbox):
    create_user(client, urls)
    path = verify_path(urls, mailbox.last_token())
    assert client.get(path).status_code in VERIFIED
    assert client.get(path).status_code in (400, 401)

def test_verification_redirect_does_not_put_the_access_token_in_the_url(client, urls, mailbox):
    create_user(client, urls)
    res = client.get(verify_path(urls, mailbox.last_token()))
    if res.status_code == 302:
        assert "eyJ" not in res.headers["Location"]

def test_tampered_token_is_rejected(client, urls, mailbox):
    create_user(client, urls)
    token_id = mailbox.last_token().rsplit(".", 1)[1]
    res = client.get(verify_path(urls, f"not-the-real-token.{token_id}"))
    assert res.status_code in (400, 401)

def test_unknown_token_id_is_rejected(client, urls):
    res = client.get(verify_path(urls, "whatever.9999"))
    assert res.status_code in (400, 401)

def test_expired_token_is_rejected(client, urls, mailbox):
    payload = create_user(client, urls)
    token = EmailVerificationToken.query.first()
    token.expires_at = datetime.now(timezone.utc) - timedelta(hours=1)
    db.session.commit()

    res = client.get(verify_path(urls, mailbox.last_token()))
    assert res.status_code in (400, 401)
    assert login(client, urls, payload).status_code == 403

@pytest.mark.xfail(strict=True, reason="contract: a malformed token (no '.<id>') must be 400 INVALID_TOKEN; today rsplit raises ValueError")
def test_malformed_token_is_400(client, urls):
    res = client.get(verify_path(urls, "garbage"))
    assert res.status_code == 400

@pytest.mark.xfail(strict=True, reason="contract: bad tokens must be 400 INVALID_TOKEN (today 401 with no `code`)")
def test_bad_token_code_is_invalid_token(client, urls):
    res = client.get(verify_path(urls, "whatever.9999"))
    assert res.status_code == 400
    assert res.get_json()["code"] == "INVALID_TOKEN"

@pytest.mark.xfail(strict=True, reason="contract: POST /auth/verify-email with {token} in the body (today GET with the token in the path)")
def test_verify_accepts_post_with_token_in_body(client, urls, mailbox):
    create_user(client, urls)
    res = client.post("/api/v1/auth/verify-email", json={"token": mailbox.last_token()})
    assert res.status_code == 200