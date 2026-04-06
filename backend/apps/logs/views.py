from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from apps.logs.models import WeeklyLog, LogStatusHistory
from apps.logs.serializers import (
    WeeklyLogSerializer,
    LogSubmitSerializer,
    LogReviewSerializer,
    LogFinalApproveSerializer,
    LogStatusHistorySerializer
)


class WeeklyLogListCreateView(APIView):

    def get(self, request):
        user = request.user

        if user.role == 'STUDENT':
            logs = WeeklyLog.objects.filter(student=user)
        elif user.role == 'WORKPLACE_SUPERVISOR':
            logs = WeeklyLog.objects.filter(
                placement__workplace_supervisor=user
            ).exclude(status=WeeklyLog.DRAFT)
        elif user.role in ['ACADEMIC_SUPERVISOR', 'ADMIN']:
            logs = WeeklyLog.objects.all()
        else:
            return Response(
                {'error': 'Not authorized'},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = WeeklyLogSerializer(logs, many=True)
        return Response(serializer.data)

    def post(self, request):
        if request.user.role != 'STUDENT':
            return Response(
                {'error': 'Only students can create logs'},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = WeeklyLogSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(student=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class WeeklyLogDetailView(APIView):

    def get_object(self, pk):
        try:
            return WeeklyLog.objects.get(pk=pk)
        except WeeklyLog.DoesNotExist:
            return None

    def get(self, request, pk):
        log = self.get_object(pk)
        if log is None:
            return Response(
                {'error': 'Log not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = WeeklyLogSerializer(log)
        return Response(serializer.data)

    def put(self, request, pk):
        log = self.get_object(pk)
        if log is None:
            return Response(
                {'error': 'Log not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        if request.user != log.student:
            return Response(
                {'error': 'You can only edit your own logs'},
                status=status.HTTP_403_FORBIDDEN
            )

        if log.status != WeeklyLog.DRAFT:
            return Response(
                {'error': 'Only DRAFT logs can be edited'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = WeeklyLogSerializer(log, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogSubmitView(APIView):

    def post(self, request, pk):
        try:
            log = WeeklyLog.objects.get(pk=pk)
        except WeeklyLog.DoesNotExist:
            return Response(
                {'error': 'Log not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        if request.user != log.student:
            return Response(
                {'error': 'You can only submit your own logs'},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = LogSubmitSerializer(
            data={}, context={'log': log}
        )
        if serializer.is_valid():
            previous_status = log.status
            log.status = WeeklyLog.SUBMITTED
            log.submitted_at = timezone.now()
            log.save()

            LogStatusHistory.objects.create(
                log=log,
                changed_by=request.user,
                previous_status=previous_status,
                new_status=log.status,
                comment=''
            )

            return Response({'message': 'Log submitted successfully'})

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogReviewView(APIView):

    def post(self, request, pk):
        if request.user.role != 'WORKPLACE_SUPERVISOR':
            return Response(
                {'error': 'Only workplace supervisors can review logs'},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            log = WeeklyLog.objects.get(pk=pk)
        except WeeklyLog.DoesNotExist:
            return Response(
                {'error': 'Log not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        if log.placement.workplace_supervisor != request.user:
            return Response(
                {'error': 'You can only review logs of your assigned interns'},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = LogReviewSerializer(
            data=request.data, context={'log': log}
        )
        if serializer.is_valid():
            action = serializer.validated_data['action']
            comment = serializer.validated_data.get('comment', '')
            previous_status = log.status

            if action == 'APPROVE':
                log.status = WeeklyLog.REVIEWED
            else:
                log.status = WeeklyLog.DRAFT

            log.save()

            LogStatusHistory.objects.create(
                log=log,
                changed_by=request.user,
                previous_status=previous_status,
                new_status=log.status,
                comment=comment
            )

            return Response({'message': f'Log {action.lower()}d successfully'})

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogFinalApproveView(APIView):

    def post(self, request, pk):
        if request.user.role != 'WORKPLACE_SUPERVISOR':
            return Response(
                {'error': 'Only workplace supervisors can give final approval'},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            log = WeeklyLog.objects.get(pk=pk)
        except WeeklyLog.DoesNotExist:
            return Response(
                {'error': 'Log not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        if log.placement.workplace_supervisor != request.user:
            return Response(
                {'error': 'You can only approve logs of your assigned interns'},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = LogFinalApproveSerializer(
            data={}, context={'log': log}
        )
        if serializer.is_valid():
            previous_status = log.status
            log.status = WeeklyLog.APPROVED
            log.save()

            LogStatusHistory.objects.create(
                log=log,
                changed_by=request.user,
                previous_status=previous_status,
                new_status=log.status,
                comment=''
            )

            return Response({'message': 'Log approved successfully'})

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogHistoryView(APIView):

    def get(self, request, pk):
        try:
            log = WeeklyLog.objects.get(pk=pk)
        except WeeklyLog.DoesNotExist:
            return Response(
                {'error': 'Log not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        history = LogStatusHistory.objects.filter(log=log).order_by('timestamp')
        serializer = LogStatusHistorySerializer(history, many=True)
        return Response(serializer.data)
