from django.urls import path

from .views import (
    InterestsListView,
    LoginView,
    OnlineStatusView,
    RegisterView,
    UserDetailView,
)

urlpatterns = [
    path("register", RegisterView.as_view(), name="sign_up"),
    path("login", LoginView.as_view(), name="login"),
    path("me", UserDetailView.as_view(), name="user_detail"),
    path("interests", InterestsListView.as_view(), name="interest_list"),
    path("online-status", OnlineStatusView.as_view(), name="online_status"),
]
