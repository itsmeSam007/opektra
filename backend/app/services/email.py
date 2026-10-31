import logging
import smtplib
from email.message import EmailMessage

from app.core.config import settings

logger = logging.getLogger(__name__)


def send_email(*, to: str, subject: str, body: str) -> bool:
    """Send email via SMTP. In dev without SMTP config, log and return True."""
    notify_to = to or settings.NOTIFY_EMAIL or settings.ADMIN_EMAIL
    if not settings.SMTP_HOST:
        logger.info("EMAIL (dev mode) to=%s subject=%s\n%s", notify_to, subject, body)
        return True

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = settings.SMTP_FROM or settings.SMTP_USER
    msg["To"] = notify_to
    msg.set_content(body)

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=15) as server:
            if settings.SMTP_USER:
                server.starttls()
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(msg)
        return True
    except Exception:
        logger.exception("Failed to send email to %s", notify_to)
        return False


def notify_new_contact(name: str, email: str, inquiry_type: str, message: str) -> None:
    subject = f"[FounderOS] New contact: {inquiry_type} from {name}"
    body = f"Name: {name}\nEmail: {email}\nType: {inquiry_type}\n\n{message}"
    send_email(to=settings.NOTIFY_EMAIL, subject=subject, body=body)


def notify_new_inquiry(
    *,
    inquiry_type: str,
    name: str,
    email: str,
    company: str,
    message: str,
    is_acquisition: bool,
) -> None:
    flag = " [ACQUISITION]" if is_acquisition else ""
    subject = f"[FounderOS] New inquiry{flag}: {inquiry_type} — {company}"
    body = f"Type: {inquiry_type}\nName: {name}\nEmail: {email}\nCompany: {company}\n\n{message}"
    send_email(to=settings.NOTIFY_EMAIL, subject=subject, body=body)


def send_newsletter_confirmation(email: str, confirm_url: str) -> None:
    subject = "Confirm your newsletter subscription"
    body = f"Thanks for subscribing. Confirm your email:\n\n{confirm_url}\n\nLink expires in 72 hours."
    send_email(to=email, subject=subject, body=body)
