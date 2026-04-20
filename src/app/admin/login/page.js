"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginWithEmail } from "../../../lib/adminHelpers";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await loginWithEmail(email, password);
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Use router to force navigate to /admin on successful login
    router.push("/admin");
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900 text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-neutral-800 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold text-center text-blue-500">Admin Login</h1>
        {error && <div className="p-3 text-sm text-red-400 bg-red-900/20 rounded-md">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-400">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 bg-neutral-700 border border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-400">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 bg-neutral-700 border border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none disabled:opacity-50 transition-colors"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
