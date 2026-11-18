from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    BookingDetailView,
    BookingViewSet,
    ServiceViewSet,
    get_availability,
    get_user_profile,
    register_user,
)



router = DefaultRouter()
router.register("services", ServiceViewSet, basename="service")
router.register("bookings", BookingViewSet, basename="booking")

urlpatterns = [
    path("availability/", get_availability, name="availability"),
    path("register/", register_user, name="register"), # <-- ADD THIS
    path("me/", get_user_profile, name="me"),
    path("bookings/<int:pk>/", BookingDetailView.as_view(), name="booking-detail"), # <-- ADD THIS

]

urlpatterns += router.urls