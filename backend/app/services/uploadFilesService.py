import os
import cloudinary.uploader
from flask_jwt_extended import get_jwt_identity, get_jwt
from ..repository import VerificationDocumentsRepository, PropertyImgRepository
from .interface.uploadFileInterface import UploadFilesInterface
from ..models import VerificationDocument, PropertyImage
from ..schemas import VerificationDocumentSchema, PropertyImageSchema
from ..exceptions import (
    InvalidCredentialsError,
    AlreadyExists,
    FileUploadFailed,
    NotAllowedError,
)


class UploadFilesService(UploadFilesInterface):
    def __init__(
        self,
        ver_repo: VerificationDocumentsRepository,
        property_image_repo: PropertyImgRepository,
    ):
        self.ver_repo = ver_repo
        self.property_image_repo = property_image_repo

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

    def upload_verification_doc(self, file):
        user_id = get_jwt_identity()

        file_url, public_id = self.upload_file(file=file, type="verification")

        new_ver_doc = VerificationDocumentSchema().load(
            {
                "user_id": user_id,
                "doc_type": type,
                "file_url": file_url,
                "cloudinary_public_id": public_id,
            }
        )

        ver_doc = self.ver_repo.add_document(ver_doc=new_ver_doc)

        return ver_doc

    def upload_property_images(self, files, listing_id):
        user_id = get_jwt_identity()
        property_images = []
        count = 0
        for file in files:
            if file.filename:
                count += 1
                file_url, public_id = self.upload_file(file=file, type="property")
                new_image = PropertyImageSchema().load(
                    {
                        "property_id": listing_id,
                        "url": file_url,
                        "cloudinary_public_id": public_id,
                        "is_cover": count == 1,
                        "position": count,
                    }
                )
                image = self.property_image_repo.add_property_image(image=new_image)
                property_images.append(image)

        return property_images

    def delete_property_image(self, listing_id, image_id):
        user_id = get_jwt_identity()
        image_data: PropertyImage = self.property_image_repo.get_image_by_id(image_id)
        claims = get_jwt()
        if claims.get("role") not in ("manager", "owner"):
            raise NotAllowedError("You are not authorized to perform this operation.")

        try:
            result = cloudinary.uploader.destroy(image_data.cloudinary_public_id)
            if result.get("result") == "ok":
                self.property_image_repo.delete_image(image_data)
                return True
            raise Exception("Failed to delete image.")
        except Exception as e:
            raise FileUploadFailed("Something wen wrong when uploading your file.")
