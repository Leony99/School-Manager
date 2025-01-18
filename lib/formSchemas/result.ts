import { z } from "zod";

export const resultSchema = z.object({
    id: z.coerce.number().optional(),
    score: z.number()
    .min(0, { message: "Score must be at least 0!" })
    .max(100, { message: "Score must be at most 100!" }),
    examId: z.coerce.number().optional(),
    studentId: z.string().min(1, { message: "Student name is required!" }),
});
export type resultSchemaType = z.infer<typeof resultSchema>;