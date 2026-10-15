
import { serviceRequestSchema } from "@/lib/validations/serviceRequests";
import { createServiceRequest } from "@/lib/data/serviceRequests";
import { checkRateLimit, RATE_LIMIT_CONFIG } from "@/lib/security/rateLimit";

/**
 * Service layer responsibility: business logic.
 *
 * Enforces:
 * - Distributed rate limiting per client IP (prevents automated flooding)
 * - Distributed rate limiting per phone number (prevents phone spam)
 * - Schema validation via Zod
 * - Atomic persistence to PostgreSQL
 */

export interface ServiceRequestContext {
  clientIp?: string;
}

export type ServiceRequestResult =
  | { success: true;  message: string }
  | { success: false; errors: Record<string, string[]> }
  | { success: false; message: string };

export async function submitServiceRequest(
  input: unknown,
  context?: ServiceRequestContext
): Promise<ServiceRequestResult> {
  // 1. IP-level rate limiting check (mitigates automated submission spikes per connection)
  const clientIp = context?.clientIp || "anonymous";
  const ipCheck = await checkRateLimit({
    action: "service_request_ip",
    identifier: clientIp,
    limit: RATE_LIMIT_CONFIG.MAX_REQUESTS_PER_IP,
    windowMs: RATE_LIMIT_CONFIG.WINDOW_MS,
  });

  if (!ipCheck.success) {
    return {
      success: false,
      message: "Too many requests from your connection. Please wait a few minutes before trying again.",
    };
  }

  // 2. Validate input schema
  const result = serviceRequestSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  // 3. Phone-level rate limiting check (mitigates repeated spam to a specific phone number)
  const phoneCheck = await checkRateLimit({
    action: "service_request_phone",
    identifier: result.data.phone,
    limit: RATE_LIMIT_CONFIG.MAX_REQUESTS_PER_PHONE,
    windowMs: RATE_LIMIT_CONFIG.WINDOW_MS,
  });

  if (!phoneCheck.success) {
    return {
      success: false,
      message: "Too many requests for this phone number. Please wait a few minutes before trying again.",
    };
  }

  // 4. Save to database
  try {
    await createServiceRequest(result.data);
    return {
      success: true,
      message: "Your request has been received. We'll be in touch shortly.",
    };
  } catch (error) {
    console.error("[submitServiceRequest]", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}