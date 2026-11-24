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




@api_view(["GET"]) # <-- THIS DECORATOR MUST BE HERE
def get_availability(request):
    date_str = request.query_params.get("date") 
    if not date_str:
        return Response({"error": "Date required"}, status=400)
    
    try:
        target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        return Response({"error": "Invalid date format. Use YYYY-MM-DD"}, status=400)

    # Get the local timezone (Africa/Johannesburg)
    tz = zoneinfo.ZoneInfo("Africa/Johannesburg")

    # Filter bookings for this date, and get their local hour
    bookings = Booking.objects.filter(
        scheduled_at__date=target_date, 
        status__in=["pending", "confirmed"]
    )
    
    # Convert the booked times to local time hours
    booked_hours = [b.scheduled_at.astimezone(tz).hour for b in bookings]

    slots = []
    # Operating hours: 08:00 to 17:00
    for hour in range(8, 18): 
        if hour not in booked_hours:
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