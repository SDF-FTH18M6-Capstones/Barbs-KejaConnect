import os
from flask_jwt_extended import create_access_token, get_jwt_identity
from sendgrid.helpers.mail import Mail
from datetime import datetime, timezone
from .interface.authInterface import AuthInterface
from ..repository import UserRepo, EmailVerificationRepo
from ..models import User, EmailVerificationToken
from ..schemas import UserSchema
from ..exceptions import (
    InvalidCredentialsError,
    EmailNotVerified,
    AlreadyExists,
    EmailVerificationNotSentError,
)
from ..config import sg
from ..utils import verification_email

BACKEND_URL = os.getenv("BACKEND_URL", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", "")


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

        token = create_access_token(
            identity=str(user.id), additional_claims={"role": user.role}
        )

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

        verification_sent = self.send_verification_email(user=saved_user)

        return saved_user

    def verify_email(self, token):
        if not token:
            raise InvalidCredentialsError("Verification token missing.")

        clean_token, token_id = token.strip().rsplit(".", 1)
        email_ver_token: EmailVerificationToken = self.email_ver_repo.get_by_id(
            id=int(token_id)
        )

        if not email_ver_token or not email_ver_token.validate(clean_token):
            raise InvalidCredentialsError("Invalid email token.")

        user: User = self.user_repo.update_user(
            user_id=email_ver_token.user_id, update_data={"email_verified": True}
        )
        user_res = UserSchema().dump(user)
        token = create_access_token(
            identity=str(user.id), additional_claims={"role": user.role}
        )

        return token, user_res

    def send_verification_email(self, user: User):
        email_ver_token: EmailVerificationToken = self.email_ver_repo.set_token(
            user_id=user.id
        )
        print(email_ver_token.id)
        url = f"{BACKEND_URL}/api/v1/auth/verify-email/{email_ver_token.raw_token}.{email_ver_token.id}"
        VERIFICATION_EMAIL = verification_email(verification_url=url)
        message = Mail(
            from_email=FROM_EMAIL,
            to_emails=user.email,
            subject="KejaConnect email verification.",
            html_content=VERIFICATION_EMAIL,
        )

        try:
            res = sg.send(message)
            if res.status_code not in (200, 201, 202):
                raise EmailVerificationNotSentError(
                    "Failed to send email verification."
                )
            return True
        except Exception as e:
            raise EmailVerificationNotSentError(e)
