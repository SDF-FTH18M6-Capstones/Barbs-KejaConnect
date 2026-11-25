import pytest
from flask_jwt_extended import decode_token

from tests.helpers import create_user, create_verified_user, login


def test_login_succeeds_for_verified_user(client, urls, mailbox):
    payload = create_verified_user(client, urls, mailbox)
    res = login(client, urls, payload)
    assert res.status_code == 200
    assert res.get_json()["user"]["email"] == payload["email"]


def test_login_never_returns_the_password(client, urls, mailbox):
    payload = create_verified_user(client, urls, mailbox)
    user = login(client, urls, payload).get_json()["user"]
    assert not any("password" in key for key in user)


def test_login_email_is_case_insensitive(client, urls, mailbox):
    payload = create_verified_user(client, urls, mailbox, email="case@example.com")
    res = client.post(
        urls.login, json={"email": "CASE@Example.com", "password": payload["password"]}
    )
    assert res.status_code == 200


def test_wrong_password_returns_401(client, urls, mailbox):
    payload = create_verified_user(client, urls, mailbox)
    res = client.post(urls.login, json={"email": payload["email"], "password": "WrongPass1"})
    assert res.status_code == 401


def test_unknown_email_looks_the_same_as_wrong_password(client, urls, mailbox):
    payload = create_verified_user(client, urls, mailbox)
    wrong_pw = client.post(urls.login, json={"email": payload["email"], "password": "WrongPass1"})
    no_user = client.post(urls.login, json={"email": "nobody@example.com", "password": "WrongPass1"})
    assert wrong_pw.status_code == no_user.status_code == 401
    assert wrong_pw.get_json()["message"] == no_user.get_json()["message"]


def test_unverified_email_returns_403(client, urls):
    payload = create_user(client, urls)
    assert login(client, urls, payload).status_code == 403


def test_empty_body_returns_400(client, urls):
    assert client.post(urls.login, json={}).status_code == 400


def test_token_carries_the_user_role(client, urls, mailbox):
    payload = create_verified_user(client, urls, mailbox, role="manager")
    token = login(client, urls, payload).get_json()["token"]
    assert decode_token(token)["role"] == "manager"


def test_access_token_lasts_24_hours(client, urls, mailbox):
    payload = create_verified_user(client, urls, mailbox)
    token = login(client, urls, payload).get_json()["token"]
    claims = decode_token(token)
    assert claims["exp"] - claims["iat"] == 24 * 60 * 60


@pytest.mark.xfail(strict=True, reason="contract: login returns `access_token` (code returns `token`)")
def test_login_returns_access_token_key(client, urls, mailbox):
    payload = create_verified_user(client, urls, mailbox)
    assert "access_token" in login(client, urls, payload).get_json()


@pytest.mark.xfail(strict=True, reason="contract: wrong password must return code INVALID_CREDENTIALS (handlers send no `code`)")
def test_wrong_password_code(client, urls, mailbox):
    payload = create_verified_user(client, urls, mailbox)
    res = client.post(urls.login, json={"email": payload["email"], "password": "WrongPass1"})
    assert res.get_json()["code"] == "INVALID_CREDENTIALS"


@pytest.mark.xfail(strict=True, reason="contract: unverified login must return code EMAIL_NOT_VERIFIED (handlers send no `code`)")
def test_unverified_code(client, urls):
    payload = create_user(client, urls)
    assert login(client, urls, payload).get_json()["code"] == "EMAIL_NOT_VERIFIED"


@pytest.mark.xfail(strict=False, reason="contract: user has `is_email_verified` (schema not reviewed yet)")
def test_login_user_has_contract_fields(client, urls, mailbox):
    payload = create_verified_user(client, urls, mailbox)
    user = login(client, urls, payload).get_json()["user"]
    for field in ("id", "full_name", "email", "phone", "role", "is_email_verified", "approval_status", "created_at"):
        assert field in user, f"missing {field}"