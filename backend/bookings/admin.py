from django.contrib import admin
from .models import Service, Booking


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "price", "duration_minutes", "is_active")
    list_filter = ("category", "is_active")


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    # Add 'payment_method' to the list view so you can edit it inline
    list_display = ("id", "customer_name", "service", "scheduled_at", "status", "payment_status", "payment_method")
    list_filter = ("status", "payment_status", "payment_method", "location_type")
    
    # These let you edit the dropdowns directly from the main list page
    list_editable = ("status", "payment_status", "payment_method") 
    
    search_fields = ("customer_name", "customer_phone", "customer_email")
    
    # Optional: Group the fields nicely when you open a single booking
    fieldsets = (
        ("Customer Info", {
            "fields": ("customer_name", "customer_phone", "customer_email", "user")
        }),
        ("Booking Details", {
            "fields": ("service", "scheduled_at", "location_type", "address", "notes")
        }),
        ("Admin Management", {
            "fields": ("status", "payment_status", "payment_method")
        }),
    )