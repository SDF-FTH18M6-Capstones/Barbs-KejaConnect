from abc import ABC, abstractmethod


class PropertyImgRepoInterface(ABC):

    @abstractmethod
    def get_image_by_id(self, id):
        """create image by id"""

    @abstractmethod
    def create_property_image(self, ver_doc):
        """create new verificatio docs"""

    @abstractmethod
    def delete_image(self, image):
        """delete property image"""
