"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "./forms_components/InputField";

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
    type: z
        .enum(["exam", "assignment"], { message: "Type is required!" }),
    date: z
        .string().min(1, { message: "Date is required!" }),
    score: z
        .number()
        .min(0, { message: "Score must be at least 0!" })
        .max(100, { message: "Score must be at most 100!" }),
});

type Inputs = z.infer<typeof schema>;

const ResultForm = ({
    type,
    data,
}: {
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
            <h1 className="text-xl font-semibold">{type === "create" ? "Create a new result" : "Update a result"}</h1>
            <div className="flex justify-around flex-wrap gap-4">
                <InputField
                    label="Subject name"
                    name="name"
                    defaultValue={data?.subject}
                    register={register}
                    error={errors?.subject}
                />
                <InputField
                    label="Class"
                    name="class"
                    defaultValue={data?.class}
                    register={register}
                    error={errors?.class}
                />
                <InputField
                    label="Teacher"
                    name="teacher"
                    defaultValue={data?.teacher}
                    register={register}
                    error={errors?.teacher}
                />
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Type</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("type")}
                        defaultValue={data?.sex}
                    >
                        <option value="exam">Exam</option>
                        <option value="assignment">Assignment</option>
                    </select>
                    {errors.type?.message && (
                        <p className="text-xs text-red-400">
                            {errors.type.message.toString()}
                        </p>
                    )}
                </div>
                <InputField
                    label="Date"
                    name="date"
                    defaultValue={data?.date}
                    register={register}
                    error={errors?.date}
                />
                <InputField
                    label="Score"
                    name="score"
                    type="number"
                    defaultValue={data?.score}
                    register={register}
                    error={errors?.score}
                />
            </div>
            <button className="bg-blue-400 text-white p-2 rounded-md">
                {type === "create" ? "Create" : "Update"}
            </button>
        </form>
    );
};

export default ResultForm;