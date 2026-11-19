from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from ..exceptions import AlreadyExists, DatabasePersistenceError, ResourceNotFoundError
from ..config import db
from .interface.propertyImgRepoInterface import PropertyImgRepoInterface
from ..models import VerificationDocument
from ..schemas import EmailVerificationTokenSchema


class PropertyImgRepository(PropertyImgRepoInterface):
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
