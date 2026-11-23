const getBaseUrl = () => {
  // 1. Browser: Use relative path (rewrites handle it)
  if (typeof window !== "undefined") return "/api";

  // 2. Server: Use the internal service URL
  if (process.env.BACKEND_INTERNAL_URL) {
    return `${process.env.BACKEND_INTERNAL_URL}/api`;
  }

  // 3. Local fallback
  return "http://localhost:8000/api";
};

const API_URL = getBaseUrl();

export type Service = {
  id: number;
  name: string;
  category: string;
  category_display: string;
  description: string;
  price: string;
  duration_minutes: number;
};

export type BookingPayload = {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  service: number;
  scheduled_at: string;
  location_type: "in_store" | "mobile";
  address?: string;
  notes?: string;
  payment_method?: string; // <-- Add this

};

export async function getServices(): Promise<Service[]> {
  // Using full URL here for server-side rendering
  const res = await fetch(`${API_URL}/services/`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load services: ${res.status}`);
  return res.json();
}

export async function createBooking(payload: BookingPayload) {
  // Get the token from the browser's local storage
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // If the user is logged in, attach the Authorization header
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/bookings/`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(payload),
  });
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(JSON.stringify(err));
  }
  return res.json();
}