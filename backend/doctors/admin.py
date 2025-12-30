from django.contrib import admin
from .models import Doctor

@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ('doctor_id', 'first_name', 'last_name', 'specialization', 'is_available')
    search_fields = ('first_name', 'last_name', 'email')
    list_filter = ('specialization', 'is_available')
