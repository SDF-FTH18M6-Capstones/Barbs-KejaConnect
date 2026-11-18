import os
import cloudinary.uploader
from flask_jwt_extended import get_jwt_identity
from ..repository import VerificationDocumentsRepository
from .interface.verificationDocsInterface import VerificationDocsInterface
from ..models import verificationDocument
from ..schemas import verificationDocumentSchema
from ..exceptions import (
    InvalidCredentialsError,
    AlreadyExists,
    FileUploadFailed,
)


class VerificationDocsService(VerificationDocsInterface):
    def __init__(self, ver_doc_repo: VerificationDocumentsRepository):
        self.ver_doc_repo = ver_doc_repo

    def get_all(self):
        return self.ver_doc_repo.get_all()

    def get_by_id(self, id):
        return self.ver_doc_repo.get_by_id(doc_id=id)

    def get_user_docs(self, user_id):
        return self.ver_doc_repo.get_by_user(user_id=user_id)
