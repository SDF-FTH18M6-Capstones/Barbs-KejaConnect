from ..config import db
from datetime import datetime, timezone


class PropertyImage(db.Model):
    __tablename__ = "propertyimages"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    property_id = db.Column(
        db.Integer, db.ForeignKey("properties.id", ondelete="CASCADE"), nullable=False
    )
    url = db.Column(db.String, nullable=False)
    cloudinary_public_id = db.Column(db.String(255), nullable=False)
    is_cover = db.Column(db.Boolean, nullable=False)
    position = db.Column(db.Integer, nullable=False, unique=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    property = db.relationship("Property", back_populates="property_images")

    def __repr__(self):
        return f"<PropertyImage {self.id} {self.url} {self.is_cover} {self.position} {self.created_at} >"
