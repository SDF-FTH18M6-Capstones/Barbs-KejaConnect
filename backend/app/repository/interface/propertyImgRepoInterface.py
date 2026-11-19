from abc import ABC, abstractmethod


class PropertyImgRepoInterface(ABC):

    @abstractmethod
    def create_property_image(self, ver_doc):
        """create new verificatio docs"""
