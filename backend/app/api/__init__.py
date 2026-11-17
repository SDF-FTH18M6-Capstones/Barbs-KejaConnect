from flask import Blueprint
from flask_restful import Api
from .resources.health_check import HealthCheck
from .resources.who_am_i import WhoAmI
from .resources.login import LoginResource
from .resources.signup import SignupResource
<<<<<<< HEAD
from .resources.verify_email import VerifyEmailResource
from .error_handlers import register_error_handlers
from ..repository import UserRepo, EmailVerificationRepo
=======
from .error_handlers import register_error_handlers
from ..repository import UserRepo
>>>>>>> development
from ..services import AuthService

v1 = Blueprint("v1", __name__)

api = Api(v1)

register_error_handlers(v1)

user_repo = UserRepo()
<<<<<<< HEAD
email_ver_repo = EmailVerificationRepo()
auth_service = AuthService(user_repo=user_repo, email_ver_repo=email_ver_repo)
=======
auth_service = AuthService(user_repo=user_repo)
>>>>>>> development

api.add_resource(HealthCheck, "/health")
api.add_resource(WhoAmI, "/me")
api.add_resource(
    LoginResource, "/auth/login", resource_class_kwargs={"auth_service": auth_service}
)
api.add_resource(
    SignupResource, "/auth/signup", resource_class_kwargs={"auth_service": auth_service}
)
<<<<<<< HEAD
api.add_resource(
    VerifyEmailResource,
    "/auth/verify-email/<string:token>",
    resource_class_kwargs={"auth_service": auth_service},
)
=======
>>>>>>> development
