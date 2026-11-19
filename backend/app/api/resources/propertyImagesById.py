from flask_restful import Resource
from flask import make_response, request
from flask_jwt_extended import jwt_required, get_jwt
from ...models import PropertyImage
from ...schemas import PropertyImageSchema
from ...config import db
from ...services import UploadFilesService, VerificationDocsService


class PropertyImagesByIdResource(Resource):
    def __init__(
        self,
        upload: UploadFilesService,
    ):
        self.upload = upload

    @jwt_required()
    def delete(self, id, image_id):
        role = get_jwt().get("role")
        if role not in ("manager", "owner"):
            return make_response(
                {
                    "error": "Not allowed.",
                    "message": f"User of type {role} can not perform that operation.",
                },
                403,
            )

        deleted = self.upload.delete_property_image(listing_id=id, image_id=image_id)
        if not deleted:
            return make_response(
                {"error": "Failed to delete", "message": f"The image was not deleted."}
            )

        return make_response(
            {
                "message": "FILE_DELETED",
            },
            203,
        )

    @jwt_required()
    def patch(self, id):
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

        property_images = self.upload.upload_property_images(file=file, listing_id=id)

        return make_response(
            {
                "message": "FILES_UPLOADED",
                "property_images": PropertyImageSchema(many=True).dump(property_images),
            }
        )
