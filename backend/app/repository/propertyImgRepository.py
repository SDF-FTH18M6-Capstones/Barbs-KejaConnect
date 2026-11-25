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
            db.session.commit()
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

    def count_for_listing(self, listing_id):
        return PropertyImage.query.filter_by(property_id=listing_id).count()

    def set_first_as_cover(self, listing_id):
        first = (
            PropertyImage.query.filter_by(property_id=listing_id)
            .order_by(PropertyImage.position)
            .first()
        )
        if first:
            first.is_cover = True
            db.session.commit()

    def delete_image(self, image):
        try:
            db.session.delete(image)
            db.session.commit()
            return True
        except SQLAlchemyError as e:
            db.session.rollback()
            raise DatabasePersistenceError(f"Failed to delete image.:{e}")