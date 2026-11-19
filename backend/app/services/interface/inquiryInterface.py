from abc import ABC, abstractmethod


class InquiryInterface(ABC):
    @abstractmethod
    def make_inquiry(self, message, id):
        """create inquiry and send email"""

    @abstractmethod
    def received_inquiries(self):
        """received inquiries"""
