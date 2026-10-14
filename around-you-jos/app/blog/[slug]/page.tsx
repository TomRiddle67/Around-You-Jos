import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { getPostBySlug } from "@/sanity/queries";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);
  if (!post) return { title: "Post Not Found" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);
  if (!post) notFound();

  const date = new Date(post.publishedAt).toLocaleDateString("en-NG", {
    month: "long", day: "numeric", year: "numeric",
  });

  return (
    <>
      <Navbar />
      <main>
        <div
          className="text-xs px-4 py-1 flex items-center gap-2"
          style={{ background: "var(--green-dark)", color: "rgba(255,255,255,0.65)" }}
        >
          <Link href="/blog" style={{ color: "rgba(255,255,255,0.65)" }}>Blog</Link>
          <span>›</span>
          <span style={{ color: "rgba(255,255,255,0.9)" }}>{post.title}</span>
        </div>

        <div className="py-3" style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)" }}>
          <Container size="narrow">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs mb-3"
              style={{ color: "var(--fg-muted)" }}
            >
              <ArrowLeft className="h-3 w-3" /> Back to posts
            </Link>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-xs font-semibold px-1.5 py-0.5 rounded-sm"
                style={{ background: "var(--green-bg)", color: "var(--green-text)" }}
              >
                {post.category}
              </span>
              {post.neighborhood && (
                <span className="text-xs" style={{ color: "var(--fg-muted)" }}>
                  {post.neighborhood}
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold mb-1" style={{ color: "var(--fg)" }}>
              {post.title}
            </h1>
            <p className="text-xs" style={{ color: "var(--fg-muted)" }}>{date}</p>
          </Container>
        </div>

        <div style={{ background: "var(--bg)" }} className="py-8">
          <Container size="narrow">
            <p className="text-sm mb-6 leading-relaxed" style={{ color: "var(--fg-muted)" }}>
              {post.excerpt}
            </p>
            {post.body && (
              <div
                className="prose prose-sm max-w-none"
                style={{ color: "var(--fg)" }}
              >
                <PortableText value={post.body as Parameters<typeof PortableText>[0]["value"]} />
              </div>
            )}
          </Container>
        </div>
      </main>
      <Footer />
    </>
  );
}
