"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const [user, setUser] = useState<{username: string, email: string} | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Use relative path for production
    fetch(`/api/me/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then(data => setUser(data))
      .catch(() => {
        localStorage.removeItem("access_token"); // Clean up bad token
        router.push("/login");
      });
  }, [router]);

  if (!user) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-xl shadow-sm border">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-500">Username</label>
          <p className="font-medium text-lg">{user.username}</p>
        </div>
        <div>
          <label className="text-sm text-gray-500">Email</label>
          <p className="font-medium text-lg">{user.email || "No email provided"}</p>
        </div>
      </div>
    </div>
  );
}