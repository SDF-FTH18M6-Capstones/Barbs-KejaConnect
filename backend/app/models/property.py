from ..config import db, bcrypt
from sqlalchemy.orm import validates
from datetime import datetime, timezone
from ..utils import PROPERTY_TYPE, PROPERTY_STATUS, COUNTIES


def create_dedupe_key(context):
    property_type = context.get_current_parameters().get("property_type")
    area = "_".join([s.lower() for s in context.get_current_parameters().get("area")])
    street_address = "_".join(
        [s.lower() for s in context.get_current_parameters().get("street_address")]
    )
    unit_number = context.get_current_parameterts().get("unit_number").lower()
    building_name = "_".join(
        [s.lower() for s in context.get_current_parameters().get("building_name")]
    )

    if property_type == "house" and street_address != None:
        st_address = "_".join([s.lower() for s in street_address])
        return "|".join([area, st_address, unit_number])

    if building_name != None and unit_number != None:
        return "|".join([area, street_address, unit_number])

    raise ValueError("Error creating a dedupe key,Check your inputs.")


class Property(db.Model):
    __tablename__ = "properties"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    poster_id = db.Column(db.Interger, db.ForeignKey("users.id"), nullable=False)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.String(250), nullable=False)
    property_type = db.Column(db.String, nullable=False)
    price_monthly = db.Column(db.Integer, nullable=False)
    bedrooms = db.Column(db.Integer, nullable=True)
    bathrooms = db.Column(db.Integer, nullable=True)
    county = db.Column(db.String, nullable=False)
    area = db.Column(db.String, nullable=False)
    building_name = db.Column(db.String, nullable=True)
    street_address = db.Column(db.String)
    unit_number = db.Column(db.String(30), nullable=False)
    lr_number = db.Column(db.String(60))
    _dedupe_key = db.Column(
        db.String(300), default=create_dedupe_key, nullable=False, unique=True
    )
    status = db.Column(db.String, default="available", nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    @validates("property_type")
    def val_property_type(self, value):
        if value not in PROPERTY_TYPE:
            raise ValueError(
                f"Invalid property type {value} should be one of {PROPERTY_TYPE}"
            )
        return value

    @validates("status")
    def val_status(self, value):
        if value not in PROPERTY_STATUS:
            raise ValueError(
                f"Invalid property status {value} should one of {PROPERTY_STATUS}"
            )
        return value

    @validates("county")
    def val_area(self, value):
        if value not in COUNTIES:
            raise ValueError(f"Invalid county: {value}.")

    @property
    def dedupe_key(self):
        return self._dedupe_key

    @dedupe_key.setter
    def dedupe_key(self, value):
        raise AttributeError("Cannot manually set the dedupe key.")

    def __repr__(self):
        return f"<Property {self.id} {self.title} {self.property_type} {self.price_monthly} {self.bedrooms} {self.bathrooms} {self.dedupe_key} {self.status} {self.created_at}>"
