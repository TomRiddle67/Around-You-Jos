import { sanityFetch } from "./client";

export type SanityPost = {
  _id:         string;
  title:       string;
  slug:        { current: string };
  category:    string;
  excerpt:     string;
  publishedAt: string;
  neighborhood?: string;
};

export type SanityPostFull = SanityPost & {
  body: unknown[];
};

/**
 * Fetch recent posts for the homepage "Useful Now" section.
 * GROQ is Sanity's query language — similar to SQL but for documents.
 * The | order() sorts by date descending.
 * [0...5] limits to 5 results.
 */
export async function getRecentPosts(limit = 5): Promise<SanityPost[]> {
  return sanityFetch<SanityPost[]>(
    `*[_type == "post"] | order(publishedAt desc) [0...$limit] {
      _id,
      title,
      slug,
      category,
      excerpt,
      publishedAt,
      neighborhood
    }`,
    { limit }
  );
}

export async function getAllPosts(): Promise<SanityPost[]> {
  return sanityFetch<SanityPost[]>(
    `*[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      category,
      excerpt,
      publishedAt,
      neighborhood
    }`
  );
}

export async function getPostBySlug(slug: string): Promise<SanityPostFull | null> {
  return sanityFetch<SanityPostFull | null>(
    `*[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      category,
      excerpt,
      body,
      publishedAt,
      neighborhood
    }`,
    { slug }
  );
}
