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


const vendorValidationSchema = z.object({
  name: z.string().trim().min(2).max(50),

  email: z.string().trim().toLowerCase().email(),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[a-z]/, { message: "Must include lowercase letter" })
    .regex(/[A-Z]/, { message: "Must include uppercase letter" })
    .regex(/[0-9]/, { message: "Must include number" })
    .regex(/[^a-zA-Z0-9]/, { message: "Must include special character" }),

  phone: z
    .string()
    .trim()
    .regex(/^(?:\+8801[3-9]\d{8}|01[3-9]\d{8})$/, {
      message: "Please provide a valid Bangladeshi phone number",
    })
    .optional(),

  // 🔹 Vendor specific
  shopName: z
    .string()
    .trim()
    .min(3, { message: "Shop name must be at least 3 characters" })
    .max(100),

  shopDescription: z.string().trim().max(1000).optional(),

  shopAddress: z.string().trim().min(10).max(200),

  nidNumber: z
    .string()
    .trim()
    .regex(/^\d{10,17}$/, {
      message: "NID must be between 10 to 17 digits",
    }),

  // 🔹 Bank Info (nested object)
  bankInfo: z.object({
    bankName: z.string().trim().min(2).max(100),
    branchName: z.string().trim().min(2).max(100),
    accountNumber: z
      .string()
      .trim()
      .regex(/^\d{10,20}$/, {
        message: "Account number must be 10-20 digits",
      }),
    accountHolderName: z.string().trim().min(2).max(100),
  }),
});



module.exports = {
  registrationSchema,
  loginSchema,
  vendorValidationSchema
};