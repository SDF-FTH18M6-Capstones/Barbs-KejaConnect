from flask_restful import Resource
from flask import make_response, request
from flask_jwt_extended import jwt_required, get_jwt
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
        claims = get_jwt()
        if claims.get("role") not in ("admin"):
            raise make_response(
                {
                    "error": "Not allowed.",
                    "message": f"User of type {claims.get('role')} can not perform that operation.",
                },
                403,
            )
        page = request.args.get("page", 1, type=int)
        per_page = request.args.get("per_page", 5, type=int)

        ver_docs = self.ver_doc.get_all(page=page, per_page=per_page)
        return make_response(
            {
                "items": [VerificationDocumentSchema().dump(v) for v in ver_docs.items],
                "page": page,
                "per_page": per_page,
                "total": ver_docs.total,
                "pages": ver_docs.pages,
            },
            200,
        )

    @jwt_required()
    def post(self):
        role = get_jwt().get("role")
        if role not in ("manager", "owner"):
            return make_response(
                {
                    "error": "Not allowed.",
                    "message": f"User of type {role} can not perform that operation.",
                },
                403,
            )
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
