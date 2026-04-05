from django.db import models
from apps.users.models import CustomUser
from apps.placements.models import InternshipPlacement


class WeeklyLog(models.Model):

    DRAFT = 'DRAFT'
    SUBMITTED = 'SUBMITTED'
    REVIEWED = 'REVIEWED'
    APPROVED = 'APPROVED'

    STATUS_CHOICES = [
        (DRAFT, 'Draft'),
        (SUBMITTED, 'Submitted'),
        (REVIEWED, 'Reviewed'),
        (APPROVED, 'Approved'),
    ]

    student = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='weekly_logs',
        limit_choices_to={'role': 'STUDENT'}
    )
    placement = models.ForeignKey(
        InternshipPlacement,
        on_delete=models.CASCADE,
        related_name='weekly_logs'
    )
    week_number = models.PositiveIntegerField()
    week_start_date = models.DateField()
    activities = models.TextField()
    learning_outcomes = models.TextField()
    challenges = models.TextField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=DRAFT
    )
    submission_deadline = models.DateTimeField()
    submitted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('student', 'week_number', 'placement')

    def __str__(self):
        return f'{self.student} - Week {self.week_number} ({self.status})'


class LogStatusHistory(models.Model):

    log = models.ForeignKey(
        WeeklyLog,
        on_delete=models.CASCADE,
        related_name='history'
    )
    changed_by = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='log_changes'
    )
    previous_status = models.CharField(max_length=20)
    new_status = models.CharField(max_length=20)
    comment = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.log} | {self.previous_status} -> {self.new_status}'
