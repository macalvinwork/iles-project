from django.test import TestCase
from apps.users.models import CustomUser
from apps.placements.models import InternshipPlacement
from django.utils import timezone
import datetime


class InternshipPlacementTest(TestCase):

    def setUp(self):
        self.admin = CustomUser.objects.create_user(
            email='admin@test.com',
            password='pass1234',
            first_name='Admin',
            last_name='User',
            role='ADMIN'
        )
        self.student = CustomUser.objects.create_user(
            email='student@test.com',
            password='pass1234',
            first_name='Test',
            last_name='Student',
            role='STUDENT'
        )
        self.supervisor = CustomUser.objects.create_user(
            email='supervisor@test.com',
            password='pass1234',
            first_name='Test',
            last_name='Supervisor',
            role='WORKPLACE_SUPERVISOR'
        )
        self.placement = InternshipPlacement.objects.create(
            student=self.student,
            workplace_supervisor=self.supervisor,
            company_name='Test Company',
            start_date=datetime.date(2026, 1, 1),
            end_date=datetime.date(2026, 12, 31),
            created_by=self.admin
        )

    def test_placement_created_successfully(self):
        self.assertEqual(self.placement.company_name, 'Test Company')
        self.assertEqual(self.placement.student, self.student)
        self.assertEqual(self.placement.workplace_supervisor, self.supervisor)

    def test_placement_str_representation(self):
        self.assertIn('Test Company', str(self.placement))

    def test_placement_dates_are_correct(self):
        self.assertEqual(self.placement.start_date, datetime.date(2026, 1, 1))
        self.assertEqual(self.placement.end_date, datetime.date(2026, 12, 31))

    def test_student_has_placement(self):
        placements = InternshipPlacement.objects.filter(student=self.student)
        self.assertEqual(placements.count(), 1)

    def test_supervisor_has_placement(self):
        placements = InternshipPlacement.objects.filter(
            workplace_supervisor=self.supervisor
        )
        self.assertEqual(placements.count(), 1)