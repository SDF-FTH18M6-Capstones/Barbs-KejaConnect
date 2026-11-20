from datetime import datetime, timezone

from sqlalchemy.exc import IntegrityError, SQLAlchemyError

from ..config import db
from ..exceptions import (
    AlreadyExists,
    DatabasePersistenceError,
    ResourceNotFoundError,
    UserNotFoundError,
)
from ..models import (
    Inquiry,
    Property,
    PropertyImage,
    User,
    VerificationDocument,
)
from ..schemas import EmailVerificationTokenSchema
from .interface.adminStatsRepoInterface import AdminStatsRepoInterface


def cal_pages(total, per_page):
    if total == 0 or total is None:
        pages = 0
    else:
        pages = total + per_page - 1

    return pages


class AdminRepository(AdminStatsRepoInterface):

    def get_users(self, page, perpage):
        tenats = User.query.filter_by(role="tenant").paginate(
            page=page, per_page=perpage
        )
        owners = User.query.filter_by(role="owner").paginate(
            page=page, per_page=perpage
        )
        managers = User.query.filter_by(role="manager").paginate(
            page=page, per_page=perpage
        )
        admins = User.query.filter_by(role="admin").paginate(
            page=page, per_page=perpage
        )

        return tenats, owners, managers, admins

    def get_listings(self, page, perpage):
        available = Property.query.filter_by(status="available").paginate(
            page=page, per_page=perpage
        )
        taken = Property.query.filter_by(role="taken").paginate(
            page=page, per_page=perpage
        )
        removed = Property.query.filter_by(role="removed").paginate(
            page=page, per_page=perpage
        )

        return available, taken, removed

    def get_approvals(self):
        verifications = VerificationDocument.query.filter_by(status="pending").all()

        return verifications

    def get_inquiries(self, page, perpage):
        pass
