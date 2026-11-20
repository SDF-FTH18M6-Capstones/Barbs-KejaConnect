from flask_jwt_extended import get_jwt
from .interface.adminServiceInterface import AdminServiceInterface
from ..repository import AdminRepository
from ..schemas import (
    UserSchema,
    VerificationDocumentSchema,
    PropertySchema,
)
from ..exceptions import NotAllowedError


class AdminService(AdminServiceInterface):
    def __init__(self, admin_repo: AdminRepository):
        self.admin_repo = admin_repo

    def get_users(self, page, perpage):
        return self.admin_repo.get_users(page=page, perpage=perpage)

    def get_listings(self, page, perpage):
        return self.admin_repo.get_listings(page=page, perpage=perpage)

    def get_inquiries(self, page, perpage):
        return self.admin_repo.get_inquiries(page=page, perpage=perpage)

    def get_approvals(self):
        return self.admin_repo.get_approvals()

    def get_stats(self, page, per_page):
        claims = get_jwt()
        if claims.get("role", "") != "admin":
            raise NotAllowedError("You are not authorized to perform this action.")
        tenats, owners, managers, admins = self.get_users(page=page, perpage=per_page)
        users = dict(
            tenats=dict(
                items=[UserSchema().dump(v) for v in tenats.items],
                page=page,
                per_page=per_page,
                total=tenats.total,
                pages=tenats.pages,
            ),
            owners=dict(
                items=[UserSchema().dump(v) for v in owners.items],
                page=page,
                per_page=per_page,
                total=owners.total,
                pages=owners.pages,
            ),
            managers=dict(
                items=[UserSchema().dump(v) for v in managers.items],
                page=page,
                per_page=per_page,
                total=managers.total,
                pages=managers.pages,
            ),
            admins=dict(
                items=[UserSchema().dump(v) for v in admins.items],
                page=page,
                per_page=per_page,
                total=admins.total,
                pages=admins.pages,
            ),
        )
        available, taken, removed = self.get_listings(page=page, perpage=per_page)
        listings = dict(
            available=dict(
                items=[PropertySchema().dump(v) for v in available.items],
                page=page,
                per_page=per_page,
                total=available.total,
                pages=available.pages,
            ),
            taken=dict(
                items=[PropertySchema().dump(v) for v in taken.items],
                page=page,
                per_page=per_page,
                total=taken.total,
                pages=taken.pages,
            ),
            removed=dict(
                items=[PropertySchema().dump(v) for v in removed.items],
                page=page,
                per_page=per_page,
                total=removed.total,
                pages=removed.pages,
            ),
        )

        approvals = VerificationDocumentSchema().dump(self.get_approvals())

        return dict(users=users, listings=listings, approvals=approvals)
