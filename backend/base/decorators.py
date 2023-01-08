from base.models import Transaction
from rest_framework.response import Response
from rest_framework import status
from base.models import Profile


def protect(fn):
    def wrapper(req, pk=None):
        profile = req.user.profile
        try:
            curTransaction = Transaction.objects.get(
                id=pk)
            if (curTransaction.owner == profile):
                req.curTransaction = curTransaction
                return fn(req, pk)
            else:
                return Response({"detail": "You aren't authorized to access the data"}, status=status.HTTP_403_FORBIDDEN)

        except Exception as ex:
            print(str(ex))
            if ("valid UUID" in str(ex)):
                return Response({"detail": "Data Doesn't exist"}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({"detail": "Something went wrong"}, status=status.HTTP_400_BAD_REQUEST)

    return wrapper


def userProtect(fn):
    def wrapper(req, pk=None):
        user = req.user
        print(user)
        try:
            curProfile = Profile.objects.get(id=pk)
            if (curProfile.owner == user):
                req.curProfile = curProfile
                return fn(req, pk)
            else:
                return Response({"detail": "You are not authorized to make changes to this data"}, status=status.HTTP_403_FORBIDDEN)

        except Exception as ex:
            print(str(ex))
            if ("valid UUID" in str(ex)):
                return Response({"detail": "User Doesn't exist"}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({"detail": "Something went wrong"}, status=status.HTTP_400_BAD_REQUEST)

    return wrapper
