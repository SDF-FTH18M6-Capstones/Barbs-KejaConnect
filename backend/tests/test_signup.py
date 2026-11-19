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
    res = client.post(urls.signup, json={})
    assert res.status_code == 400

@pytest.mark.xfail(strict=True, reason="contract: duplicate email must return code EMAIL_TAKEN (handlers send no `code`)")
def test_signup_duplicate_email_code_is_email_taken(client, urls):
    first = signup_payload()
    client.post(urls.signup, json=first)
    res = client.post(urls.signup, json=signup_payload(email=first["email"]))
    assert res.get_json()["code"] == "EMAIL_TAKEN"

@pytest.mark.xfail(strict=True, reason="contract: missing fields must be 400 VALIDATION_ERROR (currently 401 Invalid credentials)")
def test_signup_missing_fields_is_a_validation_error(client, urls):
    res = client.post(urls.signup, json={"email": "only@example.com"})
    assert res.status_code == 400
    assert res.get_json()["code"] == "VALIDATION_ERROR"

@pytest.mark.xfail(strict=True, reason="contract: password needs 8+ chars with a letter and a number (no validation today)")
def test_signup_rejects_weak_password(client, urls):
    res = client.post(urls.signup, json=signup_payload(password="short"))
    assert res.status_code == 400

@pytest.mark.xfail(strict=False, reason="contract: phone must be 07XXXXXXXX or +2547XXXXXXXX (UserSchema not reviewed yet)")
def test_signup_rejects_invalid_phone(client, urls):
    res = client.post(urls.signup, json=signup_payload(phone="123"))
    assert res.status_code == 400

@pytest.mark.xfail(strict=True, reason="SECURITY, contract: registering as admin must be rejected with 400")
def test_signup_cannot_register_as_admin(client, urls):
    res = client.post(urls.signup, json=signup_payload(role="admin"))
    assert res.status_code == 400

@pytest.mark.xfail(strict=True, reason="AuthService.signup lowercases full_name, so 'Wanjiku Mwangi' is stored as 'wanjiku mwangi'")
def test_signup_keeps_full_name_as_entered(client, urls):
    res = client.post(urls.signup, json=signup_payload(full_name="Wanjiku Mwangi"))
    assert res.get_json()["user"]["full_name"] == "Wanjiku Mwangi"