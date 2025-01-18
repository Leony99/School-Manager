import { z } from "zod";

export const examSchema = z.object({
    id: z.coerce.number().optional(),
    title: z.string().min(1, { message: "Exam title is required!" }),
    startTime: z.coerce.date({ message: "Start time is required!" }),
    endTime: z.coerce.date({ message: "End time is required!" }),
    subjectId: z.coerce.number().min(1, { message: "Subject name is required!" }),
    classId: z.coerce.number().min(1, { message: "Class name is required!" }),
    teacherId: z.string().min(1, { message: "Teacher name is required!" }),
});
export type examSchemaType = z.infer<typeof examSchema>;