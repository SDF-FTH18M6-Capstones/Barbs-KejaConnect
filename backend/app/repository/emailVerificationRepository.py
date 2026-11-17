from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from ..exceptions import AlreadyExists, DatabasePersistenceError
from ..config import db
from .interface.emailRepoInterface import EmailRepoInterface
from ..models import EmailVerificationToken


class EmailVerificationRepo(EmailRepoInterface):
    def get_by_token(self, token):
        return EmailVerificationToken.query(token_hash=token).first()
