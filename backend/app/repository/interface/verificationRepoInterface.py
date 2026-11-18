from abc import ABC, abstractmethod


class VerificationRepoInterface(ABC):

    @abstractmethod
    def get_all(self, page, per_page):
        """get all ver docs peginated"""

    @abstractmethod
    def get_by_id(self, doc_id):
        """get document by id"""

    @abstractmethod
    def get_by_user(self, user_id):
        """get all verification docs belonging to user"""

    @abstractmethod
    def add_document(self, ver_doc):
        """create new verificatio docs"""

    @abstractmethod
    def delete(self, doc_id):
        """delete document"""
