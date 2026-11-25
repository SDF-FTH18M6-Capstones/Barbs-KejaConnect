from abc import ABC, abstractmethod


class UserRepoInterface(ABC):
    @abstractmethod
    def get_by_email(self, email):
        """Login

        Keyword arguments:
        data -- user information (passwors and email)
        Return: error or success
        """

    @abstractmethod
    def get_by_id(self, id):
        """Login

        Keyword arguments:
        data -- user information (passwors and email)
        Return: error or success
        """

    @abstractmethod
    def create_user(self, user):
        """sign up

        Keyword arguments:
        data -- user information as dict
        Return: server response
        """
