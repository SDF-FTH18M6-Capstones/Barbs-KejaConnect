import os
from sendgrid import SendGridAPIClient

SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY", "")
sg = SendGridAPIClient(SENDGRID_API_KEY)
