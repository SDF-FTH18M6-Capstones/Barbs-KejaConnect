from abc import ABC, abstractmethod


class EmailRepoInterface(ABC):

    @abstractmethod
    def get_by_token(self, token):
        """get email verification token using user_id

        Keyword arguments:
        argument -- description
        Return: return token hash
        """

    @abstractmethod
    def set_token(self, user_id):
        """create email verification token

        Keyword arguments:
        argument -- description
        Return: return token
        """

    @abstractmethod
    def update_token(self, token_id):
        """update token object

        Keyword arguments:
        token_id -- if of token to be updated
        return emailverificationtoken
        """
