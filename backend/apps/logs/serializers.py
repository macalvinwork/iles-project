from rest_framework import serializers
from django.utils import timezone
from apps.logs.models import WeeklyLog, LogStatusHistory


class WeeklyLogSerializer(serializers.ModelSerializer):

    class Meta:
        model = WeeklyLog
        fields = '__all__'
        read_only_fields = [
            'student', 'status', 'submitted_at',
            'created_at', 'updated_at'
        ]

    def validate(self, data):
        if self.instance and self.instance.status == WeeklyLog.APPROVED:
            raise serializers.ValidationError(
                'This log is approved and cannot be edited.'
            )
        return data


class LogSubmitSerializer(serializers.Serializer):

    def validate(self, data):
        log = self.context.get('log')

        if log.status != WeeklyLog.DRAFT:
            raise serializers.ValidationError(
                'Only a log in DRAFT status can be submitted.'
            )

        if timezone.now() > log.submission_deadline:
            raise serializers.ValidationError(
                'The submission deadline has passed.'
            )

        if not log.activities.strip():
            raise serializers.ValidationError(
                'Activities field cannot be empty.'
            )

        return data


class LogReviewSerializer(serializers.Serializer):

    action = serializers.ChoiceField(choices=['APPROVE', 'RETURN'])
    comment = serializers.CharField(required=False, allow_blank=True)

    def validate(self, data):
        log = self.context.get('log')
        action = data.get('action')
        comment = data.get('comment', '')

        if log.status != WeeklyLog.SUBMITTED:
            raise serializers.ValidationError(
                'Only a SUBMITTED log can be reviewed.'
            )

        if action == 'RETURN' and not comment.strip():
            raise serializers.ValidationError(
                'A comment is required when returning a log.'
            )

        return data


class LogFinalApproveSerializer(serializers.Serializer):

    def validate(self, data):
        log = self.context.get('log')

        if log.status != WeeklyLog.REVIEWED:
            raise serializers.ValidationError(
                'Only a REVIEWED log can be given final approval.'
            )

        return data


class LogStatusHistorySerializer(serializers.ModelSerializer):

    changed_by_name = serializers.SerializerMethodField()

    class Meta:
        model = LogStatusHistory
        fields = [
            'id', 'previous_status', 'new_status',
            'comment', 'timestamp', 'changed_by_name'
        ]

    def get_changed_by_name(self, obj):
        return f'{obj.changed_by.first_name} {obj.changed_by.last_name}'