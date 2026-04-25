from django.urls import path
from apps.logs.views import (
    WeeklyLogListCreateView,
    WeeklyLogDetailView,
    LogSubmitView,
    LogReviewView,
    LogFinalApproveView,
    LogHistoryView,
    WeeklyLogDeleteView
)

urlpatterns = [
    path('', WeeklyLogListCreateView.as_view(), name='log-list'),
    path('<int:pk>/', WeeklyLogDetailView.as_view(), name='log-detail'),
    path('<int:pk>/submit/', LogSubmitView.as_view(), name='log-submit'),
    path('<int:pk>/review/', LogReviewView.as_view(), name='log-review'),
    path('<int:pk>/approve/', LogFinalApproveView.as_view(), name='log-approve'),
    path('<int:pk>/history/', LogHistoryView.as_view(), name='log-history'),
    path('<int:pk>/delete/', WeeklyLogDeleteView.as_view(), name='log-delete'),
]