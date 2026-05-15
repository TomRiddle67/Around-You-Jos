"use client";

import { useActionState } from "react";
import { submitRequestAction } from "@/app/ask/actions";
import { MapPin, Phone, MessageSquare, User, Loader2 } from "lucide-react";

/**
 * Why "use client" here?
 * The form needs:
 * - useActionState hook (tracks pending/result state)
 * - Interactive UI (loading spinner, error messages, success state)
 *
 * The parent /ask page stays a Server Component.
 * Only this form drops into client mode.
 * This is "pushing client components to the leaves."
 */

type ActionResult =
  | { success: true;  message: string }
  | { success: false; errors?: Record<string, string[]>; message?: string }
  | null;

interface AskFormProps {
  neighborhoods: { id: string; name: string }[];
}

export function AskForm({ neighborhoods }: AskFormProps) {
  /**
   * useActionState is the React hook for Server Actions.
   * It gives us:
   * - state: the last result returned by the action
   * - formAction: pass this to the form's action prop
   * - isPending: true while the action is running
   */
  const [state, formAction, isPending] = useActionState(
  submitRequestAction,
  null
);

  // Show success screen after submission
  if (state?.success) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-100 mb-4">
          <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-neutral-900 mb-2">Request received</h2>
        <p className="text-sm text-neutral-500 max-w-sm mx-auto">{state.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">

      {/* Global error */}
      {state && !state.success && state.message && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
          {state.message}
        </div>
      )}

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
          Your name
        </label>
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            name="name"
            placeholder="e.g. Amina Ibrahim"
            className="w-full h-11 pl-10 pr-4 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
          />
        </div>
        {!state?.success && state?.errors?.name && (
          <p className="mt-1 text-xs text-red-500">{state.errors.name[0]}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
          Phone number
        </label>
        <div className="relative">
          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="tel"
            name="phone"
            placeholder="+234 801 234 5678"
            className="w-full h-11 pl-10 pr-4 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
          />
        </div>
        {!state?.success && state?.errors?.phone && (
          <p className="mt-1 text-xs text-red-500">{state.errors.phone[0]}</p>
        )}
      </div>

      {/* Neighborhood */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
          Which area? <span className="text-neutral-400 font-normal">(optional)</span>
        </label>
        <div className="relative">
          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <select
            name="neighborhoodId"
            className="w-full h-11 pl-10 pr-4 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition appearance-none bg-white"
          >
            <option value="">Any area in Jos</option>
            {neighborhoods.map((n) => (
              <option key={n.id} value={n.id}>
                {n.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
          What do you need?
        </label>
        <div className="relative">
          <MessageSquare className="absolute left-3.5 top-3.5 h-4 w-4 text-neutral-400" />
          <textarea
            name="description"
            rows={4}
            placeholder="e.g. I need a reliable tailor who can make a suit in 3 days near Rayfield..."
            className="w-full pl-10 pr-4 py-3 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition resize-none"
          />
        </div>
        {!state?.success && state?.errors?.description && (
          <p className="mt-1 text-xs text-red-500">{state.errors.description[0]}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full h-12 flex items-center justify-center gap-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl transition-colors"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send my request"
        )}
      </button>

      <p className="text-xs text-center text-neutral-400">
        We'll reach out to you via phone or WhatsApp.
      </p>
    </form>
  );
}