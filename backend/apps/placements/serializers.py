from rest_framework import serializers
from apps.placements.models import InternshipPlacement


class PlacementSerializer(serializers.ModelSerializer):

    class Meta:
        model = InternshipPlacement
        fields = '__all__'
        read_only_fields = ['created_by', 'created_at']

    def validate(self, data):
        student = data.get('student')
        start_date = data.get('start_date')
        end_date = data.get('end_date')

        if end_date <= start_date:
            raise serializers.ValidationError(
                'End date must be after start date.'
            )

        overlapping = InternshipPlacement.objects.filter(
            student=student,
            start_date__lt=end_date,
            end_date__gt=start_date
        )

        if self.instance:
            overlapping = overlapping.exclude(pk=self.instance.pk)

        if overlapping.exists():
            raise serializers.ValidationError(
                'This student already has a placement that overlaps these dates.'
            )

        return data