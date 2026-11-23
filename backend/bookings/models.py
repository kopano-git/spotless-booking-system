from django.conf import settings
from django.db import models
from django.contrib.auth.models import User  

class Service(models.Model):
    CATEGORY_CHOICES = [
        ("sneaker", "Sneaker Washing"),
        ("car_interior", "Car Interior"),
        ("car_exterior", "Car Exterior"),
        ("mobile_detailing", "Mobile Detailing"),
    ]
    name = models.CharField(max_length=120)
    category = models.CharField(max_length=32, choices=CATEGORY_CHOICES)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    duration_minutes = models.PositiveIntegerField(default=60)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.get_category_display()})"


class Booking(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]
    PAYMENT_CHOICES = [
        ("unpaid", "Unpaid"),
        ("paid", "Paid"),
    ]
    PAYMENT_METHOD_CHOICES = [ # <-- ADDED HERE
        ("cash", "Cash"),
        ("card", "Card"),
        ("eft", "EFT / Bank Transfer"),
    ]
    LOCATION_CHOICES = [
        ("in_store", "In Store"),
        ("mobile", "Mobile"),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    customer_name = models.CharField(max_length=120)
    customer_phone = models.CharField(max_length=30)
    customer_email = models.EmailField(blank=True)
    service = models.ForeignKey(Service, on_delete=models.PROTECT, related_name="bookings")
    scheduled_at = models.DateTimeField()
    location_type = models.CharField(max_length=16, choices=LOCATION_CHOICES, default="in_store")
    address = models.TextField(blank=True, help_text="Required for mobile service")
    notes = models.TextField(blank=True)

    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default="pending")
    payment_status = models.CharField(max_length=16, choices=PAYMENT_CHOICES, default="unpaid")
    
    # UPDATED FIELD BELOW
    payment_method = models.CharField(
        max_length=32, 
        choices=PAYMENT_METHOD_CHOICES, 
        blank=True, 
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"#{self.pk} {self.customer_name} — {self.service.name}"