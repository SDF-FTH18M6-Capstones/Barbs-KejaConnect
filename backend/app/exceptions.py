class BaseError(Exception):
    pass


class UserNotFoundError(BaseError):
    pass


class EmailNotVerified(BaseError):
    pass


class InvalidCredentialsError(BaseError):
    pass
