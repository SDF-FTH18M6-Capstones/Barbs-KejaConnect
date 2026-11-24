from abc import ABC, abstractmethod


class ListingsInterface(ABC):
    @abstractmethod
    def get_all_listings(self, page, per_page):
        """retrieive all listings"""

    @abstractmethod
    def create_listing(self, listing):
        """create new listing"""

    @abstractmethod
    def get_by_id(self, listing_id):
        """get specific listing by id"""

    @abstractmethod
    def update_listing(self, listing_id, update_data):
        """update specific listing"""
