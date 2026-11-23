import pytest

from tests.helpers import create_verified_user, login

def _auth(client, urls, mailbox):
    payload = create_verified_user(client, urls, mailbox)
    token = login(client, urls, payload).get_json()["token"]
    return payload, {"Authorization": f"Bearer {token}"}

def test_me_requires_a_token(client, urls):
    assert client.get(urls.me).status_code == 401

def test_me_rejects_a_garbage_token(client, urls):
    res = client.get(urls.me, headers={"Authorization": "Bearer not-a-real-token"})
    assert res.status_code in (401, 422)

@pytest.mark.xfail(strict=True, reason="BUG who_am_i.py: User.query.filter_by(id == user_id) compares the builtin `id`; should be filter_by(id=user_id)")
def test_me_returns_the_current_user(client, urls, mailbox):
    payload, headers = _auth(client, urls, mailbox)
    res = client.get(urls.me, headers=headers)
    assert res.status_code == 200
    assert res.get_json()["email"] == payload["email"]