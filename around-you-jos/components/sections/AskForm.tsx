"use client";

import { useActionState } from "react";
import { submitRequestAction } from "@/app/ask/actions";
import { MapPin, Phone, MessageSquare, User, Loader2 } from "lucide-react";

type ActionResult =
  | { success: true;  message: string }
  | { success: false; errors?: Record<string, string[]>; message?: string }
  | null;

interface AskFormProps {
  neighborhoods: { id: string; name: string }[];
}

const inputStyle = {
  background: "var(--bg-subtle)",
  border: "0.5px solid var(--border)",
  color: "var(--fg)",
};

const labelStyle = {
  color: "var(--fg-muted)",
};

export function AskForm({ neighborhoods }: AskFormProps) {
  const [state, formAction, isPending] = useActionState(
    submitRequestAction,
    null
  );

  if (state?.success) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full mb-4"
          style={{ background: "var(--green-bg)" }}
        >
          <svg className="h-7 w-7" style={{ color: "var(--green)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: "var(--fg)" }}>Request received</h2>
        <p className="text-sm max-w-sm mx-auto" style={{ color: "var(--fg-muted)" }}>{state.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-4 py-2 text-sm font-medium transition-colors"
          style={{ color: "var(--green)" }}
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {state && !state.success && state.message && (
        <div className="p-3 rounded-lg text-sm"
          style={{ background: "#fef2f2", border: "0.5px solid #fecaca", color: "#dc2626" }}
        >
          {state.message}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1.5" style={labelStyle}>
          Your name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--fg-subtle)" }} />
          <input
            type="text"
            name="name"
            placeholder="e.g. Amina Ibrahim"
            className="w-full h-10 pl-9 pr-4 text-sm rounded-md outline-none transition-all"
            style={inputStyle}
          />
        </div>
        {!state?.success && state?.errors?.name && (
          <p className="mt-1 text-xs" style={{ color: "#dc2626" }}>{state.errors.name[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5" style={labelStyle}>
          Phone number
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--fg-subtle)" }} />
          <input
            type="tel"
            name="phone"
            placeholder="+234 801 234 5678"
            className="w-full h-10 pl-9 pr-4 text-sm rounded-md outline-none transition-all"
            style={inputStyle}
          />
        </div>
        {!state?.success && state?.errors?.phone && (
          <p className="mt-1 text-xs" style={{ color: "#dc2626" }}>{state.errors.phone[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5" style={labelStyle}>
          Which area? <span style={{ color: "var(--fg-subtle)", fontWeight: 400 }}>(optional)</span>
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--fg-subtle)" }} />
          <select
            name="neighborhoodId"
            className="w-full h-10 pl-9 pr-4 text-sm rounded-md outline-none transition-all appearance-none"
            style={inputStyle}
          >
            <option value="">Any area in Jos</option>
            {neighborhoods.map((n) => (
              <option key={n.id} value={n.id}>{n.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5" style={labelStyle}>
          What do you need?
        </label>
        <div className="relative">
          <MessageSquare className="absolute left-3 top-3 h-4 w-4" style={{ color: "var(--fg-subtle)" }} />
          <textarea
            name="description"
            rows={4}
            placeholder="e.g. I need a reliable tailor who can make a suit in 3 days near Rayfield..."
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-md outline-none transition-all resize-none"
            style={inputStyle}
          />
        </div>
        {!state?.success && state?.errors?.description && (
          <p className="mt-1 text-xs" style={{ color: "#dc2626" }}>{state.errors.description[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full h-11 flex items-center justify-center gap-2 text-sm font-semibold text-white rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ background: "var(--green)" }}
      >
        {isPending ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</>
        ) : (
          "Send my request"
        )}
      </button>

      <p className="text-xs text-center" style={{ color: "var(--fg-subtle)" }}>
        We&apos;ll reach out to you via phone or WhatsApp.
      </p>
    </form>
  );
}
