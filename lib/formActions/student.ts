"use server";

import { StudentSchemaType } from "@/lib/formSchemas/student";
import prisma from "../prisma";
import { clerkClient } from "@clerk/nextjs/server";

type CurrentState = { success: boolean; error: boolean };

export const createStudent = async (
    currentState: CurrentState,
    data: StudentSchemaType
) => {
    try {
        const classItem = await prisma.class.findUnique({
            where: { id: data.classId },
            include: { _count: { select: { students: true } } },
        });

        if (classItem && classItem.capacity <= classItem._count.students) {
            return { success: false, error: true };
        }

        const client = await clerkClient();
        const user = await client.users.createUser({
            username: data.username,
            password: data.password,
            firstName: data.name,
            lastName: data.surname,
            publicMetadata: { role: "student" }
        });

        await prisma.student.create({
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
                gradeId: data.gradeId,
                classId: data.classId,
            },
        });

        return { success: true, error: false };
    } catch (err) {
        return { success: false, error: true };
    }
};

export const updateStudent = async (
    currentState: CurrentState,
    data: StudentSchemaType
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

        await prisma.student.update({
            where: {
                id: data.id,
            },
            data: {
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
                gradeId: data.gradeId,
                classId: data.classId,
            },
        });

        return { success: true, error: false };
    } catch (err) {
        return { success: false, error: true };
    }
};

export const deleteStudent = async (
    currentState: CurrentState,
    data: FormData
) => {
    const id = data.get("id") as string;
    try {
        const client = await clerkClient();
        await client.users.deleteUser(id);

        await prisma.student.delete({
            where: {
                id: id,
            },
        });

        return { success: true, error: false };
    } catch (err) {
        return { success: false, error: true };
    }
};