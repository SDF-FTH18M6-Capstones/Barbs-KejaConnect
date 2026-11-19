from flask_restful import Resource
from flask import make_response, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from ...models import VerificationDocument
from ...schemas import PropertySchema
from ...config import db
from ...services import ListingsService, VerificationDocsService


class ListingsResource(Resource):
    def __init__(self, listing_service: ListingsService):
        self.listing_service = listing_service

    def get(self):
        page = request.args.get("page", 1, type=int)
        per_page = request.args.get("per_page", 5, type=int)
        listings = self.listing_service.get_all_listings(page=page, per_page=per_page)
        res = {
            "items": [PropertySchema().dump(v) for v in listings.items],
            "page": page,
            "per_page": per_page,
            "total": listings.total,
            "pages": listings.pages,
        }

        return make_response(res, 200)

    @jwt_required()
    def post(self):
        data = request.get_json(silent=True)
        user_id = get_jwt_identity()
        claims = get_jwt()
        approval_status = claims.get("approval_status")
        if approval_status != "approved" or claims.get("role") not in (
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

        data["poster_id"] = user_id

        validate_listing = PropertySchema().load(data)

        listing = self.listing_service.create_listing(listing=validate_listing)

        return make_response(
            {"message": "LISTING_CREATED", "listing": PropertySchema().dump(listing)},
            201,
        )
