from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Appointment
from .serializers import AppointmentSerializer

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        from django.utils import timezone
        upcoming = Appointment.objects.filter(
            appointment_date__gte=timezone.now()
        ).order_by('appointment_date')
        serializer = self.get_serializer(upcoming, many=True)
        return Response(serializer.data)
