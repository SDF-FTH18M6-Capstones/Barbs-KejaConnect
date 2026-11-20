from flask_restful import Resource
from flask import make_response, request
from flask_jwt_extended import jwt_required
from ...schemas import PropertySchema
from ...services import ListingsService


class ListingsMine(Resource):
    def __init__(self, listing_service: ListingsService):
        self.listing_service = listing_service

    @jwt_required()
    def get(self):
        page = request.args.get("page", 1, type=int)
        per_page = request.args.get("per_page", 5, type=int)
        listings = self.listing_service.get_poster_listings(
            page=page, per_page=per_page
        )
        res = {
            "items": [PropertySchema().dump(v) for v in listings.items],
            "page": page,
            "per_page": per_page,
            "total": listings.total,
            "pages": listings.pages,
        }

        return make_response({"message": "LISTINGS", "listings": res}, 200)
