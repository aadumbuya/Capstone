import uuid

from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class UserProfileImage(models.Model):
    user = models.CharField(max_length=100, unique=True, null=False)
    image = models.FileField(upload_to="uploads/user_profile_images")

