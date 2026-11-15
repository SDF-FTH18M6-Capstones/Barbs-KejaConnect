from ..config import db, bcrypt
from sqlalchemy.orm import validates
from datetime import datetime, timezone
from ..utils import INQUIRY_STATUS


class Inquiry(db.Model):
    __tablename__ = "inquiries"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    property_id = db.Column(db.Integer, db.ForeignKey("properties.id"), nullable=False)
    tenant_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    message = db.Column(db.String, nullable=False)
    status = db.Column(db.String, default="new", nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    user = db.relationship("User", back_populates="inquiries")
    property = db.relationship("Property", back_populates="inquiries")

    @validates("status")
    def val_status(self, key, value):
        if value not in INQUIRY_STATUS:
            raise ValueError(
                f"Invalid Property status {value} should be one of {INQUIRY_STATUS}"
            )
        return value

    def __repr__(self):
        return f"<Inquiry {self.id} {self.status} {self.created_at} >"
