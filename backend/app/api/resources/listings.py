from flask_restful import Resource
from flask import make_response, request
from flask_jwt_extended import jwt_required, get_jwt
from ...models import VerificationDocument
from ...schemas import VerificationDocumentSchema
from ...config import db
from ...services import UploadFilesService, VerificationDocsService


class ListingsResource(Resource):
    def __init__(self):
        pass

    def get(self):
        pass

    def post(self):
        pass
