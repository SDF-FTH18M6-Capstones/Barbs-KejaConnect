from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from ..exceptions import AlreadyExists, DatabasePersistenceError, UserNotFoundError
from ..config import db
from .interface.userRepoInterface import UserRepoInterface
from ..models import User


class UserRepo(UserRepoInterface):
    def get_by_email(self, email):
        return User.query.filter_by(email=email).first()

    def create_user(self, user: User):
        try:
            db.session.add(user)
            db.session.commit()
            db.session.refresh(user)
            return user
        except IntegrityError:
            db.session.rollback()
            raise AlreadyExists("A user with that email or phonenumber already exists.")
        except SQLAlchemyError as e:
            db.session.rollback()
            raise DatabasePersistenceError("Failed to save user to the database.")

    def update_user(self, user_id: User, update_data: dict):
        user = User.query.filter_by(id=user_id).first()

        if not user:
            raise UserNotFoundError("That user doesn not exist.")

        try:
            for key, value in update_data.items():
                if hasattr(user, key):
                    setattr(user, key, value)

            db.session.commit()
            return user

        except IntegrityError as e:
            db.session.rollback()
            raise AlreadyExists("One or more of your changes is not unique.")
        except SQLAlchemyError as e:
            db.session.rollback()
            raise DatabasePersistenceError("Failed to update the user.")
