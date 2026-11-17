from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from ..exceptions import AlreadyExists, DatabasePersistenceError, ResourceNotFoundError
from ..config import db
from .interface.emailRepoInterface import EmailRepoInterface
from ..models import EmailVerificationToken


class EmailVerificationRepo(EmailRepoInterface):
    def get_by_token(self, token):
        return EmailVerificationToken.query(token_hash=token).first()

    def set_token(self):
        return super().set_token()

    def update_token(self, token_id, update_data: dict):
        email_token: EmailVerificationToken = EmailVerificationToken.query.filter_by(
            id=token_id
        ).first()

        if not email_token:
            raise ResourceNotFoundError(
                "Could not find email verification token in database."
            )

        try:
            for key, value in update_data.items():
                if hasattr(email_token, key):
                    setattr(email_token, key, value)

            db.session.commit()
            return email_token
        except IntegrityError as e:
            db.session.rollback()
            raise AlreadyExists("One or more of your changes is not unique.")
        except SQLAlchemyError as e:
            db.session.rollback()
            raise DatabasePersistenceError(
                "Failed to update the email verification token."
            )
