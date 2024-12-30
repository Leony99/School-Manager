"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "./forms_components/InputField";
import { Dispatch, SetStateAction } from "react";

const schema = z.object({
    subject: z
        .string()
        .min(2, { message: "Subject name must be at least 2 characters long!" })
        .max(30, { message: "Subject name must be at most 30 characters long!" }),
    class: z
        .string()
        .min(1, { message: "Class name must be at least 1 characters long!" })
        .max(10, { message: "Class name must be at most 10 characters long!" }),
    teacher: z
        .string().min(1, { message: "Teacher name is required!" }),
});

type Inputs = z.infer<typeof schema>;

const LessonForm = ({
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
            <h1 className="text-xl font-semibold">{type === "create" ? "Create a new lesson" : "Update a lesson"}</h1>
            <div className="flex justify-around flex-wrap gap-4">
                <InputField
                    label="Subject name"
                    name="name"
                    defaultValue={data?.subject.name}
                    register={register}
                    error={errors?.subject}
                />
                <InputField
                    label="Class"
                    name="class"
                    defaultValue={data?.class.name}
                    register={register}
                    error={errors?.class}
                />
                <InputField
                    label="Teacher name"
                    name="teacher"
                    defaultValue={`${data?.teacher.name} ${data?.teacher.surname}`}
                    register={register}
                    error={errors?.teacher}
                />
            </div>
            <button className="bg-blue-400 text-white p-2 rounded-md">
                {type === "create" ? "Create" : "Update"}
            </button>
        </form>
    );
};

export default LessonForm;