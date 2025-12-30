from django.contrib import admin
from .models import Staff

@admin.register(Staff)
class StaffAdmin(admin.ModelAdmin):
    list_display = ('staff_id', 'first_name', 'last_name', 'role', 'department', 'is_active')
    search_fields = ('first_name', 'last_name', 'email')
    list_filter = ('role', 'department', 'is_active')
