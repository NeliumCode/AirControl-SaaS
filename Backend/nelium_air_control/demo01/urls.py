#urls.py

from django.urls import path
from . import views
# from rest_framework.authtoken.views import obtain_auth_token


#/api/v1/
urlpatterns = [

    # ''' AUTH TOKEN URLS ''' #

    # path('auth', obtain_auth_token),


    # ''' INFLUXDB PYTHON CLIENT URLS ''' #

    path('influxRequest/<str:deviceID>', views.get_influxdb_data),


    # ''' SPECIFIC USERS LIST URLS ''' #

    # path('casas', views.listCasasPerUser)
    path('casasUser', views.CasasPerUserListAPIView.as_view()),


    # ''' SPECIFIC USERS DETAILS URLS ''' #

    path('casaDetailsUser/<int:pk>', views.CasaDetailsPerUserAPIView.as_view()),


    # ''' ADMIN LIST URLS ''' #

    path('gestorasAdmin', views.AllGestorasListAPIView.as_view()),
    path('usuariosAdmin', views.AllUsuariosListAPIView.as_view()),
    path('casasAdmin', views.AllCasasListAPIView.as_view()),
    path('devicesAdmin', views.AllDevicesListAPIView.as_view()),


    # ''' ADMIN DETAILS URLS ''' #

    path('gestoraDetailsAdmin/<int:pk>', views.AllGestoraDetailsAPIView.as_view()),
    path('usuarioDetailsAdmin/<int:pk>', views.AllUsuarioDetailsAPIView.as_view()),
    path('casaDetailsAdmin/<int:pk>', views.AllCasaDetailsAPIView.as_view()),
    path('deviceDetailsAdmin/<int:pk>', views.AllDeviceDetailsAPIView.as_view())

]