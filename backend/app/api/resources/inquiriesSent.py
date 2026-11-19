from flask_restful import Resource
from flask import make_response
from flask_jwt_extended import jwt_required
from ...models import Inquiry
from ...schemas import InquirySchema
from ...services import InquiryService


class InquiriesSent(Resource):
    def __init__(self, inquiry_service: InquiryService):
        self.inquiry_service = inquiry_service

    @jwt_required()
    def get(self):
        inquiries = self.inquiry_service.sent_inquiries()

        return make_response(
            {
                "message": "INQUIRIES",
                "inquiries": InquirySchema(many=True).dump(inquiries),
            }
        )
