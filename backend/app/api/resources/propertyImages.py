from flask_restful import Resource
from flask import make_response, request
from flask_jwt_extended import jwt_required, get_jwt
from ...models import PropertyImage
from ...schemas import PropertyImageSchema
from ...config import db
from ...services import UploadFilesService, VerificationDocsService


class PropertyImagesResource(Resource):
    def __init__(
        self,
        upload: UploadFilesService,
    ):
        self.upload = upload

    @jwt_required()
    def post(self, id):
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

        file = request.files.getlist("files")

        ver_doc = self.upload.upload_verification_doc(file=file, type=type)

        return make_response(
            {
                "message": "FILES_UPLOADED",
                "verification_doc": PropertyImageSchema(many=True).dump(ver_doc),
            }
        )
