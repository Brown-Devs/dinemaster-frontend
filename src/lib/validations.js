// app/lib/validations.js
import z from "zod";

export const adminSchema = z.object({
  active: z.boolean().default(true),
  uniqueId: z
    .string()
    .min(3, "Unique ID must be at least 3 characters long")
    .regex(/^[a-z0-9_]+$/, {
      message:
        "Unique ID can only contain lowercase letters, numbers and underscores",
    }),
  systemRole: z.string(),
  name: z.string().min(2, "Name is required."),
  email: z.string().email().optional().or(z.literal("")),
  phoneNo: z.string(),
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 6, {
      message: "Password must be at least 6 characters",
    }),
});

export const subAdminSchema = z.object({
  active: z.boolean().default(true),
  uniqueId: z
    .string()
    .min(3, "Unique ID must be at least 3 characters long")
    .regex(/^[a-z0-9_]+$/, {
      message:
        "Unique ID can only contain lowercase letters, numbers and underscores",
    }),
  systemRole: z.string(),
  name: z.string().min(2, "Name is required."),
  email: z.string().email().optional().or(z.literal("")),
  phoneNo: z.string(),
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 6, {
      message: "Password must be at least 6 characters",
    }),
  permissions: z.array(z.string()).optional(),
});
