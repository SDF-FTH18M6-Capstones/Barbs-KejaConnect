from flask_restful import Resource
from flask import make_response, request
from flask_jwt_extended import create_access_token
from ...models import User
from ...schemas import UserSchema
from ...config import db


class SignupResource(Resource):
    def post(self):
        # move this to service
        data = request.get_json(silent=True)

        if not isinstance(data, dict) and not data:
            return make_response({"errors": ["INVALID_REQUESTC_OBJECT"]}, 400)

        full_name = data.get("full_name", "")
        email = data.get("email", "")
        phone = data.get("phone", "")
        role = data.get("role", "")
        password = data.get("password", "")

        if not full_name or not email or not phone or not role or not password:
            return make_response({"errors": ["INVALID_CREDENTIALS"]}, 400)

        user_exist: User = User.query.filter_by(email=email).first()

        if user_exist:
            return make_response({"errors": ["EMAIL_TAKEN"]}, 409)

        new_user = User(full_name=full_name, email=email, phone=phone, role=role)
        new_user.password_hash = password
        try:
            db.session.add(new_user)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return make_response({"errors": f"{e}"})

        user: User = User.query.filter_by(email=email).first()
        token = create_access_token(user.id)

        return make_response(
            {"message": "USER_CREATED", "token": token, "user": UserSchema().dump(user)}
        )
