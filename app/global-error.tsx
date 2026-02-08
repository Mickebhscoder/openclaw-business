"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <div style={{ textAlign: "center" }}>
            <h2>Something went wrong</h2>
            <button onClick={() => window.location.reload()}>Try again</button>
          </div>
        </div>
      </body>
    </html>
  );
}
