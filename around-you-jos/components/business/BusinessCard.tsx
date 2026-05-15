import Link from "next/link";
import { MapPin, Phone, BadgeCheck } from "lucide-react";
import type { BusinessSummary } from "@/types";

interface BusinessCardProps {
  business: BusinessSummary;
}

export function BusinessCard({ business }: BusinessCardProps) {
  return (
    <Link
      href={`/businesses/${business.slug}`}
      className="group flex flex-col transition-colors"
      style={{ background: "var(--bg-surface)" }}
    >
      <div className="h-36 overflow-hidden relative" style={{ background: "var(--bg-subtle)" }}>
        {business.images[0] ? (
          <img
            src={business.images[0].url}
            alt={business.images[0].alt ?? business.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl font-bold" style={{ color: "var(--border-hover)" }}>
              {business.name.charAt(0)}
            </span>
          </div>
        )}
        {business.isFeatured && (
          <span className="absolute top-2 left-2 px-2 py-0.5 text-xs font-semibold rounded-sm"
            style={{ background: "var(--green)", color: "#fff" }}
          >
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4">
        <span className="text-xs font-semibold uppercase tracking-wide mb-1"
          style={{ color: "var(--green)" }}
        >
          {business.category.name}
        </span>
        <h3 className="text-sm font-bold mb-1 flex items-center gap-1.5"
          style={{ color: "var(--fg)" }}
        >
          {business.name}
          {business.isVerified && (
            <BadgeCheck className="h-4 w-4 flex-shrink-0" style={{ color: "var(--green)" }} />
          )}
        </h3>
        <p className="text-xs leading-relaxed flex-1 line-clamp-2"
          style={{ color: "var(--fg-muted)" }}
        >
          {business.description}
        </p>
        <div className="mt-3 pt-3 flex items-center justify-between gap-2"
          style={{ borderTop: "0.5px solid var(--border)" }}
        >
          <span className="flex items-center gap-1 text-xs" style={{ color: "var(--fg-subtle)" }}>
            <MapPin className="h-3 w-3" />
            {business.neighborhood.name}
          </span>
          {business.phone && (
            <span className="flex items-center gap-1 text-xs" style={{ color: "var(--fg-subtle)" }}>
              <Phone className="h-3 w-3" />
              {business.phone}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
