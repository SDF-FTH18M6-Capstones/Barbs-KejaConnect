from abc import ABC


class AuthInterface(ABC):
    def login(self, email, password):
        """login service

        Keyword arguments:
        email  -- email str from client req data
        password  -- password str from client req data
        Return: return user and token or error
        """

    def signup(self, data):
        """signup

        Keyword arguments:
        data -- dict from client request
        Return: user or error
        """
