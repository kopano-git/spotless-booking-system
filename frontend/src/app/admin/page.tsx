"use client";
import { useEffect, useState } from "react";

type Booking = {
  id: number;
  customer_name: string;
  customer_phone: string;
  service_detail: { name: string };
  scheduled_at: string;
  status: string;
  payment_status: string;
};

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  // In production, protect this route with an Admin token!
  const fetchBookings = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "/api"}/bookings/`)
      .then(res => res.json())
      .then(data => setBookings(data));
  };

  useEffect(() => { fetchBookings(); }, []);

  const updateStatus = async (id: number, field: string, value: string) => {
    // Note: You will need to create a PATCH endpoint in DRF for this,
    // and pass the Authorization token here.
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || "/api"}/bookings/${id}/`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json",
        // "Authorization": `Bearer ${adminToken}`
      },
      body: JSON.stringify({ [field]: value }),
    });
    fetchBookings();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-medium text-gray-600">Customer</th>
              <th className="p-4 font-medium text-gray-600">Service</th>
              <th className="p-4 font-medium text-gray-600">Date</th>
              <th className="p-4 font-medium text-gray-600">Status</th>
              <th className="p-4 font-medium text-gray-600">Payment</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{b.customer_name}<br/><span className="text-sm text-gray-500">{b.customer_phone}</span></td>
                <td className="p-4">{b.service_detail.name}</td>
                <td className="p-4">{new Date(b.scheduled_at).toLocaleString()}</td>
                <td className="p-4">
                  <select value={b.status} onChange={(e) => updateStatus(b.id, "status", e.target.value)} className="border rounded p-1 text-sm">
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
                <td className="p-4">
                  <select value={b.payment_status} onChange={(e) => updateStatus(b.id, "payment_status", e.target.value)} className={`border rounded p-1 text-sm font-bold ${b.payment_status === 'paid' ? 'bg-green-100' : 'bg-red-100'}`}>
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}