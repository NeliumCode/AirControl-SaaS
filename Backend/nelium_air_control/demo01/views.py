# Create your views here.

#from rest_framework import authentication, permissions
from rest_framework import generics

from influxdb_client import InfluxDBClient
from rest_framework.response import Response
from rest_framework.decorators import api_view
# from rest_framework.decorators import authentication_classes, permission_classes
# from django.http import JsonResponse
# import json

from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User

from .permissions import IsSuperuserPermission
from .models import Gestora, Usuario, Casa, Device
from .serializers import GestoraSerializer, UsuarioSerializer, CasaSerializer, DeviceSerializer


''' PYTHON INFLUXDBCLIENT GET REQUESTS '''

client = InfluxDBClient(url="http://influxdb:8086", 
                        token="81ee5cb702a05aa5b3974291c834b24caab1f5a64d5f356c95e54a8857bf345c", 
                        org="AirControl_Nelium")

@api_view(["GET"])
# @authentication_classes([authentication.SessionAuthentication, authentication.TokenAuthentication])
def get_influxdb_data(request, deviceID):

    bucket = "AC_sensors"

    parameters = {
    "_bucket": bucket,
    "_deviceId": deviceID # Este deviceID vendrá dado por la API /casaDetailsUser/<int:pk>, la cual solo es accesible
                          # por el usuario que pertenezca a la gestora de dicha casa, esto hace que 
                          # ya haya una capa de seguridad aplicada para poder acceder al deviceID.
}

    # Query for retrieving all temps of sensor 1 for last 24 hours
    query = '''
            from(bucket: _bucket)\
            |> range(start: -24h)\
            |> filter(fn: (r) => r["deviceID"] == _deviceId)\
            |> filter(fn: (r) => r["_field"] == "temp")\
            '''

    # Query for retrieving average temp of sensor 1 for last 24 hours
    # query = '''
    #         from(bucket: _bucket)\
    #         |> range(start: -24h)\
    #         |> filter(fn: (r) => r["deviceID"] == _deviceId)\
    #         |> filter(fn: (r) => r["_field"] == "temp")\
    #         |> filter(fn: (r) => r["host"] == "bd43e1bd41b6")\
    #         |> aggregateWindow(every: 1d, fn: mean)\
    #         |> fill(value: 0.0)
    #         '''
    
    # Query for retrieving max temp of sensor 1 for last 24 hours
    # query = '''
    #         from(bucket: _bucket)\
    #         |> range(start: -24h)\
    #         |> filter(fn: (r) => r["deviceID"] == _deviceId)\
    #         |> filter(fn: (r) => r["_field"] == "temp")\
    #         |> filter(fn: (r) => r["host"] == "bd43e1bd41b6")\
    #         |> aggregateWindow(every: 1d, fn: max)\
    #         |> fill(value: 0.0)
    #         '''
    
    # Query for retrieving min temp of sensor 1 for last 24 hours
    # query = '''
    #         from(bucket: _bucket)\
    #         |> range(start: -24h)\
    #         |> filter(fn: (r) => r["deviceID"] == _deviceId)\
    #         |> filter(fn: (r) => r["_field"] == "temp")\
    #         |> filter(fn: (r) => r["host"] == "bd43e1bd41b6")\
    #         |> aggregateWindow(every: 1d, fn: min)\
    #         |> fill(value: 0.0)
    #         '''

    # Query for retrieving last current temp of sensor 1 for 24 hours range
    # query = '''
    #         from(bucket: _bucket)\
    #         |> range(start: -24h)\
    #         |> filter(fn: (r) => r["deviceID"] == _deviceId)\
    #         |> filter(fn: (r) => r["_field"] == "temp")\
    #         |> filter(fn: (r) => r["host"] == "bd43e1bd41b6")\
    #         |> aggregateWindow(every: 1d, fn: last)\
    #         |> fill(value: 0.0)
    #         '''

    # Query for retrieving first temp of sensor 1 for 24 hours range
    # query = '''
    #         from(bucket: _bucket)\
    #         |> range(start: -24h)\
    #         |> filter(fn: (r) => r["deviceID"] == _deviceId)\
    #         |> filter(fn: (r) => r["_field"] == "temp")\
    #         |> filter(fn: (r) => r["host"] == "bd43e1bd41b6")\
    #         |> aggregateWindow(every: 1d, fn: first)\
    #         |> fill(value: 0.0)
    #         '''


    result = client.query_api().query(org="AirControl_Nelium", query=query, params=parameters)
    texto = {
        "text":"No data retrieved for last 24 hours."
    }
    results = []

    if(result):
        for table in result:
            for record in table.records:
                results.append((record.get_value(), record.get_field()))

        # Method to convert List of Tuples to JSON (Does not allow duplicated values as it uses Python Dictionaries)
        # jsonResults = json.dumps(results) 
        
        # Correct method to parse List of Tuples to JSON (It also might have worked just replacing '()' for '{}')
        jsonResults = [{r[1]: r[0]} for r in results]
        print(jsonResults)

        return Response(jsonResults)

    else:

        return Response(texto)
    # return JSONResponse(result, safe=False)


