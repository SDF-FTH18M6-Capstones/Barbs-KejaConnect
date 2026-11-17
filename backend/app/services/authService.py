from flask_jwt_extended import create_access_token, get_jwt_identity
from .interface.authInterface import AuthInterface
from ..repository import UserRepo, EmailVerificationRepo
from ..models import User, EmailVerificationToken
from ..schemas import UserSchema
from ..exceptions import InvalidCredentialsError, EmailNotVerified, AlreadyExists


class AuthService(AuthInterface):
    def __init__(self, user_repo: UserRepo, email_ver_repo: EmailVerificationRepo):
        self.user_repo = user_repo
        self.email_ver_repo = email_ver_repo

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

    def verify_email(self, token):
        if not token:
            raise InvalidCredentialsError("Verification token missing.")

        clean_token = token.strip()
        email_ver_token: EmailVerificationToken = self.email_ver_repo.get_by_token(
            token=clean_token
        )

        if not email_ver_token or not email_ver_token.validate(clean_token):
            raise InvalidCredentialsError("Invalid email token.")

        user: User = self.user_repo.update_user(
            user_id=email_ver_token.user_id, update_data={"is_verified": True}
        )
        token = create_access_token(identity=user.id)

        return token, user
