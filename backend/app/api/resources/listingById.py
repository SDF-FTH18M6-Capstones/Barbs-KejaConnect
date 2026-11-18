from flask_restful import Resource
from flask import make_response, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from ...models import Property
from ...schemas import PropertySchema
from ...config import db
from ...services import ListingsService, VerificationDocsService


class ListingByIdResource(Resource):
    def __init__(self, listing_service: ListingsService):
        self.listing_service = listing_service

    def get(self, id):
        listing = self.listing_service.get_by_id(listing_id=id)

        return make_response(
            {"message": "LISTING_RETRIEVED", "listing": PropertySchema().dump(listing)},
            200,
        )

    @jwt_required()
    def put(self, id):
        data = request.get_json(silent=True)
        l: Property = self.listing_service.get_by_id(listing_id=id)
        user_id = get_jwt_identity()
        claims = get_jwt()
        if l.poster_id != user_id or claims.get("role") not in (
            "owner",
            "manager",
        ):
            raise make_response(
                {
                    "error": "Not allowed.",
                    "message": f"You either not approved or allowed to perform that operation.",
                },
                403,
            )

        listing = self.listing_service.update_listing(listing_id=id, update_data=data)

        return make_response(
            {"message": "LISTING_UPDATED", "listing": PropertySchema().dump(listing)},
            201,
        )

    def patch(self, id):
        user_id = get_jwt_identity()
        claims = get_jwt()
        pass
