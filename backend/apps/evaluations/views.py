from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from apps.evaluations.models import Evaluation, EvaluationCriteria
from apps.evaluations.serializers import (
    EvaluationSerializer,
    EvaluationCriteriaSerializer
)


class EvaluationCriteriaListCreateView(APIView):

    def get(self, request):
        criteria = EvaluationCriteria.objects.all()
        serializer = EvaluationCriteriaSerializer(criteria, many=True)
        return Response(serializer.data)

    def post(self, request):
        if request.user.role != 'ADMIN':
            return Response(
                {'error': 'Only administrators can manage criteria'},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer = EvaluationCriteriaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EvaluationCriteriaDetailView(APIView):

    def get_object(self, pk):
        try:
            return EvaluationCriteria.objects.get(pk=pk)
        except EvaluationCriteria.DoesNotExist:
            return None

    def put(self, request, pk):
        if request.user.role != 'ADMIN':
            return Response(
                {'error': 'Only administrators can manage criteria'},
                status=status.HTTP_403_FORBIDDEN
            )
        criterion = self.get_object(pk)
        if criterion is None:
            return Response(
                {'error': 'Criterion not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = EvaluationCriteriaSerializer(
            criterion, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EvaluationListCreateView(APIView):

    def get(self, request):
        user = request.user
        if user.role == 'ACADEMIC_SUPERVISOR':
            evaluations = Evaluation.objects.filter(
                academic_supervisor=user
            )
        elif user.role == 'STUDENT':
            evaluations = Evaluation.objects.filter(student=user)
        elif user.role == 'ADMIN':
            evaluations = Evaluation.objects.all()
        else:
            return Response(
                {'error': 'Not authorized'},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer = EvaluationSerializer(evaluations, many=True)
        return Response(serializer.data)

    def post(self, request):
        if request.user.role != 'ACADEMIC_SUPERVISOR':
            return Response(
                {'error': 'Only academic supervisors can submit evaluations'},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer = EvaluationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(academic_supervisor=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EvaluationDetailView(APIView):

    def get_object(self, pk):
        try:
            return Evaluation.objects.get(pk=pk)
        except Evaluation.DoesNotExist:
            return None

    def get(self, request, pk):
        evaluation = self.get_object(pk)
        if evaluation is None:
            return Response(
                {'error': 'Evaluation not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = EvaluationSerializer(evaluation)
        return Response(serializer.data)