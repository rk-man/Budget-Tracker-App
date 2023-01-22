from django.urls import path, include
from base.views.userViews import getAllUsers, searchUsers, getSingleUser, updateUser

urlpatterns = [
    path("friends/", include("base.urls.friendUrls")),
    path("search/<str:query>/", searchUsers, name="search-users"),
    path("", getAllUsers, name="all-users"),
    path("<str:pk>/", getSingleUser, name="single-user"),
    path("<str:pk>/update/", updateUser, name="update-user")
]
