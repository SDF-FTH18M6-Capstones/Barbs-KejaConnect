from abc import ABC, abstractmethod


class AuthInterface(ABC):
    @abstractmethod
    def login(self, data):
        """Login

        Keyword arguments:
        data -- user information (passwors and email)
        Return: error or success
        """

    @abstractmethod
    def signup(self, data):
        """sign up

        Keyword arguments:
        data -- user information as dict
        Return: server response
        """
