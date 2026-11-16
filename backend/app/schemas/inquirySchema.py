from marshmallow import Schema, fields, validate, pre_load

from ..models import Inquiry
from ..utils import INQUIRY_STATUS


class InquirySchema(Schema):
    id = fields.Int(dump_only=True)
    property_id = fields.Int(required=True, allow_none=False)
    tenant_id = fields.Int(required=True, allow_none=False)
    message = fields.String(validate=validate.Length(min=1))
    status = fields.String(validate=validate.OneOf(INQUIRY_STATUS))
    created_at = fields.DateTime(dump_only=True)

    user = fields.Nested("UserSchema", exclude=("inquiries",))
    property = fields.Nested("PropertySchema", exclude=("inquiries",))

    @pre_load
    def to_inquiry(self, data, **kwargs):
        return Inquiry(**data)
