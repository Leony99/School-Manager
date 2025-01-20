"use server";

import { lessonSchemaType } from "@/lib/formSchemas/lesson";
import prisma from "../prisma";

type CurrentState = { success: boolean; error: boolean };

export const createLesson = async (
    currentState: CurrentState,
    data: lessonSchemaType
) => {
    const startTime = new Date(data.startTime);
    const endTime = new Date(data.endTime);

    const startTimeLocal = new Date(
        startTime.getTime() - startTime.getTimezoneOffset() * 60000
    );
    const endTimeLocal = new Date(
        endTime.getTime() - endTime.getTimezoneOffset() * 60000
    );

    try {
        await prisma.lesson.create({
            data: {
                ...data,
                startTime: startTimeLocal,
                endTime: endTimeLocal,
            }
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
    const startTime = new Date(data.startTime);
    const endTime = new Date(data.endTime);

    const startTimeLocal = new Date(
        startTime.getTime() - startTime.getTimezoneOffset() * 60000
    );
    const endTimeLocal = new Date(
        endTime.getTime() - endTime.getTimezoneOffset() * 60000
    );

    try {
        await prisma.lesson.update({
            where: {
                id: data.id,
            },
            data: {
                ...data,
                startTime: startTimeLocal,
                endTime: endTimeLocal,
            }
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