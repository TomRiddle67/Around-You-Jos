import { describe, it, expect } from "vitest";
import { serviceRequestSchema } from "@/lib/validations/serviceRequests";

describe("serviceRequestSchema", () => {
  const validPayload = {
    name: "Amina Ibrahim",
    phone: "+234 801 234 5678",
    description: "Looking for an experienced tailor for traditional attire.",
    neighborhoodId: "neighborhood-cuid-123",
  };

  describe("valid submissions", () => {
    it("accepts a complete valid payload", () => {
      const result = serviceRequestSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validPayload);
      }
    });

    it("accepts a valid payload without optional neighborhoodId", () => {
      const payloadWithoutNeighborhood = {
        name: validPayload.name,
        phone: validPayload.phone,
        description: validPayload.description,
      };
      const result = serviceRequestSchema.safeParse(payloadWithoutNeighborhood);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.neighborhoodId).toBeUndefined();
      }
    });

    it("accepts neighborhoodId explicitly passed as undefined", () => {
      const result = serviceRequestSchema.safeParse({
        ...validPayload,
        neighborhoodId: undefined,
      });
      expect(result.success).toBe(true);
    });
  });

  describe("name field validation", () => {
    it("rejects missing name", () => {
      const rest = {
        phone: validPayload.phone,
        description: validPayload.description,
        neighborhoodId: validPayload.neighborhoodId,
      };
      const result = serviceRequestSchema.safeParse(rest);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.name).toBeDefined();
      }
    });

    it("rejects non-string name", () => {
      const result = serviceRequestSchema.safeParse({
        ...validPayload,
        name: 12345,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.name).toBeDefined();
      }
    });

    it("rejects name shorter than 2 characters", () => {
      const result = serviceRequestSchema.safeParse({
        ...validPayload,
        name: "A",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.name).toBeDefined();
      }
    });

    it("accepts name at minimum boundary of 2 characters", () => {
      const result = serviceRequestSchema.safeParse({
        ...validPayload,
        name: "Jo",
      });
      expect(result.success).toBe(true);
    });

    it("accepts name at maximum boundary of 100 characters", () => {
      const result = serviceRequestSchema.safeParse({
        ...validPayload,
        name: "A".repeat(100),
      });
      expect(result.success).toBe(true);
    });

    it("rejects name exceeding 100 characters", () => {
      const result = serviceRequestSchema.safeParse({
        ...validPayload,
        name: "A".repeat(101),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.name).toBeDefined();
      }
    });
  });

  describe("phone field validation", () => {
    it("rejects missing phone", () => {
      const rest = {
        name: validPayload.name,
        description: validPayload.description,
        neighborhoodId: validPayload.neighborhoodId,
      };
      const result = serviceRequestSchema.safeParse(rest);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.phone).toBeDefined();
      }
    });

    it("rejects non-string phone", () => {
      const result = serviceRequestSchema.safeParse({
        ...validPayload,
        phone: 8012345678,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.phone).toBeDefined();
      }
    });

    it("rejects phone shorter than 10 characters", () => {
      const result = serviceRequestSchema.safeParse({
        ...validPayload,
        phone: "+23480123",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.phone).toBeDefined();
      }
    });

    it("accepts phone at minimum boundary of 10 valid characters", () => {
      const result = serviceRequestSchema.safeParse({
        ...validPayload,
        phone: "0801234567",
      });
      expect(result.success).toBe(true);
    });

    it("accepts phone at maximum boundary of 20 characters", () => {
      const result = serviceRequestSchema.safeParse({
        ...validPayload,
        phone: "+234 (801) 123-45678",
      });
      expect(result.success).toBe(true);
    });

    it("rejects phone exceeding 20 characters", () => {
      const result = serviceRequestSchema.safeParse({
        ...validPayload,
        phone: "+234 801 234 5678 9999",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.phone).toBeDefined();
      }
    });

    it("rejects phone with invalid characters (letters or special symbols)", () => {
      const invalidPhoneCases = [
        "phone-number-here",
        "+234 801 234 ABCD",
        "08012345678@email",
        "08012345678#12",
      ];

      for (const phone of invalidPhoneCases) {
        const result = serviceRequestSchema.safeParse({
          ...validPayload,
          phone,
        });
        expect(result.success, `Expected phone "${phone}" to be rejected`).toBe(false);
        if (!result.success) {
          expect(result.error.flatten().fieldErrors.phone).toBeDefined();
        }
      }
    });

    it("accepts phone formats standard in Nigeria (spaces, plus sign, hyphens)", () => {
      const validPhoneCases = [
        "+2348012345678",
        "+234 801 234 5678",
        "08012345678",
        "0801-234-5678",
        "+234 (0) 801 234",
      ];

      for (const phone of validPhoneCases) {
        const result = serviceRequestSchema.safeParse({
          ...validPayload,
          phone,
        });
        expect(result.success, `Expected phone "${phone}" to be accepted`).toBe(true);
      }
    });
  });

  describe("description field validation", () => {
    it("rejects missing description", () => {
      const rest = {
        name: validPayload.name,
        phone: validPayload.phone,
        neighborhoodId: validPayload.neighborhoodId,
      };
      const result = serviceRequestSchema.safeParse(rest);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.description).toBeDefined();
      }
    });

    it("rejects non-string description", () => {
      const result = serviceRequestSchema.safeParse({
        ...validPayload,
        description: ["Need", "a", "mechanic"],
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.description).toBeDefined();
      }
    });

    it("rejects description shorter than 10 characters", () => {
      const result = serviceRequestSchema.safeParse({
        ...validPayload,
        description: "Need help",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.description).toBeDefined();
      }
    });

    it("accepts description at minimum boundary of 10 characters", () => {
      const result = serviceRequestSchema.safeParse({
        ...validPayload,
        description: "0123456789",
      });
      expect(result.success).toBe(true);
    });

    it("accepts description at maximum boundary of 500 characters", () => {
      const result = serviceRequestSchema.safeParse({
        ...validPayload,
        description: "D".repeat(500),
      });
      expect(result.success).toBe(true);
    });

    it("rejects description exceeding 500 characters", () => {
      const result = serviceRequestSchema.safeParse({
        ...validPayload,
        description: "D".repeat(501),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.description).toBeDefined();
      }
    });
  });

  describe("neighborhoodId field validation", () => {
    it("rejects non-string neighborhoodId", () => {
      const result = serviceRequestSchema.safeParse({
        ...validPayload,
        neighborhoodId: 12345,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.neighborhoodId).toBeDefined();
      }
    });

    it("accepts valid string neighborhoodId", () => {
      const result = serviceRequestSchema.safeParse({
        ...validPayload,
        neighborhoodId: "millionaires-quarters-id",
      });
      expect(result.success).toBe(true);
    });
  });
});
