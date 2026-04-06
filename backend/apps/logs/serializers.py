from rest_framework import serializers
from django.utils import timezone
from apps.logs.models import WeeklyLog, LogStatusHistory


class WeeklyLogSerializer(serializers.ModelSerializer):

    student_name = serializers.SerializerMethodField()
    student_email = serializers.SerializerMethodField()
    placement_company = serializers.SerializerMethodField()


    class Meta:
        model = WeeklyLog
        fields = '__all__'
        read_only_fields = [
            'student', 'status', 'submitted_at', 'resubmitted_at',
            'created_at', 'updated_at',
            'supervisor_rating', 'supervisor_feedback',
            'supervisor_rejection_reason', 'supervisor_signed_off_at',
            'academic_grade', 'academic_comments', 'academic_evaluated_at'
        ]

    def get_student_name(self, obj):
        return f'{obj.student.first_name} {obj.student.last_name}'

    def get_student_email(self, obj):
        return obj.student.email

    def get_placement_company(self, obj):
        return obj.placement.company_name if obj.placement else None

    def validate(self, data):
        if self.instance and self.instance.status not in [
            WeeklyLog.DRAFT, WeeklyLog.RETURNED
        ]:
            raise serializers.ValidationError(
                'This log cannot be edited in its current status.'
            'student', 'status', 'submitted_at',
            'created_at', 'updated_at'
            )

    def validate(self, data):
        if self.instance and self.instance.status == WeeklyLog.APPROVED:
            raise serializers.ValidationError(
                'This log is approved and cannot be edited.'
            )
        return data


class LogSubmitSerializer(serializers.Serializer):
    def validate(self, data):
        log = self.context.get('log')
        if log.status not in [WeeklyLog.DRAFT, WeeklyLog.RETURNED]:
            raise serializers.ValidationError(
                'Only a DRAFT or RETURNED log can be submitted.'
            )
        if not log.activities.strip():
            raise serializers.ValidationError('Activities field cannot be empty.')
        return data


class LogWorkApprovalSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=['APPROVE', 'REJECT'])
    rating = serializers.IntegerField(min_value=1, max_value=5, required=False)
    feedback = serializers.CharField(required=False, allow_blank=True)
    rejection_reason = serializers.CharField(required=False, allow_blank=True)

    def validate(self, data):
        log = self.context.get('log')
        if log.status not in [
            WeeklyLog.PENDING_WORK_APPROVAL, WeeklyLog.RESUBMITTED
        ]:
            raise serializers.ValidationError(
                'Log must be pending work approval or resubmitted.'
            )
        if data.get('action') == 'APPROVE' and not data.get('rating'):
            raise serializers.ValidationError(
                'Rating is required when approving.'
            )
        if data.get('action') == 'REJECT' and not data.get('rejection_reason', '').strip():
            raise serializers.ValidationError(
                'Rejection reason is required when rejecting.'
            )
        return data


class LogAcademicEvaluationSerializer(serializers.Serializer):
    grade = serializers.CharField(max_length=10)
    comments = serializers.CharField(required=False, allow_blank=True)

    def validate(self, data):
        log = self.context.get('log')
        if log.status != WeeklyLog.PENDING_ACADEMIC_EVALUATION:
            raise serializers.ValidationError(
                'Log must be in PENDING_ACADEMIC_EVALUATION status.'
            )

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
    changed_by_role = serializers.SerializerMethodField()

    changed_by_name = serializers.SerializerMethodField()

    class Meta:
        model = LogStatusHistory
        fields = [
            'id', 'previous_status', 'new_status',
            'comment', 'timestamp', 'changed_by_name', 'changed_by_role'
        ]

    def get_changed_by_name(self, obj):
        return f'{obj.changed_by.first_name} {obj.changed_by.last_name}'

    def get_changed_by_role(self, obj):
        return obj.changed_by.role
