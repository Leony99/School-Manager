"use server";

import { TeacherSchemaType } from "@/lib/formSchemas/teacher";
import prisma from "../prisma";
import { clerkClient } from "@clerk/nextjs/server";

type CurrentState = { success: boolean; error: boolean };

export const createTeacher = async (
    currentState: CurrentState,
    data: TeacherSchemaType
) => {
    try {
        const client = await clerkClient();
        const user = await client.users.createUser({
            username: data.username,
            password: data.password,
            firstName: data.name,
            lastName: data.surname,
            publicMetadata: { role: "teacher" }
        });

        await prisma.teacher.create({
            data: {
                id: user.id,
                username: data.username,
                password: data.password,
                name: data.name,
                surname: data.surname,
                email: data.email || null,
                phone: data.phone || null,
                address: data.address,
                img: data.img || null,
                bloodType: data.bloodType,
                sex: data.sex,
                birthday: data.birthday,
                subjects: {
                    connect: data.subjects?.map((subjectId: string) => ({
                        id: parseInt(subjectId),
                    })),
                },
            },
        });

        return { success: true, error: false };
    } catch (err) {
        return { success: false, error: true };
    }
};

export const updateTeacher = async (
    currentState: CurrentState,
    data: TeacherSchemaType
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
            img: data.img || null,
            bloodType: data.bloodType,
            sex: data.sex,
            birthday: data.birthday,
        };

        if (data.subjects && data.subjects.length > 0) {
            updateData.subjects = {
                set: data.subjects.map((subjectId: string) => ({
                    id: parseInt(subjectId),
                })),
            };
        }

        await prisma.teacher.update({
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

export const deleteTeacher = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    try {
        const client = await clerkClient();
        await client.users.deleteUser(id);

        await prisma.teacher.delete({
            where: {
                id: id,
            },
        });

        return { success: true, error: false };
    } catch (err) {
        return { success: false, error: true };
    }
};