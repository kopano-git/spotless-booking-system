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
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/bookings/`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(payload),
  });
  
    if (!res.ok) {
    // Read the response as text first
    const text = await res.text();
    let errorMessage = "Something went wrong";
    
    try {
      // Try to parse it as JSON (for validation errors like "Address required")
      const json = JSON.parse(text);
      errorMessage = JSON.stringify(json);
    } catch {
      // If it's HTML (a 500 error), show a clean message
      errorMessage = "Server connection failed. Please try again later.";
      console.error("Backend HTML Error:", text); // Log the real HTML for debugging
    }
    throw new Error(errorMessage);
  }
  return res.json();
}

export async function updateBooking(id: number, payload: Partial<BookingPayload>) {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/bookings/${id}/`, {  // <-- Ensure the trailing slash is there
    method: "PATCH",
    headers: headers,
    body: JSON.stringify(payload),
  });
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(JSON.stringify(err));
  }
  return res.json();
}

export async function cancelBooking(id: number) {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/bookings/${id}/cancel/`, {
    method: "POST",
    headers: headers,
  });
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    // Handle Django validation errors
    const errorMessage = Object.values(err)[0] || "Failed to cancel booking";
    throw new Error(String(errorMessage));
  }
  return res.json();
}