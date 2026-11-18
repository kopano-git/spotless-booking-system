from django.contrib import admin
from .models import Service, Booking


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "price", "duration_minutes", "is_active")
    list_filter = ("category", "is_active")


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ("id", "customer_name", "service", "scheduled_at",
                    "status", "payment_status", "created_at")
    list_filter = ("status", "payment_status", "location_type")
    list_editable = ("status", "payment_status")
    search_fields = ("customer_name", "customer_phone")