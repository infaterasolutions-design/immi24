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
    <div className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-xl border border-slate-200">
        <h1 className="text-3xl font-bold text-center text-blue-600">Admin Login</h1>
        {error && <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 bg-white border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-slate-900"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 bg-white border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-slate-900"
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
