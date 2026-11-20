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

    def get_by_user(self, user_id, page, per_page):
        pagination = VerificationDocument.query.filter_by(user_id=user_id).paginate(
            page=page, per_page=per_page
        )
        return pagination

    def add_document(self, ver_doc):
        try:
            db.session.add(ver_doc)
            db.session.commit()
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

    def update(self, doc_id, update_data: dict):
        ver_doc: VerificationDocument = VerificationDocument.query.filter_by(
            id=doc_id
        ).first()

        if ver_doc:
            raise ResourceNotFoundError(
                "Could not find the verification document with that id."
            )

        try:
            for key, value in update_data.items():
                if hasattr(ver_doc, key):
                    setattr(ver_doc, key, value)
            db.session.commit()
            return ver_doc
        except IntegrityError as e:
            db.session.rollback()
            raise AlreadyExists("One or more of your changes is not unique.")
        except SQLAlchemyError as e:
            db.session.rollback()
            raise DatabasePersistenceError("Failed to update the verification token.")

    def delete(self, doc_id):
        return super().delete(doc_id)
