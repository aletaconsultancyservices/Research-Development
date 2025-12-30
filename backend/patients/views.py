from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Patient
from .serializers import PatientSerializer

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

    @action(detail=False, methods=['get'])
    def search(self, request):
        search_term = request.query_params.get('q', '')
        patients = Patient.objects.filter(
            first_name__icontains=search_term
        ) | Patient.objects.filter(
            last_name__icontains=search_term
        ) | Patient.objects.filter(
            email__icontains=search_term
        )
        serializer = self.get_serializer(patients, many=True)
        return Response(serializer.data)
