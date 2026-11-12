from ..config import db, bcrypt
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from datetime import datetime, timezone

ALLOWED_ROLES = ["admin", "owner", "manager", "tenant"]
APPROVAL_STATUS = ["not_required", "pending", "approved", "rejected"]


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
