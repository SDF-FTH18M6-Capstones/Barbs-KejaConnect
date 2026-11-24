from flask_restful import Resource
from flask import make_response, request
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from ...schemas import PropertyImageSchema
from ...services import UploadFilesService, ListingsService


class PropertyImagesResource(Resource):
    def __init__(self, upload: UploadFilesService, listing_service: ListingsService):
        self.upload = upload
        self.listing_service = listing_service

    @jwt_required()
    def post(self, id):
        role = get_jwt().get("role")
        listing = self.listing_service.get_by_id(listing_id=id)
        if role not in ("manager", "owner") or listing.poster_id != int(
            get_jwt_identity()
        ):
            return make_response(
                {
                    "error": "Not allowed.",
                    "message": "You can only add photos to your own listings.",
                },
                403,
            )

        files = [f for f in request.files.getlist("files") if f.filename]
        if not files:
            return make_response(
                {"error": "No file provided", "message": "Invalid request object."},
                400,
            )

        property_images = self.upload.upload_property_images(files=files, listing_id=id)

        return make_response(
            {
                "message": "FILES_UPLOADED",
                "property_images": PropertyImageSchema(
                    many=True, exclude=("property",)
                ).dump(property_images),
            },
            201,
        )