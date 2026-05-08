from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    sender_name = serializers.SerializerMethodField()
    log_week = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
            'id', 'message', 'is_read',
            'created_at', 'sender_name', 'log_week', 'log'
        ]

    def get_sender_name(self, obj):
        if obj.sender:
            return f'{obj.sender.first_name} {obj.sender.last_name}'
        return 'System'

    def get_log_week(self, obj):
        if obj.log:
            return obj.log.week_number
        return None