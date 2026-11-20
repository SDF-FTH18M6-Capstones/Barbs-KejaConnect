from .interface.inquiriesRepoInterface import InquiriesRepoInterface
from ..models import Inquiry, User
from ..models import Inquiry
from ..exceptions import AlreadyExists, DatabasePersistenceError
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from ..config import db


class InquiriesRepository(InquiriesRepoInterface):
    def create_inquiry(self, inquiry):
        try:
            db.session.add(inquiry)
            db.session.commit()
            db.session.refresh(inquiry)
            return inquiry
        except IntegrityError as e:
            db.session.rollback()
            raise AlreadyExists(
                "One or more of the information provided is not unique."
            )
        except SQLAlchemyError as e:
            db.session.rollback()
            raise DatabasePersistenceError(f"Failed to create new inquiry.")

    def get_poster_inquiries(self, poster_id, page, per_page):
        inquiries = Inquiry.query.filter_by(poster_id=poster_id).paginate(
            page=page, per_page=per_page
        )

        return inquiries

    def get_sent_inquiries(self, user_id):
        user: User = User.query.filter_by(id=user_id).first()
        inquiries = [inquiry for inquiry in user.inquiries]
        return inquiries
