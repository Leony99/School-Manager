"use client";

import { Dispatch, SetStateAction, startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { classSchema, ClassSchemaType } from "@/lib/formValidationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "./forms_components/InputField";
import { createClass, updateClass } from "@/lib/actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ClassForm = ({
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
    } = useForm<ClassSchemaType>({
        resolver: zodResolver(classSchema),
    });

    const [state, formAction] = useActionState(
        type === "create" ? createClass : updateClass,
        {
            success: false,
            error: false,
        }
    );

    const onSubmit = handleSubmit((data) => {
        console.log(data);
        startTransition(() => formAction(data));
    });

    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            toast(`Class has been ${type === "create" ? "created" : "updated"}!`);
            setOpen(false);
            router.refresh();
        }
    }, [state, router, setOpen]);

    const { teachers, grades } = relatedData;

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
                    label="Capacity"
                    name="capacity"
                    defaultValue={data?.capacity}
                    register={register}
                    error={errors?.capacity}
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
                    <label className="text-xs text-gray-500">Supervisor</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("supervisorId")}
                        defaultValue={data?.teachers}
                    >
                        {teachers.map(
                            (teacher: { id: string; name: string; surname: string }) => (
                                <option
                                    value={teacher.id}
                                    key={teacher.id}
                                    selected={data && teacher.id === data.supervisorId}
                                >
                                    {teacher.name + " " + teacher.surname}
                                </option>
                            )
                        )}
                    </select>
                    {errors.supervisorId?.message && (
                        <p className="text-xs text-red-400">
                            {errors.supervisorId.message.toString()}
                        </p>
                    )}
                </div>
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Grade</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("gradeId")}
                        defaultValue={data?.gradeId}
                    >
                        {grades.map((grade: { id: number; level: number }) => (
                            <option
                                value={grade.id}
                                key={grade.id}
                                selected={data && grade.id === data.gradeId}
                            >
                                {grade.level}
                            </option>
                        ))}
                    </select>
                    {errors.gradeId?.message && (
                        <p className="text-xs text-red-400">
                            {errors.gradeId.message.toString()}
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

export default ClassForm;