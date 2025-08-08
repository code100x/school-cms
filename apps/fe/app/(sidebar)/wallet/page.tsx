"use client";

import RequireAuth from "../../../components/RequireAuth";

export default function WalletPage() {
  return (
    <RequireAuth>
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Wallet</h1>
        <p className="text-sm text-gray-500">Coming soon.</p>
      </div>
    </RequireAuth>
  );
}
