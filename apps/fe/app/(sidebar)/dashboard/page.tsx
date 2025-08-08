"use client";

import RequireAuth from "../../../components/RequireAuth";

export default function DashboardHome() {
  return (
    <RequireAuth>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="card">
            <h2 className="mb-2 text-lg font-medium">Calendar</h2>
            <p className="text-sm text-gray-500">View your course schedule from Notion.</p>
          </div>
          <div className="card">
            <h2 className="mb-2 text-lg font-medium">Wallet</h2>
            <p className="text-sm text-gray-500">Track payments & receipts (coming soon).</p>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
