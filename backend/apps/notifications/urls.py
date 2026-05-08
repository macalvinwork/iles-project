from django.urls import path
from .views import (
    NotificationListView,
    NotificationMarkReadView,
    NotificationMarkAllReadView,
    UnreadCountView
)

urlpatterns = [
    path('', NotificationListView.as_view(), name='notifications'),
    path('unread-count/', UnreadCountView.as_view(), name='unread-count'),
    path('mark-all-read/', NotificationMarkAllReadView.as_view(), name='mark-all-read'),
    path('<int:pk>/read/', NotificationMarkReadView.as_view(), name='mark-read'),
]