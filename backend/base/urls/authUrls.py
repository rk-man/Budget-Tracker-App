from django.urls import path
from base.views.authViews import MyTokenObtainPairView, registerUser, getLoggedInUser

urlpatterns = [
    path('login/', MyTokenObtainPairView.as_view(), name="login-user"),
    path('register/', registerUser, name="register-user"),
    path("me/", getLoggedInUser, name="logged-in-user")
]
