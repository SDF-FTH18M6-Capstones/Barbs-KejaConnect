from flask_restful import Resource
from flask import make_response, request
from flask_jwt_extended import jwt_required
from ...models import VerificationDocument
from ...schemas import VerificationDocumentSchema
from ...config import db
from ...services import AuthService


class VerificationDocumentsResource(Resource):
    @jwt_required()
    def get(self, user_id):
        pass

    @jwt_required()
    def post(self):
        pass
