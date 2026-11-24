"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { updateBooking } from "@/lib/api";

type Booking = {
  scheduled_at: string;
  service: number;
  service_detail: { name: string };
};

export default function EditBooking() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get today's date for the min attribute
  const getTodayString = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  // 1. Fetch the existing booking data
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch(`/api/bookings/${params.id}/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setBooking(data);

        // Use the display field to parse the time for the UI
        const dateObj = new Date(data.scheduled_at_display); 
        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dd = String(dateObj.getDate()).padStart(2, '0');
        const hh = String(dateObj.getHours()).padStart(2, '0');
        
        setSelectedDate(`${yyyy}-${mm}-${dd}`);
        setSelectedTime(`${hh}:00`);
        setLoading(false);
      })
      .catch(() => router.push("/my-bookings"));
  }, [params.id, router]);

  // 2. Fetch available slots (ignoring the current booking ID)
  useEffect(() => {
    if (!selectedDate || !booking) return;

    setLoadingSlots(true);
    
    fetch(`/api/availability/?date=${selectedDate}&service_id=${booking.service}&booking_id=${params.id}`)
      .then(res => res.json())
      .then(data => {
        setAvailableSlots(data.available_slots || []);
      })
      .catch(() => setAvailableSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [selectedDate, booking, params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTime) {
      setError("Please select a time.");
      return;
    }

    setError(null);
    setSubmitting(true);
    
    try {
      // Combine date and time into ISO string
      const scheduledDateTime = new Date(`${selectedDate}T${selectedTime}:00`).toISOString();
      
      await updateBooking(Number(params.id), { scheduled_at: scheduledDateTime });
      router.push("/my-bookings");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unknown error occurred.";
      setError("Failed to update booking. " + message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (!booking) return null;

  return (
    <main className="max-w-lg mx-auto p-6 mt-10">
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border border-gray-100">
        <h1 className="font-heading text-3xl font-bold mb-2 text-black">Edit Booking</h1>
        <p className="text-gray-500 mb-8 text-sm">Editing your appointment for {booking.service_detail.name}</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select New Date</label>
            <input 
              type="date" 
              required
              min={getTodayString()}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-black transition-all" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Schedule Time</label>
            {loadingSlots ? (
              <p className="text-sm text-gray-400 animate-pulse">Loading available times...</p>
            ) : availableSlots.length > 0 ? (
              <div className="grid grid-cols-4 gap-2">
                {availableSlots.map(time => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedTime === time 
                        ? 'bg-black text-white shadow-md' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">Fully booked for this day. Please select another date.</p>
            )}
          </div>

          {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}

          <button disabled={submitting || !selectedTime}
            className="w-full bg-black text-white rounded-xl py-4 font-medium hover:bg-gray-800 transition-transform active:scale-[0.98] disabled:opacity-50 mt-4">
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </main>
  );
}