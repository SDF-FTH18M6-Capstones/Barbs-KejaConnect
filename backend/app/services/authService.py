from flask_jwt_extended import create_access_token
from .interface.authInterface import AuthInterface
from ..repository import UserRepo
from ..models import User
from ..exceptions import InvalidCredentialsError, EmailNotVerified


class AuthService(AuthInterface):
    def __init__(self, user_repo: UserRepo):
        self.user_repo = user_repo

    def login(self, email, password):
        if not email or not password:
            raise InvalidCredentialsError("Email and password are required.")

        clean_email = email.strip().lower()
        user: User = self.user_repo.get_by_email(clean_email)

        if not user or not user.authenticate(password=password):
            raise InvalidCredentialsError("Invalid email or password.")

        if not user.email_verified:
            raise EmailNotVerified("Please verify your email before login.")

        token = create_access_token(identity=str(user.id))

        return token, user
