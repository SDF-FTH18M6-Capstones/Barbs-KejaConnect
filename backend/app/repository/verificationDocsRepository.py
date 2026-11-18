from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from ..exceptions import AlreadyExists, DatabasePersistenceError, ResourceNotFoundError
from ..config import db
from .interface.verificationRepoInterface import VerificationRepoInterface
from ..models import VerificationDocument
from ..schemas import EmailVerificationTokenSchema


class VerificationDocumentsRepository(VerificationRepoInterface):
    def get_all(self, page, per_page):
        pagination = VerificationDocument.query.paginate(page=page, per_page=per_page)

        return pagination

    def get_by_id(self, doc_id):
        return VerificationDocument.query.filter_by(id=doc_id).first()

    def get_by_user(self, user_id):
        return VerificationDocument.query.filter_by(user_id=user_id).all()

    def add_document(self, ver_doc):
        try:
            db.session.add(ver_doc)
            db.session.commit(ver_doc)
            db.session.refresh(ver_doc)
            return ver_doc
        except IntegrityError as e:
            db.session.rollback()
            raise AlreadyExists(
                "One or more of the information provided is not unique."
            )
        except SQLAlchemyError as e:
            db.session.rollback()
            raise DatabasePersistenceError(
                f"Failed to upload verification document token: {e}"
            )

    def delete(self, doc_id):
        return super().delete(doc_id)
