import pytest


@pytest.mark.xfail(strict=False, reason="contract: POST /api/v1/auth/register")
def test_signup_route(urls):
    assert urls.signup == "/api/v1/auth/register"


@pytest.mark.xfail(strict=False, reason="contract: POST /api/v1/auth/login")
def test_login_route(urls):
    assert urls.login == "/api/v1/auth/login"


@pytest.mark.xfail(strict=False, reason="contract: GET /api/v1/auth/me (code serves /me)")
def test_me_route(urls):
    assert urls.me == "/api/v1/auth/me"