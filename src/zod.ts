import { z } from "zod";
import { ObjectId } from "mongodb";

// Validate a UUID
export const uuidSchema = z.object({ uuid: z.string().uuid() });

// Validate a Mongodb ObjectId
export const objectIdSchema = z.string().refine((val) => ObjectId.isValid(val), {
  message: "Invalid ObjectId"
});
