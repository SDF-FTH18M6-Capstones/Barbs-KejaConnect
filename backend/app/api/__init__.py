from flask import Blueprint
from flask_restful import Api
from .resources.health_check import HealthCheck
from .resources.who_am_i import WhoAmI
from .resources.login import LoginResource
from .resources.signup import SignupResource
from .resources.verify_email import VerifyEmailResource
from .resources.verification_documents import VerificationDocumentsResource
from .error_handlers import register_error_handlers
from ..repository import (
    UserRepo,
    EmailVerificationRepo,
    VerificationDocumentsRepository,
)
from ..services import AuthService, UploadFilesService, VerificationDocsService

v1 = Blueprint("v1", __name__)

api = Api(v1)

register_error_handlers(v1)

user_repo = UserRepo()
email_ver_repo = EmailVerificationRepo()
ver_docs_repo = VerificationDocumentsRepository()

auth_service = AuthService(user_repo=user_repo, email_ver_repo=email_ver_repo)
upload_service = UploadFilesService(ver_repo=ver_docs_repo)
ver_docs_service = VerificationDocsService(ver_doc_repo=ver_docs_repo)

api.add_resource(HealthCheck, "/health")
api.add_resource(WhoAmI, "/me")
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
