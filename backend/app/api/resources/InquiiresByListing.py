from flask_restful import Resource
from flask import make_response, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from ...models import Inquiry
from ...schemas import InquirySchema
from ...config import db
from ...services import InquiryService, VerificationDocsService, ListingsService


class InquiriesByListing(Resource):
    def __init__(
        self,
        inquiry_service: InquiryService,
    ):
        self.inquiry_service = inquiry_service

    @jwt_required()
    def post(self, id):
        data = request.get_json(silent=True)
        message = data.get("message", "")

        if not message:
            return make_response(
                {
                    "error": "Invalid data",
                    "message": "Inquiry cannot be sent with empty message.",
                },
                404,
            )
        inquiry = self.inquiry_service.make_inquiry(message, id)

        return make_response(
            {"message": "INQUIRY_SENT", "inquiry": InquirySchema().dump(inquiry)}
        )
