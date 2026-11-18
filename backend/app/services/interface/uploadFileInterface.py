from abc import ABC, abstractmethod


class UploadFilesInterface(ABC):

    @abstractmethod
    def upload_file(self, file, type):
        """upload file to cloud"""

    @abstractmethod
    def upload_verification_doc(self, file):
        """Upload verification document"""
