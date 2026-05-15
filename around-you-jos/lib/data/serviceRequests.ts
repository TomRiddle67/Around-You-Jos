import { prisma } from "@/lib/prisma";
import type { ServiceRequestInput } from "@/lib/validations/serviceRequest";

/**
 * Data layer responsibility: database operations only.
 * No validation here. No business logic here.
 * Just: take clean data, write to database, return result.
 */
export async function createServiceRequest(input: ServiceRequestInput) {
  return prisma.serviceRequest.create({
    data: {
      name:          input.name,
      phone:         input.phone,
      description:   input.description,
      neighborhoodId: input.neighborhoodId ?? null,
    },
  });
}