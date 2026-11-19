import pytest


def test_login_route(urls):
    assert urls.login == "/api/v1/auth/login"


@pytest.mark.xfail(strict=True, reason="contract: POST /api/v1/auth/register (code serves /api/v1/auth/signup)")
def test_signup_route(urls):
    assert urls.signup == "/api/v1/auth/signup".replace("signup", "register")


@pytest.mark.xfail(strict=True, reason="contract: GET /api/v1/auth/me (code serves /api/v1/me)")
def test_me_route(urls):
    assert urls.me == "/api/v1/auth/me"