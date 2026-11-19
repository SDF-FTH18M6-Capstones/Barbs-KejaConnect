from flask_restful import Resource
from flask import make_response, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from ...models import Property
from ...schemas import PropertySchema
from ...config import db
from ...services import ListingsService, VerificationDocsService


class InquiriesByListing(Resource):
    def post(self):
        pass
