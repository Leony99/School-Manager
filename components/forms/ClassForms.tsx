"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "./forms_components/InputField";
import { Dispatch, SetStateAction } from "react";

const schema = z.object({
    name: z
        .string()
        .min(1, { message: "Class name must be at least 1 characters long!" })
        .max(10, { message: "Class name must be at most 10 characters long!" }),
    capacity: z
        .number()
        .min(1, { message: "Capacity must be at least 1!" })
        .max(100, { message: "Capacity must be at most 100!" }),
    grade: z
        .number()
        .min(1, { message: "Grade must be at least 1!" })
        .max(12, { message: "Grade must be at most 12!" }),
});

type Inputs = z.infer<typeof schema>;

const TeacherForm = ({
    setOpen,
    type,
    data,
}: {
    setOpen: Dispatch<SetStateAction<boolean>>;
    type: "create" | "update";
    data?: any;
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(schema),
    });

    const onSubmit = handleSubmit((data) => {
        console.log(data);
    });

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">{type === "create" ? "Create a new class" : "Update a class"}</h1>
            <div className="flex justify-around flex-wrap gap-4">
                <InputField
                    label="Class name"
                    name="name"
                    defaultValue={data?.name}
                    register={register}
                    error={errors?.name}
                />
                <InputField
                    label="Class capacity"
                    name="capacity"
                    type="number"
                    defaultValue={data?.capacity}
                    register={register}
                    error={errors?.capacity}
                />
                <InputField
                    label="Class grade"
                    name="grade"
                    type="number"
                    defaultValue={data?.grade.level}
                    register={register}
                    error={errors?.grade}
                />
            </div>
            <button className="bg-blue-400 text-white p-2 rounded-md">
                {type === "create" ? "Create" : "Update"}
            </button>
        </form>
    );
};

export default TeacherForm;