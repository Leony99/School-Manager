"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "./forms_components/InputField";
import { studentSchema, StudentSchemaType } from "@/lib/formSchemas/student";
import { createStudent, updateStudent } from "@/lib/formActions/student";
import { Dispatch, SetStateAction, startTransition, useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CldUploadWidget } from "next-cloudinary";

const StudentForm = ({
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
    } = useForm<StudentSchemaType>({
        resolver: zodResolver(studentSchema),
    });

    const [img, setImg] = useState<any>();

    const [state, formAction] = useActionState(
        type === "create" ? createStudent : updateStudent,
        {
            success: false,
            error: false,
        }
    );

    const onSubmit = handleSubmit((data) => {
        startTransition(() => formAction({ ...data, img: img?.secure_url }));
    }, (errors) => {
        console.log("Validation errors:", errors);
    });

    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            toast(`Student has been ${type === "create" ? "created" : "updated"}!`);
            setOpen(false);
            router.refresh();
        }
    }, [state, router, setOpen]);

    const { classes, grades } = relatedData;

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">{type === "create" ? "Create a new student" : "Update a student"}</h1>
            <span className="text-xs text-gray-400 font-medium">
                Authentication Information
            </span>
            <div className="flex justify-around flex-wrap gap-4">
                <InputField
                    label="Username"
                    name="username"
                    defaultValue={data?.username}
                    register={register}
                    error={errors?.username}
                />
                <InputField
                    label="Email"
                    name="email"
                    defaultValue={data?.email}
                    register={register}
                    error={errors?.email}
                />
                <InputField
                    label="Password"
                    name="password"
                    type="password"
                    defaultValue={data?.password}
                    register={register}
                    error={errors?.password}
                />
            </div>
            <span className="text-xs text-gray-400 font-medium">
                Personal Information
            </span>
            <div className="flex justify-around flex-wrap gap-4">
                <InputField
                    label="Name"
                    name="name"
                    defaultValue={data?.name}
                    register={register}
                    error={errors.name}
                />
                <InputField
                    label="Surname"
                    name="surname"
                    defaultValue={data?.surname}
                    register={register}
                    error={errors.surname}
                />
                <InputField
                    label="Phone"
                    name="phone"
                    defaultValue={data?.phone}
                    register={register}
                    error={errors.phone}
                />
                <InputField
                    label="Address"
                    name="address"
                    defaultValue={data?.address}
                    register={register}
                    error={errors.address}
                />
                <InputField
                    label="Blood Type"
                    name="bloodType"
                    defaultValue={data?.bloodType}
                    register={register}
                    error={errors.bloodType}
                />
                <InputField
                    label="Birthday"
                    name="birthday"
                    defaultValue={data?.birthday.toISOString().split("T")[0]}
                    register={register}
                    error={errors.birthday}
                    type="date"
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
                    <label className="text-xs text-gray-500">Sex</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("sex")}
                        defaultValue={data?.sex}
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    {errors.sex?.message && (
                        <p className="text-xs text-red-400">
                            {errors.sex.message.toString()}
                        </p>
                    )}
                </div>
                <CldUploadWidget
                    uploadPreset="school"
                    onSuccess={(result, { widget }) => {
                        setImg(result.info);
                        widget.close();
                    }}
                >
                    {({ open }) => {
                        return (
                            <div
                                className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer w-full md:w-1/4"
                                onClick={() => open()}
                            >
                                <Image src="/upload.png" alt="" width={28} height={28} />
                                <span>Upload a photo</span>
                            </div>
                        );
                    }}
                </CldUploadWidget>
            </div>
            <span className="text-xs text-gray-400 font-medium">
                School Information
            </span>
            <div className="flex justify-around flex-wrap gap-4">
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Grade</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("gradeId", { valueAsNumber: true })}
                        defaultValue={data?.grades}
                    >
                        {grades.map((grade: { id: number; level: number }) => (
                            <option value={grade.id} key={grade.id}>
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
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Class</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("classId", { valueAsNumber: true })}
                        defaultValue={data?.classes}
                    >
                        {classes.map((item: { id: number; name: string }) => (
                            <option value={item.id} key={item.id}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                    {errors.classId?.message && (
                        <p className="text-xs text-red-400">
                            {errors.classId.message.toString()}
                        </p>
                    )}
                </div>
            </div>
            <button className="bg-blue-400 text-white p-2 rounded-md">
                {type === "create" ? "Create" : "Update"}
            </button>
        </form>
    );
};

export default StudentForm;