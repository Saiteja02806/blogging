"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#161718",
          color: "#f5f7f6",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
            textAlign: "center",
            maxWidth: 480,
            margin: "0 auto",
          }}
        >
          <p style={{ color: "#7f8984", fontSize: 12, textTransform: "uppercase" }}>
            Critical error
          </p>
          <h1 style={{ fontSize: "1.5rem", margin: "0.5rem 0" }}>This page could not load</h1>
          <p style={{ color: "#b6beb9", lineHeight: 1.6 }}>
            {error?.message || "A root layout or script failed. Check the console or redeploy."}
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              borderRadius: 8,
              border: "1px solid #2a2d2f",
              background: "#1d1f20",
              color: "#f5f7f6",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
