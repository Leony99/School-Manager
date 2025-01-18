import { z } from "zod";

export const eventSchema = z.object({
    id: z.coerce.number().optional(),
    title: z
        .string()
        .min(1, { message: "Title must be at least 3 characters long!" })
        .max(30, { message: "Title must be at most 30 characters long!" }),
    description: z
        .string()
        .min(3, { message: "Description must be at least 1 characters long!" })
        .max(120, { message: "Description must be at most 120 characters long!" }),
    startTime: z.coerce.date({ message: "Start time is required!" }),
    endTime: z.coerce.date({ message: "End time is required!" }),
    classId: z.coerce.number().optional(),
});
export type eventSchemaType = z.infer<typeof eventSchema>;