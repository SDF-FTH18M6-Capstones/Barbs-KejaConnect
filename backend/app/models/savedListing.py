from ..config import db
from datetime import datetime, timezone


class SavedListing(db.Model):
    __tablename__ = "savedlistings"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    property_id = db.Column(
        db.Integer, db.ForeignKey("properties.id", ondelete="CASCADE"), nullable=False
    )
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    user = db.relationship("User", back_populates="saved_listings")
    property = db.relationship("Property", back_populates="saved_listings")

    def __repr__(self):
        return f"<SavedListing {self.id} {self.user_id} {self.property_id} {self.created_at} >"
