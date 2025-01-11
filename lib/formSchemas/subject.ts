import { z } from "zod";

export const subjectSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(3, { message: "Subject must be at least 3 characters long!" }),
  teachers: z.array(z.string()),
});
export type SubjectSchemaType = z.infer<typeof subjectSchema>;