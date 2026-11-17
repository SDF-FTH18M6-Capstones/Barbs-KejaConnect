from flask_restful import Resource
from flask import make_response, request
from flask_jwt_extended import create_access_token
from ...models import User
from ...schemas import UserSchema
from ...config import db
from ...services import AuthService


class SignupResource(Resource):
    def __init__(self, auth_service: AuthService):
        self.auth_service = auth_service

    def post(self):
        # move this to service
        data = request.get_json(silent=True)

        if not isinstance(data, dict) and not data:
            return make_response(
                {"error": "Bad request", "message": "Invalid request object."}, 400
            )

        full_name = data.get("full_name", "")
        email = data.get("email", "")
        phone = data.get("phone", "")
        role = data.get("role", "")
        password = data.get("password", "")

        user = self.auth_service.signup(
            full_name=full_name, email=email, phone=phone, role=role, password=password
        )
        res_user = UserSchema().dump(user)
        return make_response({"message": "USER_CREATED", "user": res_user}, 201)
