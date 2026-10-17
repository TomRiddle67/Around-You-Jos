// around-you-jos/next.config.ts
import type { NextConfig } from "next";

export const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

export type CspDirectives = Record<string, string[]>;

/**
 * Builds a syntactically valid CSP directive string from a directive dictionary.
 * Empty value arrays represent standalone flags (e.g. upgrade-insecure-requests).
 */
export function buildCspString(directives: CspDirectives): string {
  return Object.entries(directives)
    .map(([directive, values]) =>
      values.length > 0 ? `${directive} ${values.join(" ")}` : directive
    )
    .join("; ");
}

const isProduction = process.env.NODE_ENV === "production";

/**
 * Public application CSP directives (Report-Only).
 *
 * Directive rationale:
 * - default-src 'self': Restrict unclassified resource fallbacks to origin.
 * - script-src 'self' 'unsafe-inline': Required for Next.js runtime bootstrap chunks and
 *   next-themes head script during initial compatibility-monitoring phase; nonce-based evaluation
 *   planned for future enforcement phase.
 * - style-src 'self' 'unsafe-inline': Required for React inline JSX styles and Tailwind CSS.
 * - img-src 'self' data: https://cdn.sanity.io: Supports local assets, SVGs, and Sanity CMS media.
 * - font-src 'self' data:: Supports self-hosted Google Fonts (Inter) and SVG fonts.
 * - connect-src 'self' https://*.api.sanity.io https://*.sanity.io: Supports Server Actions and Sanity client APIs.
 * - object-src 'none': Eliminates plugin attack vectors.
 * - base-uri 'self': Prevents base-tag injection.
 * - form-action 'self': Confines form submissions to origin.
 * - frame-ancestors 'none': Aligns with existing X-Frame-Options: DENY.
 * - upgrade-insecure-requests: Included only in production to preserve local HTTP development.
 */
export const publicCspDirectives: CspDirectives = {
  "default-src": ["'self'"],
  "script-src": ["'self'", "'unsafe-inline'"],
  "style-src": ["'self'", "'unsafe-inline'"],
  "img-src": ["'self'", "data:", "https://cdn.sanity.io"],
  "font-src": ["'self'", "data:"],
  "connect-src": [
    "'self'",
    "https://*.api.sanity.io",
    "https://*.sanity.io",
  ],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  "frame-ancestors": ["'none'"],
  ...(isProduction ? { "upgrade-insecure-requests": [] } : {}),
};

/**
 * Sanity Studio CSP directives (Report-Only).
 *
 * Studio-specific rationale:
 * - script-src: Adds 'unsafe-eval' required by Sanity Studio v3 runtime schema compilation and tools.
 * - img-src: Adds blob: for local asset uploads, and avatar providers (Gravatar, Google, GitHub) for collaborative editing.
 * - connect-src: Adds wss://*.api.sanity.io for live listener WebSockets in Studio.
 * - frame-ancestors 'self': Allows Studio internal workspace framing while preventing external embedding.
 */
export const studioCspDirectives: CspDirectives = {
  "default-src": ["'self'"],
  "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
  "style-src": ["'self'", "'unsafe-inline'"],
  "img-src": [
    "'self'",
    "data:",
    "blob:",
    "https://cdn.sanity.io",
    "https://*.gravatar.com",
    "https://*.googleusercontent.com",
    "https://avatars.githubusercontent.com",
  ],
  "font-src": ["'self'", "data:"],
  "connect-src": [
    "'self'",
    "https://*.api.sanity.io",
    "https://*.sanity.io",
    "wss://*.api.sanity.io",
  ],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  "frame-ancestors": ["'self'"],
  ...(isProduction ? { "upgrade-insecure-requests": [] } : {}),
};

export const publicCspPolicy = buildCspString(publicCspDirectives);
export const studioCspPolicy = buildCspString(studioCspDirectives);

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  devIndicators: false,
  async headers() {
    return [
      // Baseline HTTP security protections applied across all routes
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      // Dedicated CSP Report-Only for Sanity Studio (/studio and nested paths)
      {
        source: "/studio/:path*",
        headers: [
          {
            key: "Content-Security-Policy-Report-Only",
            value: studioCspPolicy,
          },
        ],
      },
      // Hardened CSP Report-Only for all public application routes (excluding /studio)
      {
        source: "/((?!studio(?:/|$)).*)",
        headers: [
          {
            key: "Content-Security-Policy-Report-Only",
            value: publicCspPolicy,
          },
        ],
      },
    ];
  },
};

export default nextConfig;