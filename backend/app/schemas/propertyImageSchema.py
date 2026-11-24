from marshmallow import Schema, fields, post_load

from ..models import PropertyImage


class PropertyImageSchema(Schema):
    id = fields.Integer(dump_only=True)
    property_id = fields.Integer(allow_none=False, required=True)
    url = fields.Url(required=True, relative=False)
    cloudinary_public_id = fields.String(required=True)
    is_cover = fields.Boolean(load_default=False)
    position = fields.Integer(required=True, allow_none=False)
    created_at = fields.DateTime()

    property = fields.Nested("PropertySchema", exclude=("property_images",), many=False)

    @post_load
    def to_propety_image(self, data, **kwargs):
        return PropertyImage(**data)