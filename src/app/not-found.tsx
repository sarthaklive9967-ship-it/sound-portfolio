import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function NotFound() {
  return (
    <main className="status-page section-shell">
      <span className="eyebrow">404 / A WRONG TURN</span>
      <h1>
        This page is
        <br />
        still out of reach.
      </h1>
      <p>The page may have moved, or the address might be incorrect.</p>
      <Link className="button button-primary" href="/">
        Back to Sound
        <ArrowUpRight size={18} aria-hidden="true" />
      </Link>
    </main>
  );
}
