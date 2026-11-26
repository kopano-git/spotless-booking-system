"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cancelBooking } from "@/lib/api"; 

type Booking = {
  id: number;
  scheduled_at_display: string;
  payment_status: string;
  payment_method: string; 
  status: string;
  service_detail: {
    name: string;
  };
};

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const router = useRouter();

  const fetchBookings = useCallback(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch(`/api/bookings/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("access_token");
          router.push("/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setBookings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancel = async (id: number) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    setCancellingId(id);
    try {
      await cancelBooking(id);
      fetchBookings(); 
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Could not cancel booking.");
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) return <div className="text-center mt-20">Loading your bookings...</div>;

  // Split into Upcoming and Past based on status
  const upcomingBookings = bookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled');
  const pastBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
      
      {/* UPCOMING BOOKINGS */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-6">Upcoming Bookings</h1>
        
        <div className="space-y-4">
          {upcomingBookings.length === 0 && (
            <div className="text-center p-10 bg-white rounded-xl shadow-sm border">
              <p className="text-gray-500 mb-4">You don&apos;t have any upcoming bookings.</p>
              <a href="/" className="bg-black text-white px-4 py-2 rounded-lg">Book a Service</a>
            </div>
          )}
          
          {upcomingBookings.map((b) => (
            <div key={b.id} className="bg-white p-6 rounded-xl shadow-sm border flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h2 className="font-bold text-lg text-black">{b.service_detail.name}</h2>
                <p className="text-gray-500 text-sm">{new Date(b.scheduled_at_display).toLocaleString()}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Status:</span>
                  <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                    b.status === 'confirmed' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {b.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="sm:text-right border-t sm:border-t-0 pt-4 sm:pt-0 flex flex-col items-start sm:items-end justify-between">
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    b.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {b.payment_status.toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <a href={`/my-bookings/${b.id}`} className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold tracking-wide text-black bg-white border border-gray-300 rounded-full hover:bg-black hover:text-white transition-all duration-200 active:scale-95">
                    Edit Time
                  </a>
                  <button onClick={() => handleCancel(b.id)} disabled={cancellingId === b.id} className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold tracking-wide text-red-600 bg-white border border-red-200 rounded-full hover:bg-red-50 transition-all duration-200 active:scale-95 disabled:opacity-50">
                    {cancellingId === b.id ? "Cancelling..." : "Cancel"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BOOKING HISTORY */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Booking History</h2>
        
        <div className="space-y-4">
          {pastBookings.length === 0 && (
            <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-gray-400">No past bookings yet.</p>
            </div>
          )}
          
          {pastBookings.map((b) => (
            <div key={b.id} className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4 opacity-75">
              <div>
                <h2 className="font-bold text-lg text-gray-600">{b.service_detail.name}</h2>
                <p className="text-gray-400 text-sm">{new Date(b.scheduled_at_display).toLocaleString()}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Status:</span>
                  <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                    b.status === 'completed' ? 'bg-gray-200 text-gray-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {b.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="sm:text-right border-t sm:border-t-0 pt-4 sm:pt-0 flex flex-col items-start sm:items-end justify-between">
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    b.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {b.payment_status.toUpperCase()}
                  </span>
                  {b.payment_status === 'paid' && (
                    <div className="text-sm text-gray-500 mt-2">
                      Paid via <span className="font-medium text-black capitalize">{b.payment_method || "Unknown"}</span>
                    </div>
                  )}
                </div>
                {/* No buttons for past bookings */}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}