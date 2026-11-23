from abc import ABC, abstractmethod


class AdminStatsRepoInterface(ABC):
    @abstractmethod
    def get_users(self, page, perpage):
        """get all users"""

    @abstractmethod
    def get_listings(self, page, perpage):
        """get all listings"""

    @abstractmethod
    def get_inquiries(self, page, perpage):
        """get all inquiries"""

    @abstractmethod
    def get_approvals(self):
        """get all aprovals by user"""
