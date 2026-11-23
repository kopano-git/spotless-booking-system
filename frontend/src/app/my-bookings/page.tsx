"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Booking = {
  id: number;
  scheduled_at: string;
  payment_status: string;
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
            <p className="text-gray-500 mb-4">You haven&Apos;t made any bookings yet.</p>
            <a href="/" className="bg-black text-white px-4 py-2 rounded-lg">Book a Service</a>
          </div>
        )}
        
        {bookings.map((b) => (
          <div key={b.id} className="bg-white p-6 rounded-xl shadow-sm border flex justify-between items-center">
            <div>
              <h2 className="font-bold text-lg">{b.service_detail.name}</h2>
              <p className="text-gray-500 text-sm">{new Date(b.scheduled_at).toLocaleString()}</p>
            </div>
            <div className="text-right">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${b.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {b.payment_status.toUpperCase()}
              </span>
              <div className="text-sm text-gray-500 mt-2 capitalize">Status: {b.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}