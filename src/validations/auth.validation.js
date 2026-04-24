const { z } = require("zod");

// 🔹 Reusable password schema
const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .regex(/[a-z]/, { message: "Must include at least one lowercase letter" })
  .regex(/[A-Z]/, { message: "Must include at least one uppercase letter" })
  .regex(/[0-9]/, { message: "Must include at least one number" })
  .regex(/[^a-zA-Z0-9]/, {
    message: "Must include at least one special character",
  });

// 🔹 Phone schema (BD format)
const phoneSchema = z
  .string()
  .trim()
  .regex(/^(?:\+8801[3-9]\d{8}|01[3-9]\d{8})$/, {
    message: "Please provide a valid Bangladeshi phone number",
  })
  .optional()
  .or(z.literal(""));

// 🔹 Registration Schema
const registrationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name must not exceed 50 characters" }),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: "Please provide a valid email address" }),

  password: passwordSchema,

  phone: phoneSchema,

  role: z
    .enum(["customer", "vendor"], {
      errorMap: () => ({ message: "Invalid role" }),
    })
    .optional()
    .default("customer"),
});

// 🔹 Login Schema (lighter validation)
const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: "Please provide a valid email address" }),

  password: z
    .string()
    .min(6, { message: "Password is required" }),
});

module.exports = {
  registrationSchema,
  loginSchema,
};