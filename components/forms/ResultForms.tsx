"use client";

import { useForm } from "react-hook-form";
import { resultSchema, resultSchemaType } from "@/lib/formSchemas/result";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "./forms_components/InputField";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect } from "react";
import { createResult, updateResult } from "@/lib/formActions/result";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const ResultForm = ({
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
    } = useForm<resultSchemaType>({
        resolver: zodResolver(resultSchema),
    });

    const [state, formAction] = useActionState(
        type === "create" ? createResult : updateResult,
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
            toast(`Result has been ${type === "create" ? "created" : "updated"}!`);
            setOpen(false);
            router.refresh();
        }
    }, [state, router, setOpen]);

    const { exams, students } = relatedData;

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">{type === "create" ? "Create a new result" : "Update a result"}</h1>
            <div className="flex justify-around flex-wrap gap-4">
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Exam</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("examId")}
                        defaultValue={data?.exams}
                    >
                        {exams.map(
                            (exam: { id: string; title: string }) => (
                                <option
                                    value={exam.id}
                                    key={exam.id}
                                    defaultValue={data && exam.id === data.subjectId}
                                >
                                    {exam.title}
                                </option>
                            )
                        )}
                    </select>
                    {errors.examId?.message && (
                        <p className="text-xs text-red-400">
                            {errors.examId.message.toString()}
                        </p>
                    )}
                </div>
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Student</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("studentId")}
                        defaultValue={data?.students}
                    >
                        {students.map(
                            (student: { id: string; name: string; surname: string }) => (
                                <option
                                    value={student.id}
                                    key={student.id}
                                    defaultValue={data && student.id === data.student}
                                >
                                    {student.name} {student.surname}
                                </option>
                            )
                        )}
                    </select>
                    {errors.studentId?.message && (
                        <p className="text-xs text-red-400">
                            {errors.studentId.message.toString()}
                        </p>
                    )}
                </div>

                <InputField
                    label="Score"
                    name="score"
                    defaultValue={data?.score}
                    register={register}
                    error={errors?.score}
                    type="number"
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
            </div>
            <button className="bg-blue-400 text-white p-2 rounded-md">
                {type === "create" ? "Create" : "Update"}
            </button>
        </form>
    );
};

export default ResultForm;