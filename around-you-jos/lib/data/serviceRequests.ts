import { prisma } from "@/lib/prisma";
import type { ServiceRequestInput } from "@/lib/validations/serviceRequests";

export async function createServiceRequest(input: ServiceRequestInput) {
  return prisma.serviceRequest.create({
    data: {
      name:           input.name,
      phone:          input.phone,
      description:    input.description,
      neighborhoodId: input.neighborhoodId ?? null,
    },
  });
}
