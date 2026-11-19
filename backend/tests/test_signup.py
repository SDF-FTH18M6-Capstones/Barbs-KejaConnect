import pytest

from tests.helpers import signup_payload

def test_signup_creates_user(client, urls):
    payload = signup_payload()
    res = client.post(urls.signup, json=payload)
    assert res.status_code == 201
    user = res.get_json()["user"]
    assert user["email"] == payload["email"]
    assert user["role"] == "tenant"

def test_signup_never_returns_the_password(client, urls):
    res = client.post(urls.signup, json=signup_payload())
    user = res.get_json()["user"]
    assert not any("password" in key for key in user)

def test_signup_sends_one_verification_email(client, urls, mailbox):
    payload = signup_payload()
    client.post(urls.signup, json=payload)
    assert len(mailbox.sent) == 1
    recipient = mailbox.sent[0].get()["personalizations"][0]["to"][0]["email"]
    assert recipient == payload["email"]

def test_signup_stores_email_in_lowercase(client, urls):
    res = client.post(urls.signup, json=signup_payload(email="Mixed.Case@Example.com"))
    assert res.get_json()["user"]["email"] == "mixed.case@example.com"

def test_signup_duplicate_email_returns_409(client, urls):
    first = signup_payload()
    client.post(urls.signup, json=first)
    second = signup_payload(email=first["email"])  # new phone, same email
    res = client.post(urls.signup, json=second)
    assert res.status_code == 409

def test_signup_empty_body_returns_400(client, urls):
    res =