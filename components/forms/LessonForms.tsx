"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "./forms_components/InputField";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect } from "react";
import { lessonSchema, lessonSchemaType } from "@/lib/formSchemas/lesson";
import { createLesson, updateLesson } from "@/lib/formActions/lesson";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const LessonForm = ({
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
    } = useForm<lessonSchemaType>({
        resolver: zodResolver(lessonSchema),
    });

    const [state, formAction] = useActionState(
        type === "create" ? createLesson : updateLesson,
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
            toast(`Lesson has been ${type === "create" ? "created" : "updated"}!`);
            setOpen(false);
            router.refresh();
        }
    }, [state, router, setOpen]);

    const { subjects, classes, teachers } = relatedData;

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">{type === "create" ? "Create a new lesson" : "Update a lesson"}</h1>
            <div className="flex justify-around flex-wrap gap-4">
                <InputField
                    label="Lesson name"
                    name="name"
                    defaultValue={data?.name}
                    register={register}
                    error={errors?.name}
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
                    <label className="text-xs text-gray-500">Subject</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("subjectId")}
                        defaultValue={data?.subjects}
                    >
                        {subjects.map(
                            (subject: { id: string; name: string }) => (
                                <option
                                    value={subject.id}
                                    key={subject.id}
                                    defaultValue={data && subject.id === data.subjectId}
                                >
                                    {subject.name}
                                </option>
                            )
                        )}
                    </select>
                    {errors.subjectId?.message && (
                        <p className="text-xs text-red-400">
                            {errors.subjectId.message.toString()}
                        </p>
                    )}
                </div>
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Class</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("classId")}
                        defaultValue={data?.classes}
                    >
                        {classes.map(
                            (item: { id: string; name: string }) => (
                                <option
                                    value={item.id}
                                    key={item.id}
                                    defaultValue={data && item.id === data.classId}
                                >
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
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Teacher</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("teacherId")}
                        defaultValue={data?.teachers}
                    >
                        {teachers.map(
                            (teacher: { id: string; name: string }) => (
                                <option
                                    value={teacher.id}
                                    key={teacher.id}
                                    defaultValue={data && teacher.id === data.teacherId}
                                >
                                    {teacher.name}
                                </option>
                            )
                        )}
                    </select>
                    {errors.teacherId?.message && (
                        <p className="text-xs text-red-400">
                            {errors.teacherId.message.toString()}
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

export default LessonForm;