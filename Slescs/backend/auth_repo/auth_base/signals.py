from django.dispatch import receiver
from django.urls import reverse
from django_rest_passwordreset.signals import reset_password_token_created
from django.core.mail import send_mail
from django.conf import settings


@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    """
    Handles password reset tokens
    When a token is created, an e-mail needs to be sent to the user
    :param sender: View Class that sent the signal
    :param instance: View Instance that sent the signal
    :param reset_password_token: Token Model Object
    :param args:
    :param kwargs:
    :return:
    """
    # Construct the reset password URL
    reset_password_url = "{}?token={}".format(
        instance.request.build_absolute_uri(reverse('password_reset:reset-password-confirm')),
        reset_password_token.key
    )

    # Compose the email message
    email_message = f"Click this link to reset your password: {reset_password_url}"

    # Send the email
    send_mail(
        subject="Password Reset",
        message=email_message,
        from_email=settings.EMAIL_FROM,  # Change this to your sender email address
        recipient_list=[reset_password_token.user.email],
    )
