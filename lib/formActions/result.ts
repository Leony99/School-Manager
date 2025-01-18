"use server";

import { resultSchemaType } from "@/lib/formSchemas/result";
import prisma from "../prisma";

type CurrentState = { success: boolean; error: boolean };

export const createResult = async (
    currentState: CurrentState,
    data: resultSchemaType
) => {
    try {
        await prisma.result.create({
            data,
        });

        return { success: true, error: false };
    } catch (err) {
        return { success: false, error: true };
    }
};

export const updateResult = async (
    currentState: CurrentState,
    data: resultSchemaType
) => {
    try {
        await prisma.result.update({
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

export const deleteResult = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    try {
        await prisma.result.delete({
            where: {
                id: parseInt(id),
            },
        });

        return { success: true, error: false };
    } catch (err) {
        return { success: false, error: true };
    }
};