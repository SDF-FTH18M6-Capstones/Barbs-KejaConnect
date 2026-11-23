from flask_restful import Resource
from flask import make_response, request
from flask_jwt_extended import jwt_required
from ...models import Inquiry
from ...schemas import InquirySchema
from ...services import InquiryService


class InquiriesReceived(Resource):
    def __init__(self, inquiry_service: InquiryService):
        self.inquiry_service = inquiry_service

    @jwt_required()
    def get(self):
        page = request.args.get("page", 1, type=int)
        per_page = request.args.get("per_page", 5, type=int)
        inquiries = self.inquiry_service.received_inquiries(
            page=page, per_page=per_page
        )

        return make_response(
            {
                "items": InquirySchema(many=True).dump(inquiries.items),
                "page": page,
                "per_page": per_page,
                "total": inquiries.total,
                "pages": inquiries.pages,
            },
            200,
        )