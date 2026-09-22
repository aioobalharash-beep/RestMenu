"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") || "/admin";
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.replace(from);
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-[100dvh] place-items-center bg-porcelain px-5 text-ink">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="text-[0.7rem] uppercase tracking-[0.3em] text-saffron-deep">
            RestMenu
          </span>
          <h1 className="mt-2 font-display text-3xl font-light">Admin access</h1>
          <p className="mt-2 text-sm text-ink-soft">
            Enter the owner password to manage the menu.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-hairline bg-shell/70 p-6 shadow-soft backdrop-blur-xl"
        >
          <label className="block text-sm font-medium text-ink-soft" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="focus-ring mt-2 w-full rounded-xl border border-hairline bg-cream px-4 py-3 text-ink outline-none transition-colors placeholder:text-ink-faint"
            placeholder="••••••••"
          />
          {error && (
            <p className="mt-3 text-sm text-clay" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            className="focus-ring mt-5 w-full rounded-xl bg-ink px-4 py-3 text-sm font-medium text-cream transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Enter"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-ink-faint">
          <a href="/" className="focus-ring underline-offset-4 hover:underline">
            ← Back to the menu
          </a>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
