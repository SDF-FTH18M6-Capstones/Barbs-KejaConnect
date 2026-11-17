from flask import jsonify, make_response
from app.exceptions import EmailNotVerified, UserNotFoundError, InvalidCredentialsError


def register_error_handlers(app):
    @app.errorhandler(InvalidCredentialsError)
    def handle_invalid_credentials(error):
        return make_response(
            {"error": "Invalid credentials", "message": str(error)}, 401
        )

    @app.errorhandler(UserNotFoundError)
    def handle_user_not_found(error):
        return make_response({"error": "User not found", "message": str(error)}, 401)

    @app.errorhandler(EmailNotVerified)
    def handle_email_not_verified(error):
        return make_response(
            {"error": "Email not verified", "message": str(error)}, 403
        )
