from flask_jwt_extended import create_access_token
from .interface.authInterface import AuthInterface
from ..repository import UserRepo
from ..models import User
from ..schemas import UserSchema
from ..exceptions import InvalidCredentialsError, EmailNotVerified, AlreadyExists


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

    def signup(self, email, phone, role, full_name, password):
        if not email or not phone or not role or not full_name or not password:
            raise InvalidCredentialsError("Missing credentials.")

        clean_email = email.strip().lower()
        existing_user = self.user_repo.get_by_email(clean_email)
        if existing_user:
            raise AlreadyExists("A user with this email already exists.")

        new_user: User = UserSchema().load(
            {
                "email": clean_email,
                "phone": phone.strip().lower(),
                "role": role.strip().lower(),
                "full_name": full_name.strip().lower(),
            }
        )
        new_user.password_hash = password

        saved_user = self.user_repo.create_user(new_user)

        return saved_user
