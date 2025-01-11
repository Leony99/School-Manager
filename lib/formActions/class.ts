"use server";

import { ClassSchemaType } from "@/lib/formSchemas/class";
import prisma from "../prisma";

type CurrentState = { success: boolean; error: boolean };

export const createClass = async (
    currentState: CurrentState,
    data: ClassSchemaType
) => {
    try {
        await prisma.class.create({
            data,
        });

        return { success: true, error: false };
    } catch (err) {
        return { success: false, error: true };
    }
};

export const updateClass = async (
    currentState: CurrentState,
    data: ClassSchemaType
) => {
    try {
        await prisma.class.update({
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

export const deleteClass = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    try {
        await prisma.class.delete({
            where: {
                id: parseInt(id),
            },
        });

        return { success: true, error: false };
    } catch (err) {
        return { success: false, error: true };
    }
};