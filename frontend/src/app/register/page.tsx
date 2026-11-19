"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

    async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Use the relative path instead of localhost
    const res = await fetch(`/api/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    if (res.ok) {
      // Automatically log them in after successful registration
      const loginRes = await fetch(`/api/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      
      if (loginRes.ok) {
        const data = await loginRes.json();
        localStorage.setItem("access_token", data.access);
        router.push("/my-bookings"); 
      }
    } else {
      const data = await res.json();
      setError(Object.values(data)[0] as string || "Registration failed");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-xl shadow-sm border">
      <h1 className="text-2xl font-bold mb-6 text-center">Create an Account</h1>
      
      <form onSubmit={handleRegister} className="space-y-4">
        <input 
          required 
          placeholder="Username" 
          value={username} 
          onChange={e => setUsername(e.target.value)} 
          className="w-full border p-3 rounded-lg" 
        />
        <input 
          required 
          type="email" 
          placeholder="Email Address" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          className="w-full border p-3 rounded-lg" 
        />
        <input 
          required 
          type="password" 
          placeholder="Password (min 6 characters)" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          className="w-full border p-3 rounded-lg" 
        />
        
        {error && <p className="text-red-600 text-sm">{error}</p>}
        
        <button type="submit" className="w-full bg-black text-white p-3.5 rounded-xl font-medium hover:bg-gray-800 transition-colors">
  Create Account
</button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}