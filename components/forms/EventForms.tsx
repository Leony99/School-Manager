"use client";

import { useForm } from "react-hook-form";
import { eventSchema, eventSchemaType } from "@/lib/formSchemas/event";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "./forms_components/InputField";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect } from "react";
import { createEvent, updateEvent } from "@/lib/formActions/event";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const EventForm = ({
    setOpen,
    type,
    data,
    relatedData,
}: {
    setOpen: Dispatch<SetStateAction<boolean>>;
    type: "create" | "update";
    data?: any;
    relatedData?: any;
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<eventSchemaType>({
        resolver: zodResolver(eventSchema),
    });

    const [state, formAction] = useActionState(
        type === "create" ? createEvent : updateEvent,
        {
            success: false,
            error: false,
        }
    );

    const onSubmit = handleSubmit((data) => {
        startTransition(() => formAction(data));
    });

    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            toast(`Event has been ${type === "create" ? "created" : "updated"}!`);
            setOpen(false);
            router.refresh();
        }
    }, [state, router, setOpen]);

    const { classes } = relatedData;

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
                    label="Description"
                    name="description"
                    defaultValue={data?.description}
                    register={register}
                    error={errors?.description}
                />
                <InputField
                    label="Start time"
                    name="startTime"
                    defaultValue={
                        data?.startTime
                            ? new Date(data.startTime).toISOString().slice(0, 16)
                            : ""
                    }
                    register={register}
                    error={errors.startTime}
                    type="datetime-local"
                />
                <InputField
                    label="end Time"
                    name="endTime"
                    defaultValue={
                        data?.endTime
                            ? new Date(data.endTime).toISOString().slice(0, 16)
                            : ""
                    }
                    register={register}
                    error={errors.endTime}
                    type="datetime-local"
                />
                {data && (
                    <InputField
                        label="Id"
                        name="id"
                        defaultValue={data?.id}
                        register={register}
                        error={errors?.id}
                        hidden
                    />
                )}

                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Class</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("classId")}
                        defaultValue={data?.classId}
                    >
                        <option value="" key={0}>None</option>
                        {classes.map(
                            (item: { id: string; name: string }) => (
                                <option value={item.id} key={item.id}>
                                    {item.name}
                                </option>
                            )
                        )}
                    </select>
                    {errors.classId?.message && (
                        <p className="text-xs text-red-400">
                            {errors.classId.message.toString()}
                        </p>
                    )}
                </div>

            </div>

            {state.error && (
                <span className="text-red-500">Something went wrong!</span>
            )}
            <button className="bg-blue-400 text-white p-2 rounded-md">
                {type === "create" ? "Create" : "Update"}
            </button>
        </form>
    );
};

export default EventForm;