from flask_jwt_extended import get_jwt_identity
from ..repository import VerificationDocumentsRepository
from .interface.verificationDocsInterface import VerificationDocsInterface
from datetime import datetime, timezone


class VerificationDocsService(VerificationDocsInterface):
    def __init__(self, ver_doc_repo: VerificationDocumentsRepository):
        self.ver_doc_repo = ver_doc_repo

    def get_all(self, page, per_page):
        return self.ver_doc_repo.get_all(page, per_page)

    def get_by_id(self, id):
        return self.ver_doc_repo.get_by_id(doc_id=id)

    def update(self, doc_id, action, reason):
        reviewer_id = get_jwt_identity()
        update_data = {
            "reviewd_by": reviewer_id,
            "reviewed_at": datetime.now(timezone.utc),
        }
        if action == "approve":
            update_data["status"] = "approved"
        else:
            update_data["status"] = "rejected"
            update_data["rejection_reason"] = reason

        return self.ver_doc_repo.update(doc_id=doc_id, update_data=update_data)

    def get_user_docs(self, user_id, page, per_page):
        return self.ver_doc_repo.get_by_user(
            user_id=user_id, page=page, per_page=per_page
        )
