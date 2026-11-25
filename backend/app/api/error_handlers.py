from flask import jsonify, make_response
from marshmallow import ValidationError
from app.exceptions import (
    EmailNotVerified,
    UserNotFoundError,
    InvalidCredentialsError,
    AlreadyExists,
    DatabasePersistenceError,
    ResourceNotFoundError,
    EmailVerificationNotSentError,
    FileUploadFailed,
    NotAllowedError,
)


def register_error_handlers(app):
    @app.errorhandler(InvalidCredentialsError)
    def handle_invalid_credentials(error):
        return make_response(
            {"error": "Invalid credentials", "message": str(error)}, 401
        )

    @app.errorhandler(UserNotFoundError)
    def handle_user_not_found(error):
        return make_response({"error": "User not found", "message": str(error)}, 401)

    @app.errorhandler(ResourceNotFoundError)
    def handle_resource_not_found(error):
        return make_response(
            {"error": "Resource not found", "message": str(error)}, 404
        )

    @app.errorhandler(EmailNotVerified)
    def handle_email_not_verified(error):
        return make_response(
            {"error": "Email not verified", "message": str(error)}, 403
        )

    @app.errorhandler(EmailVerificationNotSentError)
    def handle_email_verification_not_sent(error):
        return make_response(
            {"error": "Email not verified", "message": str(error)}, 403
        )

    @app.errorhandler(AlreadyExists)
    def handle_already_exists(error):
        return make_response({"error": "DUPLICATE_ERROR", "message": str(error)}, 409)

    @app.errorhandler(DatabasePersistenceError)
    def handle_persistence_error(error):
        return make_response({"error": "Peristence Error", "message": str(error)}, 500)

    @app.errorhandler(FileUploadFailed)
    def handle_file_upload_failed(error):
        return make_response({"error": "Upload Error", "message": str(error)}, 502)

    @app.errorhandler(NotAllowedError)
    def handle_not_allowed(error):
        return make_response({"error": "Permission Error", "message": str(error)}, 403)

    @app.errorhandler(ValidationError)
    def handle_validation_error(error):
        return make_response(
            {
                "error": "Validation error",
                "code": "VALIDATION_ERROR",
                "details": error.messages,
            },
            400,
        )