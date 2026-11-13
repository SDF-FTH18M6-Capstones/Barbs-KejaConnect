from ..config import db, bcrypt
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from datetime import datetime, timezone
from ..utils import ALLOWED_ROLES, APPROVAL_STATUS


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    full_name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    phone = db.Column(db.String(15), unique=True, nullable=False)
    role = db.Column(db.String, nullable=False)
    email_verified = db.Column(db.Boolean, default=False, nullable=False)
    approval_status = db.Column(db.String, default="not_required", nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    _password_hash = db.Column(db.String)

    email_verification_token = db.relationship(
        "EmailVerificationToken",
        back_populates="user",
        uselist=False,
        cascade="all,delete",
    )
    verification_documents = db.relationship(
        "VerificationDocument",
        foreign_keys="VerificationDocument.user_id",
        back_populates="user",
        cascade="all,delete",
    )

    @hybrid_property
    def password_hash(self):
        raise AttributeError("Can not view password.")

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode("utf-8"))
        self._password_hash = password_hash.decode("utf-8")

    @validates("role")
    def role_validation(self, key, value):
        if value not in ALLOWED_ROLES:
            raise ValueError(f"Invalid role {value}. Must be one of: {ALLOWED_ROLES} ")
        return value

    @validates("approval_status")
    def approval_validation(self, key, value):
        if value not in APPROVAL_STATUS:
            raise ValueError(
                f"Invalid approval status {value}. Must be one of: {APPROVAL_STATUS} "
            )
        return value

    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self._password_hash, password=password.encode("utf-8")
        )

    def __repr__(self):
        return f"<User {self.full_name} {self.email} {self.created_at}>"
