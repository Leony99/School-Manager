"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "./forms_components/InputField";
import { Dispatch, SetStateAction } from "react";

const schema = z.object({
    title: z
        .string()
        .min(3, { message: "Title name must be at least 3 characters long!" })
        .max(30, { message: "Title name must be at most 30 characters long!" }),
    class: z
        .string()
        .min(1, { message: "Class name must be at least 1 characters long!" })
        .max(10, { message: "Class name must be at most 10 characters long!" }),
    date: z
        .string().min(1, { message: "Date is required!" }),
    startTime: z
        .string().min(1, { message: "Start time is required!" }),
    endTime: z
        .string().min(1, { message: "End time is required!" }),

});

type Inputs = z.infer<typeof schema>;

const EventForm = ({
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
            <h1 className="text-xl font-semibold">{type === "create" ? "Create a new event" : "Update an event"}</h1>
            <div className="flex justify-around flex-wrap gap-4">
                <InputField
                    label="Title"
                    name="title"
                    defaultValue={data?.title}
                    register={register}
                    error={errors?.title}
                />
                <InputField
                    label="Class"
                    name="class"
                    defaultValue={data?.class}
                    register={register}
                    error={errors?.class}
                />
                <InputField
                    label="Date"
                    name="date"
                    defaultValue={data?.date}
                    register={register}
                    error={errors?.date}
                />
                <InputField
                    label="Start Time"
                    name="startTime"
                    defaultValue={data?.startTime}
                    register={register}
                    error={errors?.startTime}
                />
                <InputField
                    label="End Time"
                    name="endTime"
                    defaultValue={data?.endTime}
                    register={register}
                    error={errors?.endTime}
                />
            </div>
            <button className="bg-blue-400 text-white p-2 rounded-md">
                {type === "create" ? "Create" : "Update"}
            </button>
        </form>
    );
};

export default EventForm;