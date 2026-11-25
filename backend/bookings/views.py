import zoneinfo

from django.contrib.admin import action
from rest_framework import viewsets, mixins
from rest_framework.permissions import AllowAny, IsAuthenticated # <-- Import IsAuthenticated

from .models import Service, Booking
from .serializers import ServiceSerializer, BookingSerializer

from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.response import Response
from datetime import datetime, timedelta

from .serializers import RegisterSerializer
from rest_framework import generics




@api_view(["GET"])
def get_availability(request):
    date_str = request.query_params.get("date")
    service_id = request.query_params.get("service_id")
    booking_id = request.query_params.get("booking_id") # <-- NEW

    if not date_str:
        return Response({"error": "Date required"}, status=400)
    
    try:
        target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        return Response({"error": "Invalid date format. Use YYYY-MM-DD"}, status=400)

    new_service_duration = 60 
    if service_id:
        try:
            service = Service.objects.get(id=service_id)
            new_service_duration = service.duration_minutes
        except Service.DoesNotExist:
            pass

    tz = zoneinfo.ZoneInfo("Africa/Johannesburg")

    existing_bookings = Booking.objects.filter(
        scheduled_at__date=target_date, 
        status__in=["pending", "confirmed"]
    )

    # If we are editing a booking, exclude it from the blocked list
    if booking_id:
        existing_bookings = existing_bookings.exclude(id=booking_id)

    blocked_hours = set()
    for booking in existing_bookings:
        local_start = booking.scheduled_at.astimezone(tz)
        booking_duration = booking.service.duration_minutes
        start_hour = local_start.hour
        hours_taken = (booking_duration + 59) // 60 
        for h in range(hours_taken):
            blocked_hours.add(start_hour + h)

    slots = []
    for hour in range(8, 18): 
        is_available = True
        new_hours_taken = (new_service_duration + 59) // 60
        for h in range(new_hours_taken):
            if (hour + h) in blocked_hours:
                is_available = False
                break
        if is_available:
            slots.append(f"{hour:02d}:00")
            
    return Response({"available_slots": slots})

class ServiceViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Service.objects.filter(is_active=True)
    serializer_class = ServiceSerializer
    permission_classes = [AllowAny] # Anyone can view services


class BookingViewSet(mixins.CreateModelMixin,
                     mixins.ListModelMixin,
                     mixins.UpdateModelMixin,
                     viewsets.GenericViewSet):
    serializer_class = BookingSerializer
    
    def get_permissions(self):
        # Anyone can view bookings? No, only logged-in users can view or create.
        # If you want the admin to see all, they use the Django Admin interface.
        return [IsAuthenticated()]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user).select_related("service").order_by("-created_at")

    # Ensure users can only edit their own bookings
    def get_object(self):
        obj = super().get_object()
        if obj.user != self.request.user:
            raise PermissionDenied("You can only edit your own bookings.")
        return obj


# NEW: Custom action for cancelling a booking
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        
        # Optional: Prevent cancelling within 24 hours of the appointment
        time_until_booking = booking.scheduled_at - timezone.now()
        if time_until_booking.total_seconds() < 86400: # 24 hours in seconds
            raise ValidationError("You cannot cancel a booking within 24 hours of the appointment.")
            
        if booking.status == 'cancelled':
            raise ValidationError("This booking is already cancelled.")

        booking.status = 'cancelled'
        booking.save()
        return Response({"message": "Booking cancelled successfully."}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    # Get the most recent booking for this user (if any)
    last_booking = Booking.objects.filter(user=request.user).order_by('-created_at').first()
    
    return Response({
        "username": request.user.username,
        "email": request.user.email,
        "last_phone": last_booking.customer_phone if last_booking else "",
        "last_address": last_booking.address if last_booking else ""
    })

class BookingDetailView(generics.RetrieveAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [AllowAny] # Allow anyone with the link to view their confirmation