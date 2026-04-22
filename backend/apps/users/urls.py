from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from apps.users.views import LoginView, RegisterView, UserListView, DashboardView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('token/', LoginView.as_view(), name='token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
]