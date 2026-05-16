import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  useCdn:    process.env.NODE_ENV === "production",
});

/**
 * Why useCdn in production?
 * Sanity's CDN caches responses globally — faster reads.
 * In development we skip it so we always get fresh content.
 */

export async function sanityFetch<T>(query: string, params = {}): Promise<T> {
  return client.fetch<T>(query, params);
}
