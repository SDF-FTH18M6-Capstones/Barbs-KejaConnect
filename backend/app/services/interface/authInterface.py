from abc import ABC


class AuthInterface(ABC):
    def login(self, email, password):
        """login service

        Keyword arguments:
        email  -- email str from client req data
        password  -- password str from client req data
        Return: return user and token or error
        """

    def signup(self, email, phone, role, full_name, password):
        """signup

        Keyword arguments:
        email  -- email str from client req data
        password  -- password str from client req data
        phone -- ***************
        role -- ****************
        full_name -- ************
        Return: return user and token or error
        """
