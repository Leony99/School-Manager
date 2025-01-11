import { z } from "zod";

export const parentSchema = z.object({
    id: z.string().optional(),
    username: z
      .string()
      .min(4, { message: "Username must be at least 4 characters long!" })
      .max(20, { message: "Username must be at most 20 characters long!" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long!" }),
    name: z.string().min(1, { message: "First name is required!" }),
    surname: z.string().min(1, { message: "Last name is required!" }),
    email: z
      .string()
      .email({ message: "Invalid email address!" })
      .optional()
      .or(z.literal("")),
    phone: z.string().optional(),
    address: z.string(),
    students: z.array(z.string()).optional(),
  });
  export type ParentSchemaType = z.infer<typeof parentSchema>;