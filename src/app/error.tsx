"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface in console for production debugging
    console.error("App error:", error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[40vh] max-w-lg flex-1 flex-col items-center justify-center gap-4 px-6 py-20 text-center">
      <p className="font-ui text-sm font-semibold uppercase tracking-widest text-[#7f8984]">
        Something went wrong
      </p>
      <p className="font-ui text-[0.9375rem] leading-relaxed text-[#b6beb9]">
        {error.message || "The page could not be shown. You can try again or go home."}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-lg border border-[#2a2d2f] bg-[#1d1f20] px-4 py-2 font-ui text-sm font-medium text-[#f5f7f6] transition hover:border-[#ff9100] hover:text-[#ff9100] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#ff9100]"
      >
        Try again
      </button>
    </main>
  );
}
