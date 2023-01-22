from django.urls import path
from base.views.friendViews import sendFriendRequest, getAllFriendRequests, updateFriendRequest, getAllFriends, getAllAcceptedAndNonAcceptedFriends

urlpatterns = [
    path("", getAllFriends, name="all-friends"),
    path("all-friends/", getAllAcceptedAndNonAcceptedFriends,
         name="all-friends-accepted-non-accepeted"),
    path("<str:pk>/request/", sendFriendRequest, name="send-friend-request"),
    path("pending-requests/", getAllFriendRequests, name="all-friend-requests"),
    path("requests/<str:pk>/update/", updateFriendRequest,
         name="update-friend-request"),
]
