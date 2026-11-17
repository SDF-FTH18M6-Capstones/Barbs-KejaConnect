from .interface.authInterface import AuthInterface
from ..models import User


class AuthRepo(AuthInterface):
    def __int__(self):
        pass

    def login(self, data):
        email = data["email"]
        password = data["password"]

        user: User = User.query.filter_by(email=email).first()

        if not user:
            raise Exception("USER_NOT_FOUND")

        authenticated = user.authenticate(password=password)

        if authenticated:
            if not user.email_verified:
                raise Exception("EMAIL_NOT_VERIFIED")
            return user
        raise Exception("INVALID_CREDENTIALS")
