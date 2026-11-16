from flask import Blueprint
from flask_restful import Api
from .health_check import HealthCheck
from .who_am_i import WhoAmI
from .login import LoginResource

v1 = Blueprint("v1", __name__)

api = Api(v1)

api.add_resource(HealthCheck, "/health")
api.add_resource(WhoAmI, "/me")
api.add_resource(LoginResource, "/auth/login")