''' SPECIFIC USERS LIST API VIEW '''

# Method with more granularity implied (it let's you do more things)
# @api_view(["GET"])
# @authentication_classes([authentication.SessionAuthentication, authentication.TokenAuthentication])
# @permission_classes([permissions.IsAuthenticated])
# def listCasasPerUser(request, *args, **kwargs):

#     currentUser = get_object_or_404(User, pk=request.user.pk)
#     usuarioActual = Usuario.objects.get(user=currentUser)
#     print(usuarioActual)

#     gestoraUser = Gestora.objects.get(usuarios=usuarioActual)
#     print(gestoraUser)

#     instance = Casa.objects.filter(gestora=gestoraUser)
#     print(instance)

#     for c in instance:
#         data = CasaSerializer(c).data
#         print(data)

#     # data={
#     #     "text":"Hola Mundo",
#     #     "type":"Prueba"
#     # }

#       return Response(data)

#################################################################################################################

class CasasPerUserListAPIView(generics.ListAPIView):
    serializer_class = CasaSerializer
    # authentication_classes = [authentication.SessionAuthentication, authentication.TokenAuthentication]

    def get_queryset(self):
        currentUser = get_object_or_404(User, pk=self.request.user.pk)
        usuarioActual = Usuario.objects.get(user=currentUser)
        gestoraUser = Gestora.objects.get(usuarios=usuarioActual)
        queryset = Casa.objects.filter(gestora=gestoraUser)
        return queryset


''' SPECIFIC USERS DETAILS API VIEW '''

class CasaDetailsPerUserAPIView(generics.RetrieveAPIView):
    serializer_class = CasaSerializer
    # authentication_classes = [authentication.SessionAuthentication, authentication.TokenAuthentication]

    def get_queryset(self):
        currentUser = get_object_or_404(User, pk=self.request.user.pk)
        usuarioActual = Usuario.objects.get(user=currentUser)
        gestoraUser = Gestora.objects.get(usuarios=usuarioActual)
        queryset = Casa.objects.filter(gestora=gestoraUser)
        return queryset


''' ADMIN LIST API VIEWS '''

class AllGestorasListAPIView(generics.ListAPIView):
    queryset = Gestora.objects.all()
    serializer_class = GestoraSerializer
    # authentication_classes = [authentication.SessionAuthentication, authentication.TokenAuthentication]
    permission_classes = [IsSuperuserPermission]

class AllUsuariosListAPIView(generics.ListAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    # authentication_classes = [authentication.SessionAuthentication, authentication.TokenAuthentication]
    permission_classes = [IsSuperuserPermission]

class AllCasasListAPIView(generics.ListAPIView):
    queryset = Casa.objects.all()
    serializer_class = CasaSerializer
    # authentication_classes = [authentication.SessionAuthentication, authentication.TokenAuthentication]
    permission_classes = [IsSuperuserPermission]

class AllDevicesListAPIView(generics.ListAPIView):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer
    # authentication_classes = [authentication.SessionAuthentication, authentication.TokenAuthentication]
    permission_classes = [IsSuperuserPermission]


''' ADMIN DETAILS API VIEW '''

class AllGestoraDetailsAPIView(generics.RetrieveAPIView):
    queryset = Gestora.objects.all()
    serializer_class = GestoraSerializer
    # authentication_classes = [authentication.SessionAuthentication, authentication.TokenAuthentication]
    permission_classes = [IsSuperuserPermission]

class AllUsuarioDetailsAPIView(generics.RetrieveAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    # authentication_classes = [authentication.SessionAuthentication, authentication.TokenAuthentication]
    permission_classes = [IsSuperuserPermission]

class AllCasaDetailsAPIView(generics.RetrieveAPIView):
    queryset = Casa.objects.all()
    serializer_class = CasaSerializer
    # authentication_classes = [authentication.SessionAuthentication, authentication.TokenAuthentication]
    permission_classes = [IsSuperuserPermission]

class AllDeviceDetailsAPIView(generics.RetrieveAPIView):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer
    # authentication_classes = [authentication.SessionAuthentication, authentication.TokenAuthentication]
    permission_classes = [IsSuperuserPermission]