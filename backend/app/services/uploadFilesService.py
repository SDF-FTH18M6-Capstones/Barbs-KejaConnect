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
    ResourceNotFoundError,
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
        print("we got here.")
        if not file or type not in ("property", "verification"):
            raise InvalidCredentialsError(
                'Check your file has data or your input type is "property" or "verification".'
            )
        try:
            file.stream.seek(0)
            result = cloudinary.uploader.upload(
                file.stream, folder=type, resource_type="auto"
            )
            return result.get("secure_url"), result.get("public_id")
        except Exception as e:
            print("CLOUDINARY ERROR:", repr(e))
            raise FileUploadFailed("Something went wrong when uploading your file.")

    def upload_verification_doc(self, file, doc_type):
        user_id = int(get_jwt_identity())

        file_url, public_id = self.upload_file(file=file, type="verification")
        print("past uploader")
        new_ver_doc = VerificationDocumentSchema().load(
            {
                "user_id": user_id,
                "doc_type": doc_type,
                "file_url": file_url,
                "cloudinary_public_id": public_id,
            }
        )
        print("past database")

        ver_doc = self.ver_repo.add_document(ver_doc=new_ver_doc)

        return ver_doc

    def upload_property_images(self, files, listing_id):
        existing = self.property_image_repo.count_for_listing(listing_id)
        property_images = []
        for count, file in enumerate(files, start=existing + 1):
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
            image = self.property_image_repo.create_property_image(image=new_image)
            property_images.append(image)

        return property_images

    def delete_property_image(self, listing_id, image_id):
        image_data: PropertyImage = self.property_image_repo.get_image_by_id(image_id)
        if not image_data or image_data.property_id != listing_id:
            raise ResourceNotFoundError("Photo not found.")

        try:
            cloudinary.uploader.destroy(image_data.cloudinary_public_id)
        except Exception as e:
            print("CLOUDINARY ERROR:", repr(e))

        self.property_image_repo.delete_image(image_data)
        if image_data.is_cover:
            self.property_image_repo.set_first_as_cover(listing_id)
        return True


# todo:make cover image make_cover(listing_id,image_id)