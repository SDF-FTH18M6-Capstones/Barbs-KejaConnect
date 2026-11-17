from flask_restful import Resource
from flask import make_response, request
from flask_jwt_extended import create_access_token
from ...models import User
from ...schemas import UserSchema
from ...config import db
from ...services import AuthService


class VerifyEmailResource(Resource):
    def __init__(self, auth_service: AuthService):
        self.auth_service = auth_service

    def get(self, token):
        if not token:
            return make_response(
                {"error": "Bad request", "message": "Invalid request object."}, 400
            )
        jwt_token, user = self.auth_service.verify_email(token=token)

        return make_response(
            {"message": "EMAIL_VERIFIED", "token": jwt_token, "user": user}, 200
        )
