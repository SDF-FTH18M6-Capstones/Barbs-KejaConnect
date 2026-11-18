class BaseError(Exception):
    pass


class UserNotFoundError(BaseError):
    pass


class ResourceNotFoundError(BaseError):
    pass


class EmailNotVerified(BaseError):
    pass


class EmailVerificationNotSentError(BaseError):
    pass


class AlreadyExists(BaseError):
    pass


class InvalidCredentialsError(BaseError):
    pass


class DatabasePersistenceError(BaseError):
    pass


class FileUploadFailed(BaseError):
    pass
