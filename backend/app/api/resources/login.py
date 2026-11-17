from flask_restful import Resource
from flask import make_response, request
from flask_jwt_extended import create_access_token
from ...models import User
from ...schemas import UserSchema
from ...services import AuthService


class LoginResource(Resource):
    def __init__(self, auth_service: AuthService):
        self.auth_service = auth_service

    def post(self):
        data = request.get_json(silent=True)

        if not isinstance(data, dict) or not data:
            return make_response(
                {"error": "Bad requenst", "message": "Invalid request object."}, 400
            )

        token, user = self.auth_service.login(
            email=data.get("email", ""), password=data.get("password", "")
        )

        res_user = UserSchema().dump(user)

        return make_response({"token": token, "user": res_user}, 200)
