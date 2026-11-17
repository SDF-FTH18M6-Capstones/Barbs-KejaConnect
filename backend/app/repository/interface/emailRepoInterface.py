from abc import ABC, abstractmethod


class EmailRepoInterface(ABC):

    @abstractmethod
    def get_by_id(self, user_id):
        """get email verification token using user_id

        Keyword arguments:
        argument -- description
        Return: return token hash
        """

    @abstractmethod
    def set_token(self):
        """create email verification token

        Keyword arguments:
        argument -- description
        Return: return token
        """
