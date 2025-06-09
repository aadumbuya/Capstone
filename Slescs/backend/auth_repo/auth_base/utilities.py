from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta

def check_user_activation_status(username, email):
    user = User.objects.filter(username=username)
    if user.exists():
        user = user[0]
        if user.email != email:
            return "This Username Already Exists With A Different Email."
        #check the activation status
        if user.is_active:
            return "is_activated"
        else:
            return "is_not_activated"
    # if User.objects.filter(email=email).exists():
    #     return "This Email already Exists."
    return "user_not_found"
