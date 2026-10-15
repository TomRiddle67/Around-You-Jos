import { headers } from "next/headers";

const IPV4_REGEX = /^(?:\d{1,3}\.){3}\d{1,3}$/;
const IPV6_REGEX = /^[a-fA-F0-9:]+$/;

/**
 * Validates whether a string is a well-formed IPv4 or IPv6 address.
 * Prevents arbitrary client-supplied strings from being treated as IP identities.
 */
export function isValidIp(ip: string): boolean {
  if (!ip || ip.length > 45) return false;
  return IPV4_REGEX.test(ip) || IPV6_REGEX.test(ip);
}

/**
 * Extracts a verified client IP address from incoming request headers.
 *
 * Trust Model:
 * 1. On Vercel (`process.env.VERCEL === "1"`), ONLY `x-vercel-forwarded-for` is trusted,
 *    as it is set and validated by Vercel's edge routing and cannot be forged by clients.
 *    Client-supplied `x-forwarded-for` or `x-real-ip` headers are ignored to prevent IP spoofing.
 * 2. In non-Vercel environments (e.g. self-hosted behind reverse proxy), `x-real-ip` and
 *    `x-forwarded-for` are evaluated as fallbacks, with strict IP format validation.
 * 3. If no trustworthy client IP can be verified, returns `null` (rather than a shared string
 *    like "anonymous" that could allow one attacker to exhaust quota for all users).
 */
export async function getClientIp(): Promise<string | null> {
  try {
    const headerList = await headers();

    // 1. Vercel-verified edge IP
    const vercelIp = headerList.get("x-vercel-forwarded-for");
    if (vercelIp) {
      const [first] = vercelIp.split(",");
      const trimmed = first?.trim();
      if (trimmed && isValidIp(trimmed)) return trimmed;
    }

    // In a confirmed Vercel deployment, client-supplied proxy headers must not be trusted
    if (process.env.VERCEL === "1") {
      return null;
    }

    // 2. Standard reverse proxy header (for non-Vercel deployments)
    const realIp = headerList.get("x-real-ip");
    if (realIp) {
      const [first] = realIp.split(",");
      const trimmed = first?.trim();
      if (trimmed && isValidIp(trimmed)) return trimmed;
    }

    // 3. Proxy chain header (leftmost entry)
    const forwardedFor = headerList.get("x-forwarded-for");
    if (forwardedFor) {
      const [first] = forwardedFor.split(",");
      const trimmed = first?.trim();
      if (trimmed && isValidIp(trimmed)) return trimmed;
    }
  } catch {
    // Gracefully handle calls outside active request context (e.g. unit tests)
  }

  return null;
}
