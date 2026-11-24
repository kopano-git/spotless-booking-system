import zoneinfo

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
    service_id = request.query_params.get("service_id") # <-- NEW

    if not date_str:
        return Response({"error": "Date required"}, status=400)
    
    try:
        target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        return Response({"error": "Invalid date format. Use YYYY-MM-DD"}, status=400)

    # Get the duration of the service the user is trying to book
    new_service_duration = 60 # Default to 60 mins if no service_id provided
    if service_id:
        try:
            service = Service.objects.get(id=service_id)
            new_service_duration = service.duration_minutes
        except Service.DoesNotExist:
            pass

    # Get the local timezone (Africa/Johannesburg)
    tz = zoneinfo.ZoneInfo("Africa/Johannesburg")

    # Find existing bookings for this date that are not cancelled
    existing_bookings = Booking.objects.filter(
        scheduled_at__date=target_date, 
        status__in=["pending", "confirmed"]
    )

    # Convert booked times to local time and create a list of blocked hours
    blocked_hours = set()
    for booking in existing_bookings:
        # Convert UTC to local time
        local_start = booking.scheduled_at.astimezone(tz)
        booking_duration = booking.service.duration_minutes
        
        # Calculate how many hours this booking takes
        # e.g., if it starts at 10:00 and takes 150 mins (2.5h), it blocks 10, 11, 12
        start_hour = local_start.hour
        # Round up the duration to the next full hour for blocking purposes
        hours_taken = (booking_duration + 59) // 60 
        
        for h in range(hours_taken):
            blocked_hours.add(start_hour + h)

    slots = []
    # Operating hours: 08:00 to 17:00 (8 AM to 5 PM)
    for hour in range(8, 18): 
        # Check if this start time or any time during the new service duration overlaps with a blocked hour
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
                     viewsets.GenericViewSet):
    serializer_class = BookingSerializer
    
    def get_permissions(self):
        # Anyone can view bookings? No, only logged-in users can view or create.
        # If you want the admin to see all, they use the Django Admin interface.
        return [IsAuthenticated()]

    def get_queryset(self):
        # Only return bookings belonging to the logged-in user
        return Booking.objects.filter(user=self.request.user).select_related("service").order_by("-created_at")

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
    return Response({
        "username": request.user.username,
        "email": request.user.email
    })

class BookingDetailView(generics.RetrieveAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [AllowAny] # Allow anyone with the link to view their confirmation