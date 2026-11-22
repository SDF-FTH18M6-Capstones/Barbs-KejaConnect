from flask_restful import Resource
from flask import make_response
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from ...services import UploadFilesService, ListingsService


class PropertyImagesByIdResource(Resource):
    def __init__(self, upload: UploadFilesService, listing_service: ListingsService):
        self.upload = upload
        self.listing_service = listing_service

    @jwt_required()
    def delete(self, id, image_id):
        role = get_jwt().get("role")
        listing = self.listing_service.get_by_id(listing_id=id)
        if role not in ("manager", "owner") or listing.poster_id != int(
            get_jwt_identity()
        ):
            return make_response(
                {
                    "error": "Not allowed.",
                    "message": "You can only remove photos from your own listings.",
                },
                403,
            )

        self.upload.delete_property_image(listing_id=id, image_id=image_id)

        return make_response({"message": "FILE_DELETED"}, 200)