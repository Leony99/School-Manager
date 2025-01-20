import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import Announcements from "@/components/home/Announcements";
import Performance from "@/components/home/Performance";
import BigCalendarContainer from "@/components/home/BigCalendarContainer";
import FormContainer from "@/components/lists/FormContainer";

import prisma from "@/lib/prisma";
import { Grade, Student } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

const SingleStudentPage = async ({ params: { id } }: { params: { id: string } }) => {
    const { sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    const student: (Student & {
        grade: { level: number };
        _count: { assignments: number; exams: number; results: number }
    }) | null
        = await prisma.student.findUnique({
            where: { id },
            include: {
                grade: {
                    select: {
                        level: true,
                    },
                },
                _count: {
                    select: {
                        assignments: true,
                        exams: true,
                        results: true,
                    },
                },
            },
        });

    if (!student) {
        return notFound();
    }

    return (
        <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">

            {/* LEFT */}
            <div className="w-full xl:w-2/3">
                {/* TOP */}
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* USER INFO CARD */}
                    <div className="bg-sky py-6 px-4 rounded-md flex-1 flex gap-4">
                        <div className="w-1/3">
                            <Image
                                src={student.img || "/avatar.png"}
                                alt=""
                                width={144}
                                height={144}
                                className="w-36 h-36 rounded-full object-cover"
                            />
                        </div>
                        <div className="w-2/3 flex flex-col justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <h1 className="text-xl font-semibold">{student.name + " " + student.surname}</h1>
                                {role === "admin" && <FormContainer table="student" type="update" data={student} />}
                            </div>
                            <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <Image src="/blood.png" alt="" width={14} height={14} />
                                    <span>{student.bloodType}</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <Image src="/date.png" alt="" width={14} height={14} />
                                    <span>{new Intl.DateTimeFormat("pt-br", { timeZone: "UTC" }).format(student.birthday)}</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <Image src="/mail.png" alt="" width={14} height={14} />
                                    <span>{student.email || "-"}</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <Image src="/phone.png" alt="" width={14} height={14} />
                                    <span>{student.phone || "-"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* SMALL CARDS */}
                    <div className="flex-1 flex gap-4 justify-evenly flex-wrap">
                        {/* CARD */}
                        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                            <Image
                                src="/singleAttendance.png"
                                alt=""
                                width={24}
                                height={24}
                                className="w-6 h-6"
                            />
                            <div className="">
                                <h1 className="text-xl font-semibold">{student.grade.level}</h1>
                                <span className="text-sm text-gray-400">Grade</span>
                            </div>
                        </div>
                        {/* CARD */}
                        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                            <Image
                                src="/singleBranch.png"
                                alt=""
                                width={24}
                                height={24}
                                className="w-6 h-6"
                            />
                            <div className="">
                                <h1 className="text-xl font-semibold">{student._count.assignments}</h1>
                                <span className="text-sm text-gray-400">Assignments</span>
                            </div>
                        </div>
                        {/* CARD */}
                        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                            <Image
                                src="/singleLesson.png"
                                alt=""
                                width={24}
                                height={24}
                                className="w-6 h-6"
                            />
                            <div className="">
                                <h1 className="text-xl font-semibold">{student._count.exams}</h1>
                                <span className="text-sm text-gray-400">Exams</span>
                            </div>
                        </div>
                        {/* CARD */}
                        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                            <Image
                                src="/singleClass.png"
                                alt=""
                                width={24}
                                height={24}
                                className="w-6 h-6"
                            />
                            <div className="">
                                <h1 className="text-xl font-semibold">{student._count.results}</h1>
                                <span className="text-sm text-gray-400">Results</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BOTTOM */}
                <div className="mt-4 bg-white rounded-md p-4">
                    <h1>Student&apos;s Schedule</h1>
                    <BigCalendarContainer type="classId" id={student.classId} />
                </div>
            </div>

            {/* RIGHT */}
            <div className="w-full xl:w-1/3 flex flex-col gap-4">
                <div className="bg-white p-4 rounded-md">
                    <h1 className="text-xl font-semibold">Shortcuts</h1>
                    <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
                        <Link className="p-3 rounded-md bg-skyLight"
                        href={`/list/lessons?studentId=${id}`}>
                            Student&apos;s Lessons
                        </Link>
                        <Link className="p-3 rounded-md bg-skyLight"
                        href={`/list/assignments?studentId=${id}`}>
                            Student&apos;s Assignments
                        </Link>
                        <Link className="p-3 rounded-md bg-pink-50"
                        href={`/list/exams?studentId=${id}`}>
                            Student&apos;s Exams
                        </Link>
                        <Link className="p-3 rounded-md bg-yellowLight"
                        href={`/list/results?studentId=${id}`}>
                            Student&apos;s Results
                        </Link>
                        <Link className="p-3 rounded-md bg-purpleLight" 
                        href={`/list/parents/?studentId=${id}`}>
                            Student&apos;s parents
                        </Link>
                        <Link className="p-3 rounded-md bg-purpleLight" 
                        href={`/list/teachers/?classId=${student.classId}`}>
                            Student&apos;s Teachers
                        </Link>
                    </div>
                </div>
                <Performance />
                <Announcements />
            </div>
        </div>
    );
};

export default SingleStudentPage;