from datetime import datetime, timezone
from sqlalchemy.orm import validates
from ..config import db

DOC_TYPE = ["national_id", "title_deed", "management_agreement"]
APPROVAL_STATUS = ["not_required", "pending", "approved", "rejected"]


class VerificationDocument(db.Model):
    __tablename__ = "verification_documents"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    doc_type = db.Column(db.String, nullable=False)
    file_url = db.Column(db.String, nullable=False)
    cloudinary_public_id = db.Column(db.String, nullable=False)
    status = db.Column(db.String, default="pending", nullable=False)
    rejection_reason = db.Column(db.String)
    reviewed_by = db.Column(db.Integer, db.ForeignKey("users.id"))
    reviewed_at = db.Column(db.DateTime(timezone=True))
    created_at = db.Column(
        db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    user = db.relationship("User", back_populates="verification_documents")

    @validates("doc_type")
    def doc_type_validation(self, key, doctype):
        if doctype not in DOC_TYPE:
            raise ValueError(
                f"Invalid document type {doctype} should be one of: {DOC_TYPE}"
            )
        return doctype

    @validates("status")
    def status_validation(self, key, status):
        if status not in APPROVAL_STATUS:
            raise ValueError(
                f"Invalid document type {status} should be one of: {APPROVAL_STATUS}"
            )
        return status

    def __repr__(self):
        return f"<VerificationDocuments {self.doc_type} {self.file_url} {self.status} {self.created_at} {self.reviewed_at} >"
