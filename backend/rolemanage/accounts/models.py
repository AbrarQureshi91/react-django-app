from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.


class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Administration'),
        ('student', 'Student'),
        ('teacher', 'Teacher'),
        ('clerk', 'Clerk'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

