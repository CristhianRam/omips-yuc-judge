"""
@file backend/judge/app/services/email_services.py
@description Servicios de negocio del backend Judge.
@symbols EmailDeliveryError, send_verification_email, send_password_reset_email
"""

import os
import smtplib
from email.message import EmailMessage


class EmailDeliveryError(Exception):
    pass


def _get_smtp_settings() -> tuple[str, int, str, str, str]:
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")
    smtp_from = os.getenv("SMTP_FROM", smtp_user or "")
    normalized_password = smtp_password.replace(" ", "") if smtp_password else None

    if not smtp_user or not normalized_password:
        raise EmailDeliveryError(
            "El servicio de correo no esta configurado (SMTP_USER/SMTP_PASSWORD)"
        )

    if not smtp_from:
        raise EmailDeliveryError("No se pudo determinar el remitente del correo")

    return smtp_host, smtp_port, smtp_user, normalized_password, smtp_from


def _send_email(*, to_email: str, subject: str, body: str) -> None:
    smtp_host, smtp_port, smtp_user, smtp_password, smtp_from = _get_smtp_settings()

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = smtp_from
    msg["To"] = to_email
    msg.set_content(body)

    try:
        with smtplib.SMTP(smtp_host, smtp_port, timeout=20) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(smtp_user, smtp_password)
            server.send_message(msg)
    except Exception as exc:  # pragma: no cover
        raise EmailDeliveryError("No se pudo enviar el correo") from exc


def send_verification_email(
    to_email: str, username: str, code: str, expires_minutes: int
) -> None:
    body = (
        f"Hola {username},\n\n"
        "Tu codigo de verificacion es:\n\n"
        f"{code}\n\n"
        f"Este codigo expira en {expires_minutes} minutos.\n\n"
        "Si no solicitaste esta cuenta, ignora este correo."
    )
    _send_email(
        to_email=to_email,
        subject="BeeperCode - Verifica tu correo",
        body=body,
    )


def send_password_reset_email(
    to_email: str, username: str, code: str, expires_minutes: int
) -> None:
    body = (
        f"Hola {username},\n\n"
        "Recibimos una solicitud para restablecer tu contrasena.\n"
        "Tu codigo de recuperacion es:\n\n"
        f"{code}\n\n"
        f"Este codigo expira en {expires_minutes} minutos.\n\n"
        "Si no solicitaste este cambio, ignora este correo."
    )
    _send_email(
        to_email=to_email,
        subject="BeeperCode - Restablece tu contrasena",
        body=body,
    )
