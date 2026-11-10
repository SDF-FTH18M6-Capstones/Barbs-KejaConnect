from flask_restful import Resource
from flask import make_response


class HealthCheck(Resource):
    def get(self):
        res = {"Message": "The api is up and running"}
        return make_response(res, 200)
