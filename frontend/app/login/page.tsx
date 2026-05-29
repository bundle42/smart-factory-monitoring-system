"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { login } from "@/services/auth";
import { saveToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const data = await login(email, password);

      saveToken(data.access_token);

      router.push("/dashboard");
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-[400px] border rounded-xl p-8 shadow">
        <h1 className="text-2xl font-bold mb-6">Smart Factory Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-black text-white p-3 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
}
