// checkFieldRequired.tsx
import { z } from "zod";

export function isFieldRequired(schema: z.ZodTypeAny, fieldPath: string): boolean {
  // Split the field path into parts (e.g., "skill.technical_skill" -> ["skill", "technical_skill"])
  const pathParts = fieldPath.split(".");
  let currentSchema: z.ZodTypeAny = schema;

  for (const part of pathParts) {
    if (currentSchema instanceof z.ZodObject) {
      const shape = currentSchema.shape;
      if (shape[part] instanceof z.ZodOptional || shape[part] instanceof z.ZodNullable) {
        return false; // Field is optional if wrapped in ZodOptional or ZodNullable
      }
      currentSchema = shape[part];
    } else if (currentSchema instanceof z.ZodArray) {
      currentSchema = currentSchema.element; // Move to the element type of the array
    } else {
      throw new Error(`"${fieldPath}" is not a ZodObject or ZodArray`);
    }
  }

  // Check if the final schema is required (not optional or nullable)
  return !(currentSchema instanceof z.ZodOptional || currentSchema instanceof z.ZodNullable);
}