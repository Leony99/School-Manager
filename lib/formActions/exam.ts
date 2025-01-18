"use server";

import { examSchemaType } from "@/lib/formSchemas/exam";
import prisma from "../prisma";

type CurrentState = { success: boolean; error: boolean };

export const createExam = async (
    currentState: CurrentState,
    data: examSchemaType
) => {
    try {
        await prisma.exam.create({
            data,
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
    try {
        await prisma.exam.update({
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