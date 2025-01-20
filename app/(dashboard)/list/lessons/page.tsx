import Image from "next/image";

import { ITEM_PER_PAGE } from "@/lib/settings";
import { currentUserId, role } from "@/lib/role";
import prisma from "@/lib/prisma";
import { Prisma, Lesson, Subject, Class, Teacher } from "@prisma/client";

import TableSearch from "@/components/lists/TableSearch";
import Table from "@/components/lists/Table";
import Pagination from "@/components/lists/Pagination";
import FormContainer from "@/components/lists/FormContainer";

type LessonType = Lesson & { subject: Subject } & { class: Class } & { teacher: Teacher };

const columns = [
    {
        header: "Subject Name",
        accessor: "name",
        className: "text-left pl-4",
    },
    {
        header: "Class",
        accessor: "class",
    },
    {
        header: "Teacher",
        accessor: "teacher",
        className: "hidden md:table-cell",
    },
    {
        header: "Date",
        accessor: "date",
        className: "hidden xl:table-cell",
    },
    {
        header: "Actions",
        accessor: "action",
        className: (role === "admin" || role === "teacher") ? "" : "hidden",
    },
];

const renderRow = (item: LessonType) => (
    <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purpleLight"
    >
        <td className="flex items-center gap-4 p-4">{item.subject.name}</td>
        <td className="text-center" >{item.class.name}</td>
        <td className="hidden text-center md:table-cell">
            {item.teacher.name} {item.teacher.surname}
        </td>
        <td className="hidden text-center xl:table-cell">
            {new Intl.DateTimeFormat("pt-BR", {
                timeZone: "UTC",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
            }
            ).format(item.startTime)}
        </td>
        <td>
            <div className="flex items-center justify-center gap-2">
                {(role === "admin" || role === "teacher") && (
                    <>
                        <FormContainer table="lesson" type="update" data={item} />
                        <FormContainer table="lesson" type="delete" id={item.id} />
                    </>
                )}
            </div>
        </td>
    </tr>
);

const LessonListPage = async ({ searchParams }: { searchParams: Record<string, string> }) => {
    const resolvedSearchParams = await searchParams;
    const page = resolvedSearchParams?.page ? parseInt(resolvedSearchParams.page) : 1;

    //QUERY
    const query: Prisma.LessonWhereInput = {};

    //Search Params condition
    if (Object.keys(resolvedSearchParams).length > 0) {
        for (const [key, value] of Object.entries(resolvedSearchParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "teacherId":
                        query.teacherId = value;
                        break;
                    case "studentId":
                        query.class = {
                            students: {
                                some: {
                                    id: value
                                }
                            }
                        };
                        break;
                    case "search":
                        const terms = value.split(" ");

                        query.AND = terms.map((term) => ({
                            OR: [
                                { subject: { name: { contains: term, mode: "insensitive" } } },
                                { class: { name: { contains: term, mode: "insensitive" } } },
                                { teacher: { name: { contains: term, mode: "insensitive" } } },
                                { teacher: { surname: { contains: term, mode: "insensitive" } } },
                            ]
                        }));
                        break;
                    default:
                        break;
                }
            }
        }
    }

    //Role conditions
    switch (role) {
        case "admin":
            break;
        case "teacher":
            query.teacherId = currentUserId!;
            break;
        case "student":
            query.class = {
                students: {
                    some: {
                        id: currentUserId!
                    }
                }
            }
        case "parent":
            query.class = {
                students: {
                    some: {
                        parentId: currentUserId!
                    }
                }
            }
        default:
            break;
    }

    //DATA
    const data = await prisma.lesson.findMany({
        where: query,
        include: {
            subject: { select: { name: true } },
            class: { select: { name: true } },
            teacher: { select: { name: true, surname: true } },
        },
        take: ITEM_PER_PAGE,
        skip: (page - 1) * ITEM_PER_PAGE,
    });

    const count = await prisma.lesson.count({
        where: query,
    });

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Lessons</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-sky">
                            <Image src="/filter.png" alt="" width={14} height={14} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-sky">
                            <Image src="/sort.png" alt="" width={14} height={14} />
                        </button>
                        {(role === "admin" || role === "teacher") && <FormContainer table="lesson" type="create" />}
                    </div>
                </div>
            </div>

            {/* LIST */}
            <Table columns={columns} renderRow={renderRow} data={data} />

            {/* PAGINATION */}
            <Pagination page={page} count={count} />
        </div>
    );
};

export default LessonListPage;