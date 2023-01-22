
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from base.models import Profile, Friend
from base.serializers import FriendSerializer
from rest_framework import status
from django.db.models import Q


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def sendFriendRequest(req, pk):
    profile = req.user.profile
    to_be_friend = Profile.objects.get(id=pk)
    try:
        friend = Friend.objects.create(
            sender=profile,
            friend=to_be_friend
        )
        sr = FriendSerializer(friend, many=False)
        return Response(sr.data)
    except Exception as ex:
        print(ex)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getAllFriendRequests(req):
    profile = req.user.profile
    try:
        friend = Friend.objects.filter(friend=profile)
        sr = FriendSerializer(friend, many=True)
        return Response(sr.data)
    except Exception as ex:
        print(ex)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def updateFriendRequest(req, pk):
    profile = req.user.profile
    data = req.data
    try:
        friend = Friend.objects.get(id=pk)
        if (friend.friend != profile):
            return Response({"detail": "Sorry you aren't authorized to perform this action"}, status=status.HTTP_403_FORBIDDEN)

        if (data.get("message", "") == "accepted"):
            friend.status = True
            friend.save()
            sr = FriendSerializer(friend, many=False)
            return Response(sr.data)
        elif (data.get("message", "") == "declined"):
            friend.delete()
            return Response({"detail": "Data has been successfully deleted"}, status=status.HTTP_204_NO_CONTENT)

    except Exception as ex:
        print(ex)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getAllFriends(req):
    profile = req.user.profile
    try:
        friends = Friend.objects.filter(
            Q(friend=profile) | Q(sender=profile)).filter(status=True)
        sr = FriendSerializer(friends, many=True)
        return Response(sr.data)
    except Exception as ex:
        print(ex)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getAllAcceptedAndNonAcceptedFriends(req):
    profile = req.user.profile
    try:
        friends = Friend.objects.filter(
            Q(friend=profile) | Q(sender=profile))
        sr = FriendSerializer(friends, many=True)
        return Response(sr.data)
    except Exception as ex:
        print(ex)
