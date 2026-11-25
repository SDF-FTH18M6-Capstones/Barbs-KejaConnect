from ..config import db
from sqlalchemy.orm import validates

from datetime import datetime, timezone
from ..utils import REPORT_STATUS


class Report(db.Model):
    __tablename__ = "reports"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    property_id = db.Column(
        db.Integer, db.ForeignKey("properties.id", ondelete="CASCADE"), nullable=False
    )
    reporter_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    reason = db.Column(db.String, nullable=False)
    status = db.Column(db.String, default="open")
    resolved_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    reporter = db.relationship(
        "User", foreign_keys=[reporter_id], back_populates="reports"
    )
    property = db.relationship("Property")

    @validates("status")
    def val_status(self, key, value):
        if value not in REPORT_STATUS:
            raise ValueError(
                f"Invalid status {value} should be one of {REPORT_STATUS}."
            )
        return value

    def __repr__(self):
        return f"<Report {self.id} {self.reason} {self.status} {self.created_at} >"
