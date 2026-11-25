from marshmallow import Schema, fields, validate, post_load

from ..models import EmailVerificationToken


class EmailVerificationTokenSchema(Schema):

    id = fields.Integer(dump_only=True)
    user_id = fields.Integer(required=True)
    created_at = fields.DateTime(dump_only=True)
    expires_at = fields.DateTime(dump_only=True)

    used_at = fields.DateTime(required=False)

    user = fields.Nested("UserSchema", exclude=("email_verification_token",))

    @post_load
    def to_email_verification_token(self, data, **kwargs):
        return EmailVerificationToken(**data)
