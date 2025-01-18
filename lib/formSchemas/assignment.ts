import { z } from "zod";

export const assignmentSchema = z.object({
    id: z.coerce.number().optional(),
    title: z.string().min(1, { message: "Assignement title is required!" }),
    startDate: z.coerce.date({ message: "Start date is required!" }),
    dueDate: z.coerce.date({ message: "Due date is required!" }),
    subjectId: z.coerce.number().min(1, { message: "Subject name is required!" }),
    classId: z.coerce.number().min(1, { message: "Class name is required!" }),
    teacherId: z.string().min(1, { message: "Teacher name is required!" }),
});
export type assignmentSchemaType = z.infer<typeof assignmentSchema>;