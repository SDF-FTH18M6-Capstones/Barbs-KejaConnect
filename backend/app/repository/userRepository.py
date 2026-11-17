from .interface.userRepoInterface import UserRepoInterface
from ..models import User


class UserRepo(UserRepoInterface):
    def __init__(self):
        pass

    def get_by_email(self, email):
        return User.query.filter_by(email=email).first()

    def create_user(self, data):
        pass
