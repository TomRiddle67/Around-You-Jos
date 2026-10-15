import { headers } from "next/headers";

/**
 * Extracts client IP address from incoming request headers.
 *
 * Headers are evaluated in strict priority:
 * 1. `x-vercel-forwarded-for`: Set and validated by Vercel's edge proxy; cannot be forged by clients.
 * 2. `x-real-ip`: Standard reverse proxy client IP header.
 * 3. `x-forwarded-for`: Standard proxy chain header; leftmost entry used.
 * 4. Fallback: "anonymous" if no header is present (e.g. test environment or local direct connection).
 */
export async function getClientIp(): Promise<string> {
  try {
    const headerList = await headers();

    const vercelIp = headerList.get("x-vercel-forwarded-for");
    if (vercelIp) {
      const [first] = vercelIp.split(",");
      const trimmed = first?.trim();
      if (trimmed) return trimmed;
    }

    const realIp = headerList.get("x-real-ip");
    if (realIp) {
      const [first] = realIp.split(",");
      const trimmed = first?.trim();
      if (trimmed) return trimmed;
    }

    const forwardedFor = headerList.get("x-forwarded-for");
    if (forwardedFor) {
      const [first] = forwardedFor.split(",");
      const trimmed = first?.trim();
      if (trimmed) return trimmed;
    }
  } catch {
    // Gracefully handle calls outside active request context (e.g. unit tests)
  }

  return "anonymous";
}
