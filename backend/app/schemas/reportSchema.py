from marshmallow import Schema, fields, validate, pre_load

from ..models import Report
from ..utils import REPORT_STATUS


class ReportSchema(Schema):
    id = fields.Integer(dump_only=True)
    property_id = fields.Integer(allow_none=False, required=True)
    reporter_id = fields.Integer(allow_none=False, required=True)
    reason = fields.String(required=True, allow_none=False)
    status = fields.String(validate=validate.OneOf(REPORT_STATUS))
    resolved_by = fields.Integer(dump_only=True, allow_none=True)
    created_at = fields.DateTime()

    reporter = fields.Nested(
        "UserSchema",
        exclude=(
            "verification_documents",
            "inquiries",
            "saved_listings",
            "email_verification_token",
        ),
    )

    property = fields.Nested("PropertySchema", exclude=("inquiries", "saved_listings"))

    @pre_load
    def to_report(self, data, **kwargs):
        return ReportSchema(**data)
