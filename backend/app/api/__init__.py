from flask import Blueprint
from flask_restful import Api
from .resources.health_check import HealthCheck
from .resources.who_am_i import WhoAmI
from .resources.login import LoginResource
from .resources.signup import SignupResource
from .resources.verify_email import VerifyEmailResource
from .resources.verification_documents import VerificationDocumentsResource
from .resources.verifications import Verifications
from .resources.listings import ListingsResource
from .resources.listingsMine import ListingsMine
from .resources.listingById import ListingByIdResource
from .resources.propertyImages import PropertyImagesResource
from .resources.propertyImagesById import PropertyImagesByIdResource
from .resources.inquiiresByListing import InquiriesByListing
from .resources.inquiriesReceived import InquiriesReceived
from .resources.inquiriesSent import InquiriesSent
from .resources.adminStats import AdminStats

from .error_handlers import register_error_handlers
from ..repository import (
    UserRepo,
    EmailVerificationRepo,
    VerificationDocumentsRepository,
    ListingsRepository,
    PropertyImgRepository,
    InquiriesRepository,
    AdminRepository,
)
from ..services import (
    AuthService,
    UploadFilesService,
    VerificationDocsService,
    ListingsService,
    InquiryService,
    AdminService,
)

v1 = Blueprint("v1", __name__)

api = Api(v1)

register_error_handlers(v1)

user_repo = UserRepo()
email_ver_repo = EmailVerificationRepo()
ver_docs_repo = VerificationDocumentsRepository()
listing_repo = ListingsRepository()
property_image_repo = PropertyImgRepository()
inquiry_repo = InquiriesRepository()
admin_repo = AdminRepository()

auth_service = AuthService(user_repo=user_repo, email_ver_repo=email_ver_repo)
upload_service = UploadFilesService(
    ver_repo=ver_docs_repo, property_image_repo=property_image_repo
)
ver_docs_service = VerificationDocsService(ver_doc_repo=ver_docs_repo)
listing_service = ListingsService(listing_repo=listing_repo, user_repo=user_repo)
inquiry_service = InquiryService(
    inquiry_repo=inquiry_repo, listing_repo=listing_repo, user_repo=user_repo
)
admin_service = AdminService(admin_repo=admin_repo)

api.add_resource(HealthCheck, "/health")
api.add_resource(WhoAmI, "/me", resource_class_kwargs={"auth_service": auth_service})
api.add_resource(
    LoginResource, "/auth/login", resource_class_kwargs={"auth_service": auth_service}
)
api.add_resource(
    SignupResource, "/auth/signup", resource_class_kwargs={"auth_service": auth_service}
)
api.add_resource(
    VerifyEmailResource,
    "/auth/verify-email/<string:token>",
    resource_class_kwargs={"auth_service": auth_service},
)

# verification documents
api.add_resource(
    VerificationDocumentsResource,
    "/verification/documents",
    resource_class_kwargs={"upload": upload_service, "ver_doc": ver_docs_service},
)
api.add_resource(
    Verifications,
    "/admin/verifications",
    "/admin/verifications/<int:id>",
    resource_class_kwargs={"ver_doc": ver_docs_service},
)

# listings
api.add_resource(
    ListingsResource,
    "/listings",
    resource_class_kwargs={"listing_service": listing_service},
)
api.add_resource(
    ListingsMine,
    "/listings/mine",
    resource_class_kwargs={"listing_service": listing_service},
)
api.add_resource(
    ListingByIdResource,
    "/listings/<int:id>",
    "/listings/<int:id>/status",
    resource_class_kwargs={"listing_service": listing_service},
)

# listing images
api.add_resource(
    PropertyImagesResource,
    "/listings/<int:id>/images",
    resource_class_kwargs={"upload": upload_service, "listing_service": listing_service},
)
api.add_resource(
    PropertyImagesByIdResource,
    "/listings/<int:id>/images/<int:image_id>",
    resource_class_kwargs={"upload": upload_service, "listing_service": listing_service},
)

# inquiries
api.add_resource(
    InquiriesByListing,
    "/listings/<int:id>/inquiries",
    resource_class_kwargs={"inquiry_service": inquiry_service},
)
api.add_resource(
    InquiriesReceived,
    "/inquiries/received",
    resource_class_kwargs={"inquiry_service": inquiry_service},
)
api.add_resource(
    InquiriesSent,
    "/inquiries/sent",
    resource_class_kwargs={"inquiry_service": inquiry_service},
)

api.add_resource(
    AdminStats,
    "/admin/stats",
    resource_class_kwargs={"admin_service": admin_service},
)