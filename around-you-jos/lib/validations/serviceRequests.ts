
import { z } from "zod";

/**
 * This schema is the single source of truth for what a valid
 * service request looks like. It's used in the Server Action
 * to validate before touching the database.
 *
 * Why Zod instead of manual if/else checks?
 * - One schema replaces 10+ if statements
 * - Error messages are automatic and descriptive
 * - The inferred TypeScript type stays in sync automatically
 * - Easy to extend later (add fields, change rules)
 */
export const serviceRequestSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),

  phone: z
    .string()
    .min(10, "Enter a valid phone number")
    .max(20, "Phone number is too long")
    .regex(/^[+\d\s()-]+$/, "Enter a valid phone number"),

  description: z
    .string()
    .min(10, "Please describe what you need in more detail")
    .max(500, "Description is too long (max 500 characters)"),

  neighborhoodId: z
    .string()
    .optional(),
});

/**
 * Infer the TypeScript type directly from the schema.
 * This means the type and validation rules never go out of sync.
 * If you add a field to the schema, the type updates automatically.
 */
export type ServiceRequestInput = z.infer<typeof serviceRequestSchema>;