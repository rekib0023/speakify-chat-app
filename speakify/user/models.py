from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from .managers import CustomUserManager


class CustomUser(AbstractBaseUser, PermissionsMixin):
    full_name = models.CharField(_("full name"), null=False, max_length=120)
    email = models.EmailField(_("email address"), unique=True, max_length=120)
    phone = models.CharField(unique=True, null=False, max_length=12)
    gender = models.CharField(null=False, max_length=120)
    country = models.CharField(null=False, max_length=120)
    is_online = models.BooleanField(default=False)
    connection_id = models.CharField(max_length=120, null=True, default=None)

    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email


class Interests(models.Model):
    name = models.CharField(null=False, max_length=120)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "%s" % self.name

    class Meta:
        ordering = ["-created_at"]


class UserInterests(models.Model):
    user = models.ForeignKey(
        "CustomUser",
        on_delete=models.CASCADE,
        related_name="user_set",
        related_query_name="user_set",
    )
    interest = models.ForeignKey(
        "Interests",
        on_delete=models.CASCADE,
        related_name="interests_set",
        related_query_name="interests_set",
    )
