"use server";

import { eventSchemaType } from "@/lib/formSchemas/event";
import prisma from "../prisma";

type CurrentState = { success: boolean; error: boolean };

export const createEvent = async (
    currentState: CurrentState,
    data: eventSchemaType
) => {
    try {
        await prisma.event.create({
            data: {
                ...data,
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
    try {
        await prisma.event.update({
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