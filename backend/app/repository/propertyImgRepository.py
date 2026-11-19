from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from ..exceptions import AlreadyExists, DatabasePersistenceError, ResourceNotFoundError
from ..config import db
from .interface.propertyImgRepoInterface import PropertyImgRepoInterface
from ..models import PropertyImage
from ..schemas import EmailVerificationTokenSchema


class PropertyImgRepository(PropertyImgRepoInterface):
    def get_image_by_id(self, id):
        return PropertyImage.query.filter_by(id=id).first()

    def create_property_image(self, image):
        try:
            db.session.add(image)
            db.session.commit(image)
            db.session.refresh(image)
            return image
        except IntegrityError as e:
            db.session.rollback()
            raise AlreadyExists(
                "One or more of the information provided is not unique."
            )
        except SQLAlchemyError as e:
            db.session.rollback()
            raise DatabasePersistenceError(f"Failed to upload image.:{e}")

    def delete_image(self, image):
        try:
            db.session.delete(image)
            db.session.commit()
            return True
        except SQLAlchemyError as e:
            db.session.rollback()
            raise DatabasePersistenceError(f"Failed to delete image.:{e}")
