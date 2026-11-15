from marshmallow import Schema, fields, validate, pre_load

from ..models import Property
from ..utils import PROPERTY_TYPE, PROPERTY_STATUS, COUNTIES


class PropertySchema(Schema):
    id = fields.Int(dump_only=True)
    poster_id = fields.Int(allow_none=False, required=True)
    title = fields.String(allow_none=False, required=True)
    description = fields.String(allow_none=False, required=True)
    property_type = fields.String(validate=validate.OneOf(PROPERTY_TYPE))
    price_monthly = fields.Int(required=True, allow_none=False)
    bedrooms = fields.Int(allow_none=True)
    bathrooms = fields.Int(allow_none=True)
    county = fields.String(allow_none=False, validate=validate.OneOf(COUNTIES))
    area = fields.String(allow_none=False)
    building_name = fields.String(allow_none=True)
    street_address = fields.String(allow_none=True)
    unit_number = fields.String(allow_none=False, validate=validate.Length(max=30))
    lr_number = fields.String(validate=validate.Length(max=60))
    dedupe_key = fields.String(dump_only=True)
    status = fields.String(allow_none=False, validate=validate.OneOf(PROPERTY_STATUS))
    created_at = fields.DateTime(dump_default=True)
    updated_at = fields.DateTime(dump_only=True)

    inquiries = fields.Nested("InquirySchema", many=True, exclude=("property",))
    property_images = fields.Nested(
        "PropertyImageSchema", exclude=("property",), many=True
    )

    @pre_load
    def to_property(self, data, **kwargs):
        return Property(**data)
