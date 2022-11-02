# Register your models here.

from django.contrib import admin
from .models import Gestora, Usuario, Casa, Device

admin.site.register(Gestora)
admin.site.register(Usuario)
admin.site.register(Casa)
admin.site.register(Device)