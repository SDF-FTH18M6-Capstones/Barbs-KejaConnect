from .interface.inquiriesRepoInterface import InquiriesRepoInterface
from ..models import Inquiry, Property, User
from ..models import Inquiry, Property
from ..exceptions import ResourceNotFoundError, AlreadyExists, DatabasePersistenceError
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from ..config import db
from datetime import datetime, timezone


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

    def get_poster_inquiries(self, poster_id):
        properties: list[Property] = Property.query.filter_by(poster_id=poster_id).all()
        inquiries = [
            inquiry for property in properties for inquiry in property.inquiries
        ]
        return inquiries

    def get_sent_inquiries(self, user_id):
        user: User = User.query.filter_by(id=user_id).first()
        inquiries = [inquiry for inquiry in user.inquiries]
        return inquiries
