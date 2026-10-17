"use client";

import Link from "next/link";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="status-page section-shell">
      <span className="eyebrow">A SMALL INTERRUPTION</span>
      <h1>
        Let&apos;s try
        <br />
        that again.
      </h1>
      <p>Something interrupted this page. Try reloading it to continue.</p>
      <div className="status-actions">
        <button type="button" className="button button-primary" onClick={reset}>
          Try again
        </button>
        <Link className="text-link" href="/">
          Back to home
        </Link>
      </div>
    </main>
  );
}
