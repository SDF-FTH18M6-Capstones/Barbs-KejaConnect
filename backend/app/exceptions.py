class BaseError(Exception):
    pass


class UserNotFoundError(BaseError):
    pass


class EmailNotVerified(BaseError):
    pass


class AlreadyExists(BaseError):
    pass


class InvalidCredentialsError(BaseError):
    pass


class DatabasePersistenceError(BaseError):
    pass
