import secrets
from ..config import db, bcrypt
from datetime import datetime, timezone, timedelta
from sqlalchemy.ext.hybrid import hybrid_property


def default_expires_at(context):
    created_at = context.get_current_parameters().get("created_at")
    if created_at is None:
        created_at = datetime.now(timezone.utc)
    return created_at + timedelta(days=1)


class EmailVerificationToken(db.Model):
    __tablename__ = "email_verification_tokens"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )
    _token_hash = db.Column(db.String, nullable=False)
    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    expires_at = db.Column(
        db.DateTime(timezone=True), default=default_expires_at, nullable=False
    )

    used_at = db.Column(db.DateTime(timezone=True))

    user = db.relationship("User", back_populates="email_verification_token")

    def __init__(self, user_id: int):
        self.user_id = user_id

        self.raw_token = secrets.token_urlsafe(32)
        self._token_hash = bcrypt.generate_password_hash(self.raw_token).decode("utf-8")

    @hybrid_property
    def token_hash(self):
        return self._token_hash

    @token_hash.setter
    def token_hash(self):
        raise PermissionError("Cannot set token_hash")

    def validate(self, token):
        if self.used_at is not None:
            return False
        if self.expired():
            return False

        validated = bcrypt.check_password_hash(self._token_hash, token)
        if validated:
            self.used_at = datetime.now(timezone.utc)
            return True

        return False

    def expired(self):
        return datetime.now(timezone.utc) > self.expires_at.replace(tzinfo=timezone.utc)

    def __repr__(self):
        return f"<EmailVerficationToken {self.created_at} {self.used_at} >"
