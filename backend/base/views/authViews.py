from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from base.serializers import UserSerializerWithToken
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from base.serializers import ProfileSerializer


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        sr = UserSerializerWithToken(self.user).data
        for k, v in sr.items():
            data[k] = v

        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(["POST"])
def registerUser(req):
    data = req.data

    try:
        user = User.objects.create(
            username=data["username"],
            email=data["email"],
            password=make_password(data["password"])
        )

        print(user)

        # # Create profile object

        sr = UserSerializerWithToken(user, many=False)
        return Response(sr.data)
    except Exception as e:
        print(e)
        message = {"message": "User found with the same credentials"}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getLoggedInUser(req):
    profile = req.user.profile
    sr = ProfileSerializer(profile, many=False)
    return Response(sr.data)
