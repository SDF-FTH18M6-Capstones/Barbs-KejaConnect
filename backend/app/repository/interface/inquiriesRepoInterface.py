from abc import ABC, abstractmethod


class InquiriesRepoInterface(ABC):
    @abstractmethod
    def create_inquiry(self, inquiry):
        """Create new inquiry"""

    @abstractmethod
    def get_poster_inquiries(self, poster_id, page, per_page):
        """get all inquirires for properties of a specific poster"""

    @abstractmethod
    def get_sent_inquiries(self, user_id):
        """get all inquiries a specific user has sent"""
