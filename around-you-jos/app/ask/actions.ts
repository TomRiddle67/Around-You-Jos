"use server";

import { submitServiceRequest } from "@/lib/services/serviceRequests";
import { getClientIp } from "@/lib/security/clientIp";

export async function submitRequestAction(
  _prevState: unknown,
  formData: FormData
) {
  const clientIp = await getClientIp();

  const input = {
    name:           formData.get("name"),
    phone:          formData.get("phone"),
    description:    formData.get("description"),
    neighborhoodId: formData.get("neighborhoodId") || undefined,
  };

  return submitServiceRequest(input, { clientIp });
}