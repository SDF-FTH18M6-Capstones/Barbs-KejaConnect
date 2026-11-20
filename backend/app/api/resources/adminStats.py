from flask import request, make_response
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from ...services import AdminService


class AdminStats(Resource):
    def __init__(self, admin_service: AdminService):
        self.admin_service = admin_service

    @jwt_required()
    def get(self):
        page = request.args.get("page", 1, type=int)
        per_page = request.args.get("per_page", 5, type=int)

        stats = self.admin_service.get_stats(page=page, per_page=per_page)

        return make_response({"stats": stats, "page": page, "per_page": per_page}, 200)
