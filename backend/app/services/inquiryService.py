from .interface.inquiryInterface import InquiryInterface
from ..repository import InquiriesRepository, ListingsRepository, UserRepo
from flask_jwt_extended import get_jwt_identity, get_jwt
from ..utils import send_email, inquiry_email
from ..models import User, Property, Inquiry
from ..schemas import InquirySchema, UserSchema
from ..exceptions import NotAllowedError


class InquiryService(InquiryInterface):
    def __init__(
        self,
        inquiry_repo: InquiriesRepository,
        listing_repo: ListingsRepository,
        user_repo: UserRepo,
    ):
        self.inquiry_repo = inquiry_repo
        self.listing_repo = listing_repo
        self.user_repo = user_repo

    def make_inquiry(self, message, id):
        user_id = get_jwt_identity()
        user: User = self.user_repo.get_by_id(user_id)
        property: Property = self.listing_repo.get_by_id(id)
        owner: User = UserSchema().load(property.user)
        new_inquiry: Inquiry = InquirySchema().load(
            {"property_id": id, "tenant_id": user_id, "message": message}
        )

        saved_inquiry: Inquiry = self.inquiry_repo.create_inquiry(new_inquiry)

        if saved_inquiry:
            INQUIRY_EMAIL = inquiry_email(
                owner_name=owner.full_name,
                inquirer_name=user.full_name,
                property_title=property.title,
                inquiry_text=message,
                inquiry_url="",
            )
            sent = send_email(
                email_to=property,
                subject="PROPERTY LISTING INQUIRY",
                html_content=INQUIRY_EMAIL,
            )

        return saved_inquiry

    def received_inquiries(self, page, per_page):
        user_id = int(get_jwt_identity())
        claims = get_jwt()
        if claims.get("role", "") not in ("manager", "owner"):
            return NotAllowedError(
                f"User of type {claims.get('role','')} can not perform this operation."
            )
        return self.inquiry_repo.get_poster_inquiries(
            user_id, page=page, per_page=per_page
        )

    def sent_inquiries(self):
        user_id = get_jwt_identity()

        return self.inquiry_repo.get_sent_inquiries(user_id=user_id)
