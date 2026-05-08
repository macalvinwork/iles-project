from django.db import models
from apps.users.models import CustomUser
from apps.logs.models import WeeklyLog


class Notification(models.Model):
    recipient = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    sender = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='sent_notifications',
        null=True, blank=True
    )
    log = models.ForeignKey(
        WeeklyLog,
        on_delete=models.CASCADE,
        related_name='notifications',
        null=True, blank=True
    )
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'To: {self.recipient.email} | {self.message[:50]}'