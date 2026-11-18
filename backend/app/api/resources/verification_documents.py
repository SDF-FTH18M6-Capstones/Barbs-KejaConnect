from flask_restful import Resource
from flask import make_response, request
from flask_jwt_extended import jwt_required
from ...models import VerificationDocument
from ...schemas import VerificationDocumentSchema
from ...config import db
from ...services import UploadFilesService, VerificationDocsService


class VerificationDocumentsResource(Resource):
    def __init__(self, upload: UploadFilesService, ver_doc: VerificationDocsService):
        self.upload = upload
        self.ver_doc = ver_doc

    @jwt_required()
    def get(self):
        data = self.ver_doc.get_all()
        ver_docs = VerificationDocumentSchema(many=True).dump(data)
        return make_response(
            {"message": "DOCUMENTS_RETREIVED", "verification_documents": ver_docs}
        )

    @jwt_required()
    def post(self):
        data = request.get_json(silent=True)

        if not isinstance(data, dict) and not data:
            return make_response(
                {"error": "Bad request", "message": "Invalid request object."}, 400
            )

        file = data.get("file", "")
        type = data.get("type", "")

        ver_doc = self.upload.upload_verification_doc(file=file, type=type)

        return make_response(
            {
                "message": "FILE_UPLOADED",
                "verification_doc": VerificationDocumentSchema().dump(ver_doc),
            }
        )
