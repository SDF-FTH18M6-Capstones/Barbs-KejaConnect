import os
import cloudinary.uploader
from flask_jwt_extended import get_jwt_identity
from ..repository import VerificationDocumentsRepository
from .interface.uploadFileInterface import UploadFilesInterface
from ..models import verificationDocument
from ..schemas import verificationDocumentSchema
from ..exceptions import (
    InvalidCredentialsError,
    AlreadyExists,
    FileUploadFailed,
)


class UploadFilesService(UploadFilesInterface):
    def __init__(self, ver_repo: VerificationDocumentsRepository):
        self.ver_repo = ver_repo

    def upload_file(self, file, type):
        if not file or type not in ("property", "verification"):
            raise InvalidCredentialsError(
                'Check your file has data or your input type is "property" or "verification".'
            )
        try:
            result = cloudinary.uploader.upload(file, folder=type)
            return result.get("secure_url"), result.get("public_id")
        except Exception as e:
            raise FileUploadFailed("Something wen wrong when uploading your file.")

    def upload_verification_doc(self, file, type):
        user_id = get_jwt_identity()

        file_url, public_id = self.upload_file(file=file, type="verification")

        new_ver_doc = verificationDocumentSchema().load(
            {
                "user_id": user_id,
                "doc_type": type,
                "file_url": file_url,
                "cloudinary_public_id": public_id,
            }
        )

        ver_doc = self.ver_repo.add_document(ver_doc=new_ver_doc)

        return ver_doc
