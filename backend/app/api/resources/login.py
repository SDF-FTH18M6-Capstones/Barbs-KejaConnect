from flask_restful import Resource
from flask import make_response, request
from flask_jwt_extended import create_access_token
from ...models import User
from ...schemas import UserSchema


class LoginResource(Resource):
    def post(self):
        data = request.get_json(silent=True)

        if not isinstance(data, dict) or not data:
            return make_response({"errors": "Invalid request object."}, 400)

        email = data.get("email", "")
        password = data.get("password", "")

        if not email and not password:
            return make_response({"errors": ["INVALID_CREDENTIALS"]}, 401)

        user: User = User.query.filter_by(email=email).first()

        if not user:
            return make_response(
                {"errors": ["INVALID_CREDENTIALS", "USER_NOT_FOUND"]}, 401
            )

        authenticated = user.authenticate(password=password)

        if authenticated:
            if not user.email_verified:
                return make_response({"errors": ["EMAIL_NOT_VERIFIED"]}, 403)

            token = create_access_token(identity=str(user.id))
            res_user = UserSchema().dump(user)
            return make_response({"token": token, "user": res_user}, 200)

        return make_response({"errors": ["INVALID_CREDENTIALS"]}, 401)
