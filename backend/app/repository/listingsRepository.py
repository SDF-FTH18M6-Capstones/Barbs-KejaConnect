from .interface.listingsRepoInterface import ListingsRepoInterface
from ..models import Property
from ..exceptions import ResourceNotFoundError, AlreadyExists, DatabasePersistenceError
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from ..config import db


class ListingsRepository(ListingsRepoInterface):
    def get_all(self, page, per_page):
        pagination = Property.query.paginate(page=page, per_page=per_page)
        return pagination

    def get_by_id(self, listing_id):
        listing = Property.query.filter_by(id=listing_id).first()
        if not listing:
            raise ResourceNotFoundError("Could not find resource with that name.")

        return listing

    def update_listing(self, listing_id, update_data):
        try:
            listing: Property = self.get_by_id(listing_id=listing_id)
            for key, value in update_data.items():
                if hasattr(listing, key):
                    setattr(listing, key, value)

            db.session.commit()
            return listing
        except IntegrityError as e:
            db.session.rollback()
            raise AlreadyExists("One or more of your changes is not unique.")
        except SQLAlchemyError as e:
            db.session.rollback()
            raise DatabasePersistenceError("Failed to update the listing.")

    def create_listing(self, listing):
        try:
            db.session.add(listing)
            db.session.commit()
            db.session.refresh()
            return listing
        except IntegrityError as e:
            db.session.rollback()
            raise AlreadyExists(
                "One or more of the information provided is not unique."
            )
        except SQLAlchemyError as e:
            db.session.rollback()
            raise DatabasePersistenceError(f"Failed to upload new listing.")
