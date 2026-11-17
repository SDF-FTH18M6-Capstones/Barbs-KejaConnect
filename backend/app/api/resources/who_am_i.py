from flask_restful import Resource
from flask import make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from ...models import User
from ...schemas import UserSchema


class WhoAmI(Resource):

    @jwt_required()
    def get(sefl):
        user_id = get_jwt_identity()

        if user_id:
            # replace with service call
            user = User.query.filter_by(id == user_id).first()
            user_json = UserSchema().dump(user)
            return make_response(user_json, 200)

        return make_response({"errors": ["UNAUTHENTICATED"]}, 401)
