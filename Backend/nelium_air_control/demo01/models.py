
# Create your models here.

from enum import unique
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator

class Gestora(models.Model):
    name = models.CharField(max_length=30, null=None)
    cif = models.CharField(max_length=9, null=None)
    adress = models.CharField(max_length=50, null=None)
    contact = models.EmailField(max_length=45, unique=True)

    def __str__(self):
        return self.name


class Usuario(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    gestora = models.ForeignKey(Gestora, related_name='usuarios', on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username


class Casa(models.Model):
    name = models.CharField(max_length=50, null=None)
    adress = models.CharField(max_length=50, null=None)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, validators=[
                                  MinValueValidator(-90), MaxValueValidator(90)],null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, validators=[
                                   MinValueValidator(-180), MaxValueValidator(180)],null=True)
    owner = models.CharField(max_length=30, null=None)
    gestora = models.ForeignKey(Gestora, related_name='casas', on_delete=models.CASCADE)

    def __str__(self):
        return self.name + ', ' + self.adress


class Device(models.Model):
    id = models.AutoField(primary_key=True, unique=True)
    deviceId = models.CharField(max_length=12, null=None)
    online = models.BooleanField(null=True)
    versions = models.CharField(max_length=30, null=None)
    casa = models.ForeignKey(Casa, related_name='devices', on_delete=models.CASCADE)

    def __str__(self):
        return (str(self.deviceId) + ' ' + self.versions)
