import os
from sendgrid.helpers.mail import Mail
from ..exceptions import (
    EmailVerificationNotSentError,
)
from ..config import sg

BACKEND_URL = os.getenv("BACKEND_URL", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", "")


def send_email(email_to, subject, html_content):
    message = Mail(
        from_email=FROM_EMAIL,
        to_emails=email_to,
        subject=subject,
        html_content=html_content,
    )

    try:
        res = sg.send(message)
        if res.status_code not in (200, 201, 202):
            raise EmailVerificationNotSentError("Failed to send email.")
        return True
    except Exception as e:
        return False
