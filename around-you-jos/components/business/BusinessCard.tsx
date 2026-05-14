import Link from "next/link";
import { MapPin, Phone, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BusinessSummary } from "@/types";

interface BusinessCardProps {
  business: BusinessSummary;
  className?: string;
}

export function BusinessCard({ business, className }: BusinessCardProps) {
  return (
    <Link
      href={`/businesses/${business.slug}`}
      className={cn(
        "group flex flex-col bg-white rounded-2xl border border-neutral-200",
        "hover:border-green-200 hover:shadow-md transition-all duration-200",
        className
      )}
    >
      {/* Image area */}
      <div className="h-40 bg-neutral-100 rounded-t-2xl overflow-hidden relative">
        {business.images[0] ? (
          <img
            src={business.images[0].url}
            alt={business.images[0].alt ?? business.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          /* Placeholder when no image */
          <div className="w-full h-full flex items-center justify-center bg-neutral-50">
            <span className="text-4xl text-neutral-300">
              {business.name.charAt(0)}
            </span>
          </div>
        )}

        {/* Featured badge */}
        {business.isFeatured && (
          <span className="absolute top-3 left-3 px-2 py-0.5 text-xs font-semibold bg-green-500 text-white rounded-full">
            Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Category */}
        <span className="text-xs font-semibold uppercase tracking-wide text-green-600 mb-1">
          {business.category.name}
        </span>

        {/* Name */}
        <h3 className="text-base font-bold text-neutral-900 group-hover:text-green-600 transition-colors mb-1 flex items-center gap-1.5">
          {business.name}
          {business.isVerified && (
            <BadgeCheck className="h-4 w-4 text-green-500 flex-shrink-0" />
          )}
        </h3>

        {/* Description */}
        <p className="text-sm text-neutral-500 leading-relaxed line-clamp-2 flex-1">
          {business.description}
        </p>

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
          <span className="flex items-center gap-1 text-xs text-neutral-400">
            <MapPin className="h-3 w-3" />
            {business.neighborhood.name}
          </span>
          {business.phone && (
            <span className="flex items-center gap-1 text-xs text-neutral-400">
              <Phone className="h-3 w-3" />
              {business.phone}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}