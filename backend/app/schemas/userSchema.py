from marshmallow import Schema, fields, validate, pre_load

from ..models import User
from ..utils import ALLOWED_ROLES, APPROVAL_STATUS


class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    full_name = fields.String(validate=validate.Length(min=1))
    email = fields.Email()
    phone = fields.String(validate=validate.Length(max=16))
    role = fields.String(validate=validate.OneOf(ALLOWED_ROLES))
    email_verified = fields.Boolean(load_default=False)
    approval_status = fields.String(validate=validate.OneOf(APPROVAL_STATUS))
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

    email_verification_token = fields.Nested(
        "EmailVerificationTokenSchema", exclude=("user",)
    )

    verification_documents = fields.Nested(
        "VerificationDocumentSchema", many=True, exclude=("user",)
    )

    inquiries = fields.Nested("InquirySchema", many=True, exclude=("user",))

    @pre_load
    def to_user(self, data, **kwargs):
        return User(**data)
