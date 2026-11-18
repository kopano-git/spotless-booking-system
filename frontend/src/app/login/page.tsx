"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "/api"}/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("access_token", data.access);
      router.push("/my-bookings");
    } else {
      alert("Invalid credentials");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-sm border">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input required placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full border p-3 rounded-lg" />
        <input required type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border p-3 rounded-lg" />
        <button type="submit" className="w-full bg-black text-white p-3.5 rounded-xl font-medium hover:bg-gray-800 transition-colors">
  Sign In
</button>
      </form>

         <p className="text-center text-sm text-gray-600 mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </p>
    </div>

  );

  
}
