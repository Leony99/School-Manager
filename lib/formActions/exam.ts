"use server";

import { examSchemaType } from "@/lib/formSchemas/exam";
import prisma from "../prisma";

type CurrentState = { success: boolean; error: boolean };

export const createExam = async (
    currentState: CurrentState,
    data: examSchemaType
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
        await prisma.exam.create({
            data: {
                ...data,
                startTime: startTimeLocal,
                endTime: endTimeLocal
            }
        });

        return { success: true, error: false };
    } catch (err) {
        return { success: false, error: true };
    }
};

export const updateExam = async (
    currentState: CurrentState,
    data: examSchemaType
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
        await prisma.exam.update({
            where: {
                id: data.id,
            },
            data: {
                ...data,
                startTime: startTimeLocal,
                endTime: endTimeLocal
            }
        });

        return { success: true, error: false };
    } catch (err) {
        return { success: false, error: true };
    }
};

export const deleteExam = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    try {
        await prisma.exam.delete({
            where: {
                id: parseInt(id),
            },
        });

        return { success: true, error: false };
    } catch (err) {
        return { success: false, error: true };
    }
};