from django.urls import path
from apps.evaluations.views import (
    EvaluationCriteriaListCreateView,
    EvaluationCriteriaDetailView,
    EvaluationListCreateView,
    EvaluationDetailView
)

urlpatterns = [
    path('criteria/', EvaluationCriteriaListCreateView.as_view(), name='criteria-list'),
    path('criteria/<int:pk>/', EvaluationCriteriaDetailView.as_view(), name='criteria-detail'),
    path('', EvaluationListCreateView.as_view(), name='evaluation-list'),
    path('<int:pk>/', EvaluationDetailView.as_view(), name='evaluation-detail'),
]