"use server";

import { eventSchemaType } from "@/lib/formSchemas/event";
import prisma from "../prisma";

type CurrentState = { success: boolean; error: boolean };

export const createEvent = async (
    currentState: CurrentState,
    data: eventSchemaType
) => {
    try {
        const startTime = new Date(data.startTime);
        const endTime = new Date(data.endTime);

        const startTimeLocal = new Date(
            startTime.getTime() - startTime.getTimezoneOffset() * 60000
        );
        const endTimeLocal = new Date(
            endTime.getTime() - endTime.getTimezoneOffset() * 60000
        );

        await prisma.event.create({
            data: {
                ...data,
                startTime: startTimeLocal,
                endTime: endTimeLocal,
                classId: data.classId ? data.classId : null,
            }
        });

        return { success: true, error: false };
    } catch (err) {
        return { success: false, error: true };
    }
};

export const updateEvent = async (
    currentState: CurrentState,
    data: eventSchemaType
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
        await prisma.event.update({
            where: {
                id: data.id,
            },
            data: {
                ...data,
                startTime: startTimeLocal,
                endTime: endTimeLocal,
                classId: data.classId ? data.classId : null,
            }
        });

        return { success: true, error: false };
    } catch (err) {
        return { success: false, error: true };
    }
};

export const deleteEvent = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    try {
        await prisma.event.delete({
            where: {
                id: parseInt(id),
            },
        });

        return { success: true, error: false };
    } catch (err) {
        return { success: false, error: true };
    }
};