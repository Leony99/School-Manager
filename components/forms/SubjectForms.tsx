"use client";

import { Dispatch, SetStateAction, startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { subjectSchema, SubjectSchemaType } from "@/lib/formValidationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "./forms_components/InputField";
import { createSubject, updateSubject } from "@/lib/actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const SubjectForm = ({
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
    } = useForm<SubjectSchemaType>({
        resolver: zodResolver(subjectSchema),
    });

    const [state, formAction] = useActionState(
        type === "create" ? createSubject : updateSubject,
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
          toast(`Subject has been ${type === "create" ? "created" : "updated"}!`);
          setOpen(false);
          router.refresh();
        }
    }, [state, router, setOpen]);

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">{type === "create" ? "Create a new subject" : "Update a subject"}</h1>

            <div className="flex justify-around flex-wrap gap-4">
                <InputField
                    label="Subject name"
                    name="name"
                    defaultValue={data?.name}
                    register={register}
                    error={errors?.name}
                />
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

export default SubjectForm;