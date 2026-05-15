"use server";

import { submitServiceRequest } from "@/lib/services/serviceRequests";

export async function submitRequestAction(
  _prevState: unknown,
  formData: FormData
) {
  const input = {
    name:           formData.get("name"),
    phone:          formData.get("phone"),
    description:    formData.get("description"),
    neighborhoodId: formData.get("neighborhoodId") || undefined,
  };

  return submitServiceRequest(input);
}