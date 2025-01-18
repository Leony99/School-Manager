"use server";

import { assignmentSchemaType } from "@/lib/formSchemas/assignment";
import prisma from "../prisma";

type CurrentState = { success: boolean; error: boolean };

export const createAssignment = async (
    currentState: CurrentState,
    data: assignmentSchemaType
) => {
    try {
        await prisma.assignment.create({
            data,
        });

        return { success: true, error: false };
    } catch (err) {
        return { success: false, error: true };
    }
};

export const updateAssignment = async (
    currentState: CurrentState,
    data: assignmentSchemaType
) => {
    try {
        await prisma.assignment.update({
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

export const deleteAssignment = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    try {
        await prisma.assignment.delete({
            where: {
                id: parseInt(id),
            },
        });

        return { success: true, error: false };
    } catch (err) {
        return { success: false, error: true };
    }
};