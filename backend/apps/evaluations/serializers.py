from rest_framework import serializers
from apps.evaluations.models import Evaluation, EvaluationCriteria


class EvaluationCriteriaSerializer(serializers.ModelSerializer):

    class Meta:
        model = EvaluationCriteria
        fields = '__all__'

    def validate(self, data):
        active_criteria = EvaluationCriteria.objects.filter(is_active=True)
        if self.instance:
            active_criteria = active_criteria.exclude(pk=self.instance.pk)
        total = sum(c.weight for c in active_criteria)
        total += data.get('weight', 0)
        if total > 100:
            raise serializers.ValidationError(
                f'Adding this weight would make the total {total}%. Must not exceed 100%.'
            )
        return data


class EvaluationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Evaluation
        fields = '__all__'
        read_only_fields = [
            'academic_supervisor', 'total_score', 'submitted_at'
        ]

    def validate(self, data):
        student = data.get('student')
        placement = data.get('placement')

        if Evaluation.objects.filter(
            student=student, placement=placement
        ).exists():
            raise serializers.ValidationError(
                'An evaluation already exists for this student and placement.'
            )

        criteria = EvaluationCriteria.objects.filter(is_active=True)

        total_weight = sum(c.weight for c in criteria)
        if total_weight != 100:
            raise serializers.ValidationError(
                f'Criteria weights add up to {total_weight}%, not 100%. '
                'Ask the administrator to fix the criteria before evaluating.'
            )

        scores = data.get('scores', {})
        for criterion in criteria:
            if str(criterion.id) not in scores:
                raise serializers.ValidationError(
                    f'Score missing for criterion: {criterion.name}'
                )

        return data