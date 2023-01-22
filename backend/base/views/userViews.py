from base.models import Profile, Friend
from base.serializers import ProfileSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from base.decorators import userProtect
from base.utils import decode_base64_file
from django.db.models import Q

# admin route


@api_view(["GET"])
# @permission_classes([IsAdminUser])
def getAllUsers(req):
    users = Profile.objects.all()
    sr = ProfileSerializer(users, many=True)
    return Response(sr.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def searchUsers(req, query):
    users = []
    updatedQuery = query.strip()

    try:
        users = Profile.objects.filter(
            username=updatedQuery)

        if (not users):
            users = Profile.objects.filter(email=updatedQuery)

        if (not users):
            users = Profile.objects.filter(phoneNo=updatedQuery)
            print(users)

        user = users.first()

        if (user and user.id != req.user.profile.id):
            isFriend = "non-friend"
            friends = Friend.objects.filter(
                Q(friend=req.user.profile) | Q(sender=req.user.profile))
            print(friends)
            for f in friends:
                if (f.sender.id == user.id or f.friend.id == user.id):
                    if (f.status):
                        isFriend = "friend"
                    else:
                        isFriend = "pending"

            sr = ProfileSerializer(user, many=False)
            return Response({
                "user": sr.data,
                "isFriend": isFriend
            })
        else:
            return Response({})

    except Exception as ex:
        print(ex)
        pass


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getSingleUser(req, pk):
    user = None
    try:
        user = Profile.objects.get(id=pk)

        sr = ProfileSerializer(user, many=False)
        return Response(sr.data)

    except Exception as ex:
        print(ex)
        pass


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
@userProtect
def updateUser(req, pk):
    profile = None
    data = req.data
    try:
        profile = Profile.objects.get(id=pk)
        profile.username = data.get("username", profile.username)
        profile.name = data.get('name', profile.name)
        profile.email = data.get("email", profile.email)
        profile.phoneNo = data.get("phoneNo", profile.phoneNo)

        pImage = data.get("profileImage", profile.profileImage)
        profile.profileImage = decode_base64_file(pImage)

        profile.save()

        sr = ProfileSerializer(profile, many=False)
        return Response(sr.data)

    except Exception as ex:
        print(ex)
        pass
