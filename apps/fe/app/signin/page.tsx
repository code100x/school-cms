"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signin } from "../../lib/api";

export default function SigninPage() {
  const r = useRouter();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");
    try {
      const token = await signin({ email, password });
      localStorage.setItem("token", token);
      r.replace("/dashboard");
    } catch (e: any) {
      setErr(e?.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center">
      <div className="card w-full max-w-md">
        <h1 className="mb-2 text-2xl font-semibold">Welcome back</h1>
        <p className="mb-6 text-sm text-gray-500">Sign in to continue</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm">Email</label>
            <input name="email" type="email" required className="input" placeholder="you@example.com" />
          </div>
          <div>
            <label className="mb-2 block text-sm">Password</label>
            <input name="password" type="password" required className="input" placeholder="••••••••" />
          </div>

          {err && <p className="text-sm text-red-600">{err}</p>}

          <button disabled={loading} className="btn btn-primary w-full">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
