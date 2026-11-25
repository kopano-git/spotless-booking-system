"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Booking = {
  id: number;
  scheduled_at_display: string;  payment_status: string;
  payment_method: string; // <-- Add this
  status: string;
  service_detail: {
    name: string;
  };
};

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    
    if (!token) {
      router.push("/login");
      return;
    }

    fetch(`/api/bookings/`, {
      headers: { 
        Authorization: `Bearer ${token}` 
      },
    })
      .then((res) => {
        if (res.status === 401) {
          // Token is invalid/expired. Clear it and send to login.
          localStorage.removeItem("access_token");
          router.push("/login");
          return null;
        }
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        if (data) setBookings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [router]);

  if (loading) return <div className="text-center mt-20">Loading your bookings...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Bookings</h1>
      </div>
      
      <div className="space-y-4">
        {bookings.length === 0 && (
          <div className="text-center p-10 bg-white rounded-xl shadow-sm border">
            <p className="text-gray-500 mb-4">You haven&apos;t made any bookings yet.</p>
            <a href="/" className="bg-black text-white px-4 py-2 rounded-lg">Book a Service</a>
          </div>
        )}
        
                {bookings.map((b) => (
          <div key={b.id} className="bg-white p-6 rounded-xl shadow-sm border flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            
            {/* Left Side: Service Info */}
            <div>
              <h2 className="font-bold text-lg text-black">{b.service_detail.name}</h2>
              <p className="text-gray-500 text-sm">
  {new Date(b.scheduled_at_display).toLocaleString()}
</p>
              
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Status:</span>
                <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                  b.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                  b.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                  b.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {b.status.toUpperCase()}
                </span>
              </div>
            </div>

                        {/* Right Side: Payment Info */}
            <div className="sm:text-right border-t sm:border-t-0 pt-4 sm:pt-0 flex flex-col items-end justify-between">
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  b.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                }`}>
                  {b.payment_status.toUpperCase()}
                </span>
                
                {b.payment_status === 'paid' ? (
                  <div className="text-sm text-gray-500 mt-2">
                    Paid via <span className="font-medium text-black capitalize">{b.payment_method || "Unknown"}</span>
                  </div>
                ) : (
                  <div className="text-xs text-gray-400 mt-2 max-w-[150px]">
                    Please have cash or card ready.
                  </div>
                )}
              </div>

                           {/* Edit Button */}
              <a 
                href={`/my-bookings/${b.id}`}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold tracking-wide text-black bg-white border border-gray-300 rounded-full hover:bg-black hover:text-white transition-all duration-200 active:scale-95"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                Edit Time
              </a>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}