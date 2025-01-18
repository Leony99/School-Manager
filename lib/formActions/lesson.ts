"use server";

import { lessonSchemaType } from "@/lib/formSchemas/lesson";
import prisma from "../prisma";

type CurrentState = { success: boolean; error: boolean };

export const createLesson = async (
    currentState: CurrentState,
    data: lessonSchemaType
) => {
    try {
        await prisma.lesson.create({
            data,
        });

        return { success: true, error: false };
    } catch (err) {
        return { success: false, error: true };
    }
};

export const updateLesson = async (
    currentState: CurrentState,
    data: lessonSchemaType
) => {
    try {
        await prisma.lesson.update({
            where: {
                id: data.id,
            },
            data,
        });

        return { success: true, error: false };
    } catch (err) {
        return { success: false, error: true };
    }
};

export const deleteLesson = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    try {
        await prisma.lesson.delete({
            where: {
                id: parseInt(id),
            },
        });

        return { success: true, error: false };
    } catch (err) {
        return { success: false, error: true };
    }
};