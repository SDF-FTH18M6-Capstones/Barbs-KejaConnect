from .interface.inquiryInterface import InquiryInterface
from ..repository import InquiriesRepository


class InquiryService(InquiryInterface):
    def __init__(self, inquiry_repo: InquiriesRepository):
        self.inquiry_repo = inquiry_repo
