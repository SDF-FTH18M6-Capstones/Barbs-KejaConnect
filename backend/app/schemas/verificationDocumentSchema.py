from marshmallow import Schema, fields, validate, pre_load

from ..models import VerificationDocument
from ..utils import DOC_TYPE, APPROVAL_STATUS


class VerificationDocumentSchema(Schema):

    id = fields.Integer(dump_only=True)
    user_id = fields.Integer(required=True)
    doc_type = fields.String(validate=validate.OneOf(DOC_TYPE), required=True)
    file_url = fields.Url(required=True, relative=False)
    cloudinary_public_id = fields.String(required=True)
    status = fields.String(
        validate=validate.OneOf(APPROVAL_STATUS), load_default="pending"
    )
    rejection_reason = fields.String()
    reviewed_by = fields.Integer()
    reviewed_at = fields.DateTime()
    created_at = fields.DateTime()

    user = fields.Nested("UserSchema", exclude=("verification_documents",))

    @pre_load
    def verification_documents(self, data, **kwargs):
        return VerificationDocument(**data)
