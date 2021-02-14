from django.urls import path

from .views import (
    AddToLog,
    CreateUser,
    DeleteLogItem,
    ForgotPassord,
    GetLog,
    GetNutrients,
    GetRecipes,
    InstantSearch,
    LogoutAndBlacklistRefreshTokenForUserView,
    SendContactEmail,
    SetNewPassword,
    UpdateProfile,
    UpdateUserdata,
    UserProfile,
    ObtainTokenPairWithIdView,
)
from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
    path("nutrients", GetNutrients.as_view()),
    path("recipes", GetRecipes.as_view()),
    path("instant", InstantSearch.as_view()),
    path("add-to-log", AddToLog.as_view()),
    path("contact", SendContactEmail.as_view()),
    path("log", GetLog.as_view()),
    path("delete-log-item", DeleteLogItem.as_view()),
    path("profile", UserProfile.as_view()),
    path("profile/update", UpdateProfile.as_view()),
    path("user/create/", CreateUser.as_view(), name="create_user"),
    path("user/update", UpdateUserdata.as_view()),
    path("user/forgot-password", ForgotPassord.as_view()),
    path("user/new-password", SetNewPassword.as_view()),
    path("token/obtain/", ObtainTokenPairWithIdView.as_view(), name="token_create"),
    path("token/refresh/", jwt_views.TokenRefreshView.as_view(), name="token_refresh"),
    path("blacklist/", LogoutAndBlacklistRefreshTokenForUserView.as_view(), name="blacklist"),
]
