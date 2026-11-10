from flask import Blueprint
from flask_restful import Api
from .health_check import HealthCheck

v1 = Blueprint("v1", __name__)

api = Api(v1)

api.add_resource(HealthCheck, "/health")
