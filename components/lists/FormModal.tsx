"use client";

import { deleteClass, deleteSubject, deleteTeacher } from "@/lib/actions";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useActionState, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FormContainerProps } from "./FormContainer";

const deleteActionMap = {
    subject: deleteSubject,
    class: deleteClass,
    student: deleteSubject,
    parent: deleteSubject,
    teacher: deleteTeacher,
    // TODO: OTHER DELETE ACTIONS
    exam: deleteSubject,
    lesson: deleteSubject,
    assignment: deleteSubject,
    result: deleteSubject,
    attendance: deleteSubject,
    event: deleteSubject,
    announcement: deleteSubject,
};

const TeacherForm = dynamic(() => import("../forms/TeacherForms"), {
    loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import("../forms/StudentForms"), {
    loading: () => <h1>Loading...</h1>,
});
const ParentForm = dynamic(() => import("../forms/ParentForms"), {
    loading: () => <h1>Loading...</h1>,
});
const SubjectForm = dynamic(() => import("../forms/SubjectForms"), {
    loading: () => <h1>Loading...</h1>,
});
const ClassForm = dynamic(() => import("../forms/ClassForms"), {
    loading: () => <h1>Loading...</h1>,
});
const LessonForm = dynamic(() => import("../forms/LessonForms"), {
    loading: () => <h1>Loading...</h1>,
});
const ExamForm = dynamic(() => import("../forms/ExamForms"), {
    loading: () => <h1>Loading...</h1>,
});
const AssignmentForm = dynamic(() => import("../forms/AssignmentForms"), {
    loading: () => <h1>Loading...</h1>,
});
const ResultForm = dynamic(() => import("../forms/ResultForms"), {
    loading: () => <h1>Loading...</h1>,
});
const EventForm = dynamic(() => import("../forms/EventForms"), {
    loading: () => <h1>Loading...</h1>,
});
const AnnouncementForm = dynamic(() => import("../forms/AnnouncementForms"), {
    loading: () => <h1>Loading...</h1>,
});

const forms: {
    [key: string]: (
        setOpen: Dispatch<SetStateAction<boolean>>,
        type: "create" | "update",
        data?: any, 
        relatedData?: any)
        => JSX.Element
} = {
    teacher: (setOpen, type, data, relatedData) => <TeacherForm setOpen={setOpen} type={type} data={data} relatedData={relatedData}/>,
    student: (setOpen, type, data, relatedData) => <StudentForm setOpen={setOpen} type={type} data={data} relatedData={relatedData}/>,
    parent: (setOpen, type, data, relatedData) => <ParentForm setOpen={setOpen} type={type} data={data} relatedData={relatedData}/>,
    subject: (setOpen, type, data, relatedData) => <SubjectForm setOpen={setOpen} type={type} data={data} relatedData={relatedData}/>,
    class: (setOpen, type, data, relatedData) => <ClassForm setOpen={setOpen} type={type} data={data} relatedData={relatedData}/>,
    lesson: (setOpen, type, data, relatedData) => <LessonForm setOpen={setOpen} type={type} data={data} relatedData={relatedData}/>,
    exam: (setOpen, type, data, relatedData) => <ExamForm setOpen={setOpen} type={type} data={data} relatedData={relatedData}/>,
    assignment: (setOpen, type, data, relatedData) => <AssignmentForm setOpen={setOpen} type={type} data={data} relatedData={relatedData}/>,
    result: (setOpen, type, data, relatedData) => <ResultForm setOpen={setOpen} type={type} data={data} relatedData={relatedData}/>,
    event: (setOpen, type, data, relatedData) => <EventForm setOpen={setOpen} type={type} data={data} relatedData={relatedData}/>,
    announcement: (setOpen, type, data, relatedData) => <AnnouncementForm setOpen={setOpen} type={type} data={data} relatedData={relatedData} />,
};

const FormModal = ({
    table,
    type,
    data,
    id,
    clerkId,
    relatedData,
}: FormContainerProps & { relatedData?: any }) => {

    console.log(clerkId);

    const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
    const [open, setOpen] = useState(false);

    const Form = () => {
        const [state, formAction] = useActionState(
            deleteActionMap[table],
            {
                success: false,
                error: false,
            }
        );

        const router = useRouter();

        useEffect(() => {
            if (state.success) {
                toast(`${table} has been deleted!`);
                setOpen(false);
                router.refresh();
            }
        }, [state, router, setOpen]);

        return (
            type === "delete" && id ? (
                <form action={formAction} className="p-4 flex flex-col gap-4">
                    <input type="text | number" name="id" value={id} readOnly hidden />
                    <input type="text | number | null" name="clerkId" value={clerkId} readOnly hidden />
                    <span className="text-center font-medium">
                        All data will be lost. Are you sure you want to delete this {table}?
                    </span>
                    <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
                        Delete
                    </button>
                </form>
            )
                : type === "create" || type === "update" ? (
                    forms[table](setOpen, type, data, relatedData)
                )
                    : (
                        "Form not found!"
                    )
        );
    };

    return (
        <>
            <button
                className={`${size} flex items-center justify-center rounded-full bg-sky`}
                onClick={() => setOpen(true)}
            >
                <Image src={`/${type}.png`} alt="" width={16} height={16} />
            </button>
            {open && (
                <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
                        <Form />
                        <div
                            className="absolute top-4 right-4 cursor-pointer"
                            onClick={() => setOpen(false)}
                        >
                            <Image src="/close.png" alt="" width={14} height={14} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default FormModal;