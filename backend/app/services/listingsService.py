from flask_jwt_extended import get_jwt_identity
from ..repository import ListingsRepository, UserRepo
from .interface.listingInterface import ListingsInterface
from datetime import datetime, timezone


class ListingsService(ListingsInterface):
    def __init__(self, listing_repo: ListingsRepository, user_repo: UserRepo):
        self.listing_repo = listing_repo
        self.user_repo = user_repo

    def get_all_listings(self, page, per_page):
        return self.listing_repo.get_all(page=page, per_page=per_page)

    def get_by_id(self, listing_id):
        return self.listing_repo.get_by_id(listing_id=listing_id)

    def create_listing(self, listing):
        return self.listing_repo.create_listing(listing=listing)

    def update_listing(self, listing_id, update_data):
        return self.update_listing(listing_id=listing_id, update_data=update_data)
