from flask import Blueprint
from flask_restful import Api
from .resources.health_check import HealthCheck
from .resources.who_am_i import WhoAmI
from .resources.login import LoginResource
from .resources.signup import SignupResource
from .error_handlers import register_error_handlers

v1 = Blueprint("v1", __name__)

api = Api(v1)

register_error_handlers(v1)

api.add_resource(HealthCheck, "/health")
api.add_resource(WhoAmI, "/me")
api.add_resource(LoginResource, "/auth/login")
api.add_resource(SignupResource, "/auth/signup")
