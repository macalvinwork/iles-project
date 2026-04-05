from django.db import models
from apps.users.models import CustomUser


class InternshipPlacement(models.Model):

    student = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='placements',
        limit_choices_to={'role': 'STUDENT'}
    )
    workplace_supervisor = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='supervised_placements',
        limit_choices_to={'role': 'WORKPLACE_SUPERVISOR'}
    )
    company_name = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField()
    created_by = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='created_placements',
        limit_choices_to={'role': 'ADMIN'}
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.student} at {self.company_name}'