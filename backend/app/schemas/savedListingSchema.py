from marshmallow import Schema, fields, pre_load

from ..models import SavedListing


class SavedListingSchema(Schema):
    id = fields.Integer(dump_only=True)
    user_id = fields.Integer(allow_none=False, required=True)
    property_id = fields.Integer(allow_none=True, required=True)
    created_at = fields.DateTime()

    user = fields.Nested("UserSchema", exclude=("saved_listings", "inquiries"))
    property = fields.Nested("PropertySchema", exclude=("saved_listings", "inquiries"))

    @pre_load
    def to_saved_listing(self, data, **kwargs):
        return SavedListing(**data)
