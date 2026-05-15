
import { serviceRequestSchema, type ServiceRequestInput } from "@/lib/validations/serviceRequests";
import { createServiceRequest } from "@/lib/data/serviceRequests";

/**
 * Service layer responsibility: business logic.
 *
 * Right now it just validates and saves.
 * But this is where you'd later add:
 * - Send WhatsApp notification to admin
 * - Send confirmation SMS to user
 * - Check for duplicate requests
 * - Rate limiting per phone number
 * - Log analytics events
 *
 * The form doesn't need to know about any of that.
 * The data layer doesn't need to know about any of that.
 * It all lives here.
 */

type ServiceRequestResult =
  | { success: true;  message: string }
  | { success: false; errors: Record<string, string[]> }
  | { success: false; message: string };

export async function submitServiceRequest(
  input: unknown
): Promise<ServiceRequestResult> {
  // 1. Validate
  const result = serviceRequestSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  // 2. Save to database
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