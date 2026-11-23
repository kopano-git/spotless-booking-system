"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createBooking } from "@/lib/api";

export default function BookingForm() {
  const params = useParams<{ serviceId: string }>();
  const router = useRouter();
  
  const getTodayString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    location_type: "mobile", // Hardcoded to mobile
    address: "",
    notes: "",
  });

  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [selectedTime, setSelectedTime] = useState("");
  
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Pre-fill Username
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetch(`/api/me/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.username) setForm(prev => ({ ...prev, customer_name: data.username }));
        })
        .catch(() => {});
    }
  }, []);

  // Fetch Available Slots when Date Changes
  useEffect(() => {
    if (!selectedDate) return;

    setLoadingSlots(true);
    setSelectedTime(""); 
    setError(null);

    fetch(`/api/availability/?date=${selectedDate}`)

      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setAvailableSlots(data.available_slots || []);
      })
      .catch((err) => {
        console.error(err);
        setAvailableSlots([]);
        setError("Could not load available times. Please try again.");
      })
      .finally(() => {
        setLoadingSlots(false);
      });
  }, [selectedDate]);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      setError("Please select a date and time.");
      return;
    }

    setError(null);
    setSubmitting(true);
    
    try {
      const scheduledDateTime = new Date(`${selectedDate}T${selectedTime}:00`).toISOString();

      const booking = await createBooking({
        customer_name: form.customer_name,
        customer_phone: form.customer_phone,
        service: Number(params.serviceId),
        scheduled_at: scheduledDateTime,
        location_type: "mobile", // Always send mobile
        address: form.address,
        notes: form.notes,
      });
      router.push(`/confirmation/${booking.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="max-w-lg mx-auto p-6 mt-10">
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border border-gray-100">
        <h1 className="font-heading text-3xl font-bold mb-2 text-black">Mobile Detailing</h1>
        <p className="text-gray-500 mb-8 text-sm">We come to you. Please provide your address below.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input required placeholder="Your name" value={form.customer_name}
                onChange={(e) => update("customer_name", e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-black transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Whatsapp number</label>
              <input required placeholder="082 123 4567" value={form.customer_phone}
                onChange={(e) => update("customer_phone", e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-black transition-all" />
            </div>
          </div>

          {/* Mobile Address - Now Always Visible and Required */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Address</label>
            <textarea required placeholder="Where should we come to?" value={form.address}
              onChange={(e) => update("address", e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-black transition-all" />
          </div>

          {/* DATE SELECTOR */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
            <input 
              type="date" 
              required
              min={getTodayString()}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-black transition-all" 
            />
          </div>

          {/* TIME SLOT PILLS */}
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
                        <p className="text-xs text-gray-400 text-center font-light">
            No online payment required. Payment is collected upon arrival, before the service begins.
          </p>
            )}
          </div>

          {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}

          <button disabled={submitting || !selectedTime}
            className="w-full bg-black text-white rounded-xl py-4 font-medium hover:bg-gray-800 transition-transform active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 mt-4">
            {submitting ? "Booking..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </main>
  );
}