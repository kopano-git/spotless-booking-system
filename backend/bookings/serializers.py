import zoneinfo
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from .models import Service, Booking


class ServiceSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source="get_category_display", read_only=True)

    class Meta:
        model = Service
        fields = ["id", "name", "category", "category_display",
                  "description", "price", "duration_minutes"]


class BookingSerializer(serializers.ModelSerializer):
    service_detail = ServiceSerializer(source="service", read_only=True)

    scheduled_at_display = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            "id", "customer_name", "customer_phone", "customer_email",
            "service", "service_detail", 
            "scheduled_at",         # <-- Standard field for writing (POST/PATCH)
            "scheduled_at_display", # <-- Custom field for reading (GET)
            "location_type", "address", "notes", "status", "payment_status",
            "payment_method", "created_at",
        ]
        read_only_fields = ["status", "payment_status", "payment_method", "created_at"]

    def get_scheduled_at_display(self, obj):
        if not obj.scheduled_at:
            return None
        # Use Django's timezone.localtime to convert UTC to local time safely
        local_time = timezone.localtime(obj.scheduled_at)
        return local_time.isoformat()

    def validate(self, data):
        data['location_type'] = 'mobile'
        if not data.get("address"):
            raise serializers.ValidationError({"address": "Address is required for mobile service."})
        return data

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['user'] = request.user
            
        booking = super().create(validated_data)
        
        if booking.customer_email:
            from django.core.mail import send_mail
            send_mail(
                subject="Booking Confirmed - Spotless",
                message=f"Hi {booking.customer_name},\n\nYour booking for {booking.service.name} on {booking.scheduled_at} is confirmed.\n\nPlease remember to pay in person.",
                from_email="noreply@spotless.com",
                recipient_list=[booking.customer_email],
                fail_silently=True,
            )
        return booking


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(write_only=True, required=True, min_length=6)

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def create(self, validated_data):
        try:
            user = User.objects.create_user(
                username=validated_data['username'],
                email=validated_data['email'],
                password=validated_data['password']
            )
            # Explicitly ensure the user is saved
            user.save()
            return user
        except Exception as e:
            import traceback
            error_msg = f"REGISTRATION ERROR: {str(e)} | Traceback: {traceback.format_exc()}"
            print(error_msg) 
            raise serializers.ValidationError({"error": str(e)})

