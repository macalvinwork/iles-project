from rest_framework import serializers
from django.utils import timezone
from apps.logs.models import WeeklyLog, LogStatusHistory


class WeeklyLogSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()

    class Meta:
        model = WeeklyLog
        fields = '__all__'
        read_only_fields = [
            'student', 'status', 'submitted_at', 'created_at', 'updated_at',
            'supervisor_rating', 'supervisor_feedback', 'supervisor_signed_off_at',
            'academic_grade', 'academic_comments', 'academic_evaluated_at'
        ]

    def get_student_name(self, obj):
        return f'{obj.student.first_name} {obj.student.last_name}'

    def validate(self, data):
        if self.instance and self.instance.status not in [WeeklyLog.DRAFT, WeeklyLog.RETURNED]:
            raise serializers.ValidationError(
                'This log cannot be edited in its current status.'
            )
        return data


class LogSubmitSerializer(serializers.Serializer):
    def validate(self, data):
        log = self.context.get('log')
        if log.status not in [WeeklyLog.DRAFT, WeeklyLog.RETURNED]:
            raise serializers.ValidationError('Only a DRAFT or RETURNED log can be submitted.')
        if not log.activities.strip():
            raise serializers.ValidationError('Activities field cannot be empty.')
        return data


class LogWorkApprovalSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=['APPROVE', 'RETURN'])
    rating = serializers.IntegerField(min_value=1, max_value=5, required=False)
    feedback = serializers.CharField(required=False, allow_blank=True)

    def validate(self, data):
        log = self.context.get('log')
        if log.status != WeeklyLog.PENDING_WORK_APPROVAL:
            raise serializers.ValidationError('Log must be in PENDING_WORK_APPROVAL status.')
        if data.get('action') == 'APPROVE' and not data.get('rating'):
            raise serializers.ValidationError('Rating is required when approving.')
        if data.get('action') == 'RETURN' and not data.get('feedback', '').strip():
            raise serializers.ValidationError('Feedback is required when returning.')
        return data


class LogAcademicEvaluationSerializer(serializers.Serializer):
    grade = serializers.CharField(max_length=10)
    comments = serializers.CharField(required=False, allow_blank=True)

    def validate(self, data):
        log = self.context.get('log')
        if log.status != WeeklyLog.PENDING_ACADEMIC_EVALUATION:
            raise serializers.ValidationError('Log must be in PENDING_ACADEMIC_EVALUATION status.')
        return data


class LogStatusHistorySerializer(serializers.ModelSerializer):
    changed_by_name = serializers.SerializerMethodField()

    class Meta:
        model = LogStatusHistory
        fields = ['id', 'previous_status', 'new_status', 'comment', 'timestamp', 'changed_by_name']

    def get_changed_by_name(self, obj):
        return f'{obj.changed_by.first_name} {obj.changed_by.last_name}'