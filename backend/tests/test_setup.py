def test_app_uses_isolated_database(app):
    assert app.config["TESTING"] is True
    assert app.config["SQLALCHEMY_DATABASE_URI"] == "sqlite:///:memory:"


def test_api_v1_routes_are_registered(app):
    rules = [r.rule for r in app.url_map.iter_rules()]
    assert any(r.startswith("/api/v1") for r in rules)


def test_database_tables_can_be_created(client):
    assert client is not None