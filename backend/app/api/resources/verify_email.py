import os
from flask_restful import Resource
from flask import make_response, redirect
from flask_jwt_extended import create_access_token
from ...models import User
from ...schemas import UserSchema
from ...config import db
from ...services import AuthService

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")


class VerifyEmailResource(Resource):
    def __init__(self, auth_service: AuthService):
        self.auth_service = auth_service

    def get(self, token):
        if not token:
            return make_response(
                {"error": "Bad request", "message": "Invalid request object."}, 400
            )
        user: User = self.auth_service.verify_email(token=token)
        if user:
            return redirect(f"{FRONTEND_URL}/login")
