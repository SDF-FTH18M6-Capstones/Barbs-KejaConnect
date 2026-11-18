from abc import ABC, abstractmethod


class VerificationDocsInterface(ABC):

    @abstractmethod
    def get_all(self, page, per_page):
        """get all verification documents"""

    @abstractmethod
    def get_user_docs(self, user_id):
        """get current or specific users documents"""

    @abstractmethod
    def get_by_id(self, id):
        """get specific doc by id"""
