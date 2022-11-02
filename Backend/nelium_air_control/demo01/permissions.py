# permissions.py

from rest_framework import permissions


class IsSuperuserPermission(permissions.DjangoModelPermissions):
    def has_permission(self, request, view):
        user = request.user
    
        if user.is_superuser:
            return True

        return False