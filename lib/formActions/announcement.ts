"use server";

import { announcementSchemaType } from "@/lib/formSchemas/announcement";
import prisma from "../prisma";

type CurrentState = { success: boolean; error: boolean };

export const createAnnouncement = async (
    currentState: CurrentState,
    data: announcementSchemaType
) => {
    try {
        await prisma.announcement.create({
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

export const updateAnnouncement = async (
    currentState: CurrentState,
    data: announcementSchemaType
) => {
    console.log(data)
    try {
        await prisma.announcement.update({
            where: {
                id: data.id,
            },
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

export const deleteAnnouncement = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    try {
        await prisma.announcement.delete({
            where: {
                id: parseInt(id),
            },
        });

        return { success: true, error: false };
    } catch (err) {
        return { success: false, error: true };
    }
};