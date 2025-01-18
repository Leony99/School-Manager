import { z } from "zod";

export const lessonSchema = z.object({
    id: z.coerce.number().optional(),
    name: z.string().min(1, { message: "Lesson name is required!" }),
    startTime: z.coerce.date({ message: "Start time is required!" }),
    endTime: z.coerce.date({ message: "End time is required!" }),
    subjectId: z.coerce.number().min(1, { message: "Subject name is required!" }),
    classId: z.coerce.number().min(1, { message: "Class name is required!" }),
    teacherId: z.string().min(1, { message: "Teacher name is required!" }),
});
export type lessonSchemaType = z.infer<typeof lessonSchema>;