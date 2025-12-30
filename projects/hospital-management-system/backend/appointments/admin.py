from django.contrib import admin
from .models import Appointment

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('appointment_id', 'patient', 'doctor', 'appointment_date', 'status')
    search_fields = ('patient__first_name', 'doctor__first_name')
    list_filter = ('status', 'appointment_date')
