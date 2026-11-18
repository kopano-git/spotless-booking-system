"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Booking = {
  id: number | string;
  service_detail: {
    category: string;
    name: string;
  };
};

export default function Confirmation() {
  const params = useParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/bookings/${params.id}/`)
      .then((res) => {
        if (!res.ok) throw new Error("Booking not found");
        return res.json();
      })
      .then((data) => {
        setBooking(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return <div className="text-center mt-20 text-gray-500">Loading details...</div>;
  }

  if (!booking) {
    return <div className="text-center mt-20 text-red-500">Booking could not be found.</div>;
  }

  // Determine if it's a car or sneaker based on the category string
  const isSneaker = booking.service_detail.category === "sneaker";
  const itemType = isSneaker ? "kicks" : "ride";

  return (
    <main className="max-w-lg mx-auto p-6 mt-20">
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10 border border-gray-100 text-center">
        
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        <h1 className="font-heading text-3xl font-bold mb-3 text-black">Booking Confirmed</h1>
        
        {/* DYNAMIC MESSAGE BASED ON SERVICE TYPE */}
        <p className="text-gray-500 mb-8 font-light">
          Your slot is locked in. We can&apos;t wait to make your {itemType} spotless.
        </p>

        <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Booking Reference</span>
            <span className="font-mono font-bold text-black">#{booking.id}</span>
          </div>
          
          <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-4">
            <span className="text-sm text-gray-500">Service</span>
            <span className="font-medium text-black text-right">{booking.service_detail.name}</span>
          </div>
          
          <div className="pt-2">
            <h3 className="font-medium text-black mb-2">Payment Instructions</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Payment is required <strong className="text-black">upon arrival at your address</strong>, prior to the service starting. 
              <br/><br/>
              We accept Cash, Card, or EFT on the day. Our team will collect payment when we arrive and set up.
            </p>
          </div>
        </div>

        <Link 
          href="/my-bookings" 
          className="block w-full bg-black text-white rounded-xl py-4 font-medium hover:bg-gray-800 transition-transform active:scale-[0.98]"
        >
          View My Bookings
        </Link>
      </div>
    </main>
  );
}