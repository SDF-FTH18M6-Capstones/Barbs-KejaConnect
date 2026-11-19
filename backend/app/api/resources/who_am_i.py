from flask_restful import Resource
from flask import make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from ...models import User
from ...schemas import UserSchema
from ...services import AuthService


class WhoAmI(Resource):
    def __init__(self, auth_service: AuthService):
        self.auth_service = auth_service

    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()

        if user_id:
            # replace with service call
            user = self.auth_service.get_user(user_id)
            return make_response({"user": UserSchema().dump(user)}, 200)

        return make_response({"errors": ["UNAUTHENTICATED"]}, 401)
