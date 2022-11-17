# serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Gestora, Usuario, Casa, Device

class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = ['id', 'deviceId', 'online', 'versions']


class CasaSerializer(serializers.ModelSerializer):
    devices = DeviceSerializer(many=True, read_only=True)

    class Meta:
        model = Casa
        fields = ['id', 'name', 'adress', 'latitude', 'longitude', 'owner', 'devices']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email')


class UsuarioSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Usuario
        fields = ['id', 'user']


class GestoraSerializer(serializers.ModelSerializer):
    casas = CasaSerializer(many=True, read_only=True)
    usuarios = UsuarioSerializer(many=True, read_only=True)

    class Meta:
        model = Gestora
        fields = ['id', 'name', 'cif', 'adress', 'contact', 'usuarios', 'casas']