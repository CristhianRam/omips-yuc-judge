import os
import smtplib
from email.message import EmailMessage


class EmailDeliveryError(Exception):
    pass


def send_verification_email(
    to_email: str, username: str, code: str, expires_minutes: int
) -> None:
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")
    smtp_from = os.getenv("SMTP_FROM", smtp_user or "")
    normalized_password = smtp_password.replace(" ", "") if smtp_password else None

    if not smtp_user or not normalized_password:
        raise EmailDeliveryError(
            "El servicio de correo no está configurado (SMTP_USER/SMTP_PASSWORD)"
        )

    if not smtp_from:
        raise EmailDeliveryError("No se pudo determinar el remitente del correo")

    msg = EmailMessage()
    msg["Subject"] = "BeeperCode - Verifica tu correo"
    msg["From"] = smtp_from
    msg["To"] = to_email
    msg.set_content(
        (
            f"Hola {username},\n\n"
            "Tu código de verificación es:\n\n"
            f"{code}\n\n"
            f"Este código expira en {expires_minutes} minutos.\n\n"
            "Si no solicitaste esta cuenta, ignora este correo."
        )
    )

    try:
        with smtplib.SMTP(smtp_host, smtp_port, timeout=20) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(smtp_user, normalized_password)
            server.send_message(msg)
    except Exception as exc:  # pragma: no cover
        raise EmailDeliveryError("No se pudo enviar el correo de verificación") from exc
