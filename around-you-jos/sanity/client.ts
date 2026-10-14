import { createClient, type SanityClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

export const isSanityConfigured = Boolean(projectId && dataset);

export const client: SanityClient | null = isSanityConfigured
  ? createClient({
      projectId: projectId!,
      dataset: dataset!,
      apiVersion: "2024-01-01",
      useCdn: process.env.NODE_ENV === "production",
    })
  : null;

/**
 * Why useCdn in production?
 * Sanity's CDN caches responses globally — faster reads.
 * In development we skip it so we always get fresh content.
 */

export async function sanityFetch<T>(query: string, params = {}): Promise<T> {
  if (!client) {
    throw new Error(
      "Sanity client is not configured: NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET is missing."
    );
  }
  return client.fetch<T>(query, params);
}
