"use server";

import { ParentSchemaType } from "@/lib/formSchemas/parent";
import prisma from "../prisma";
import { clerkClient } from "@clerk/nextjs/server";

type CurrentState = { success: boolean; error: boolean };

export const createParent = async (
    currentState: CurrentState,
    data: ParentSchemaType
) => {
    try {
        const client = await clerkClient();
        const user = await client.users.createUser({
            username: data.username,
            password: data.password,
            firstName: data.name,
            lastName: data.surname,
            publicMetadata: { role: "parent" }
        });

        await prisma.parent.create({
            data: {
                id: user.id,
                username: data.username,
                password: data.password,
                name: data.name,
                surname: data.surname,
                email: data.email || null,
                phone: data.phone || null,
                address: data.address,
                students: {
                    connect: data.students?.map((studentId: string) => ({
                        id: studentId,
                    })),
                },
            },
        });

        return { success: true, error: false };
    } catch (err) {
        return { success: false, error: true };
    }
};

export const updateParent = async (
    currentState: CurrentState,
    data: ParentSchemaType
) => {
    if (!data.id) {
        return { success: false, error: true };
    }
    try {
        const client = await clerkClient()
        const user = await client.users.updateUser(data.id, {
            username: data.username,
            ...(data.password !== "" && { password: data.password }),
            firstName: data.name,
            lastName: data.surname,
        });

        const updateData: any = {
            username: data.username,
            ...(data.password !== "" && { password: data.password }),
            name: data.name,
            surname: data.surname,
            email: data.email || null,
            phone: data.phone || null,
            address: data.address,
        };

        if (data.students && data.students.length > 0) {
            updateData.students = {
                set: data.students.map((studentId: string) => ({
                    id: studentId,
                })),
            };
        }

        await prisma.parent.update({
            where: {
                id: data.id,
            },
            data: updateData,
        });

        return { success: true, error: false };
    } catch (err) {
        return { success: false, error: true };
    }
};

export const deleteParent = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    try {
        const client = await clerkClient();
        await client.users.deleteUser(id);

        await prisma.parent.delete({
            where: {
                id: id,
            },
        });

        return { success: true, error: false };
    } catch (err) {
        return { success: false, error: true };
    }
};