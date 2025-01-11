import Image from "next/image";

import { ITEM_PER_PAGE } from "@/lib/settings";
import { currentUserId, role } from "@/lib/role";
import prisma from "@/lib/prisma";
import { Prisma, Result } from "@prisma/client";

import TableSearch from "@/components/lists/TableSearch";
import Table from "@/components/lists/Table";
import Pagination from "@/components/lists/Pagination";
import FormModal from "@/components/lists/FormModal";

type ResultType = Result & {
    assignment?: {
        title: string;
        dueDate: Date;
        subject: { name: string };
        teacher: { name: string; surname: string };
        class: { name: string };
    };
    exam?: {
        title: string;
        startTime: Date;
        subject: { name: string };
        teacher: { name: string; surname: string };
        class: { name: string };
    };
    student: { name: string; surname: string };
};

const columns = [
    {
        header: "Title",
        accessor: "title",
        className: "text-left pl-4",
    },
    {
        header: "Student",
        accessor: "student",
        className: "hidden sm:table-cell",
    },
    {
        header: "Score",
        accessor: "score",
        className: "hidden md:table-cell",
    },
    {
        header: "Class/Teacher",
        accessor: "teacher",
        className: "hidden xl:table-cell",
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

const renderRow = (item: ResultType) => (
    
    <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purpleLight"
    >
        <td className="gap-4 p-4">
            <div className="flex flex-col">
                <h3 className="font-semibold">{item.assignment?.title || item.exam?.title || "N/A"}</h3>
                <p className="text-xs text-gray-500">{item.assignment?.subject?.name || item.exam?.subject?.name || "N/A"}</p>
            </div>
        </td>
        <td className="hidden text-center sm:table-cell">{item.student.name} {item.student.surname}</td>
        <td className="hidden text-center md:table-cell">{item.score}</td>
        <td className="hidden xl:table-cell gap-4 p-4">
            <div className="flex flex-col">
                <h3 className="text-center">
                    {item.assignment?.class?.name || item.exam?.class?.name || "N/A"}
                </h3>
                <p className="text-center">
                    {item.assignment?.teacher ? `${item.assignment.teacher.name} ${item.assignment.teacher.surname}`
                    : item.exam?.teacher ? `${item.exam.teacher.name} ${item.exam.teacher.surname}` : "N/A"}
                </p>
            </div>
        </td>
        <td className="hidden text-center xl:table-cell">
            {item.assignment?.dueDate
                    ? new Intl.DateTimeFormat('en-US').format(new Date(item.assignment.dueDate))
                    : item.exam?.startTime
                    ? new Intl.DateTimeFormat('en-US').format(new Date(item.exam.startTime))
                    : "N/A"}
        </td>
        <td>
            <div className="flex items-center justify-center gap-2">
                {(role === "admin" || role === "teacher") && (
                    <>
                        <FormModal table="result" type="update" data={item} />
                        <FormModal table="result" type="delete" id={item.id} />
                    </>
                )}
            </div>
        </td>
    </tr>
);

const ResultListPage = async ({ searchParams }: { searchParams: Record<string, string> }) => {
    const resolvedSearchParams = await searchParams;
    const page = resolvedSearchParams?.page ? parseInt(resolvedSearchParams.page) : 1;

    //QUERY
    const query: Prisma.ResultWhereInput = {};

    //Search Params condition
    if (Object.keys(resolvedSearchParams).length > 0) {
        for (const [key, value] of Object.entries(resolvedSearchParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "search":
                        const terms = value.split(" ");

                        query.AND = terms.map((term) => ({
                            OR: [
                                // Title
                                { assignment: { title: { contains: term, mode: "insensitive" } } },
                                { exam: { title: { contains: term, mode: "insensitive" } } },
                                // Subject names
                                { assignment: { subject: { name: { contains: term, mode: "insensitive" } } } },
                                { exam: { subject: { name: { contains: term, mode: "insensitive" } } } },
                                // Student name and surname
                                { student: { name: { contains: term, mode: "insensitive" } } },
                                { student: { surname: { contains: term, mode: "insensitive" } } },
                                // Teacher name and surname (assignment and exam)
                                { assignment: { teacher: { name: { contains: term, mode: "insensitive" } } } },
                                { assignment: { teacher: { surname: { contains: term, mode: "insensitive" } } } },
                                { exam: { teacher: { name: { contains: term, mode: "insensitive" } } } },
                                { exam: { teacher: { surname: { contains: term, mode: "insensitive" } } } },
                                // Class name
                                { assignment: { class: { name: { contains: term, mode: "insensitive" } } } },
                                { exam: { class: { name: { contains: term, mode: "insensitive" } } } },
                                // Score (numeric value)
                                { score: { equals: isNaN(Number(term)) ? undefined : Number(term) } },
                            ],
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
            query.OR = [
                { assignment: { teacherId: currentUserId! } },
                { exam: { teacherId: currentUserId! } },
            ]
            break;
        case "student":
            query.studentId = currentUserId!;
            break;
        case "parent":
            query.student = {
                parentId: currentUserId!
            }
            break;
        default:
            break;
    }

    //DATA
    const data = await prisma.result.findMany({
        where: query,
        include: {
            assignment: {
                select: {
                    title: true,
                    dueDate: true,
                    subject: { select: { name: true } },
                    teacher: { select: { name: true, surname: true } },
                    class: { select: { name: true } },
                },
            },
            exam: {
                select: {
                    title: true,
                    startTime: true,
                    subject: { select: { name: true } },
                    teacher: { select: { name: true, surname: true } },
                    class: { select: { name: true } },
                },
            },
            student: {
                select: { name: true, surname: true },
            },
        },
        take: ITEM_PER_PAGE,
        skip: (page - 1) * ITEM_PER_PAGE,
    });

    const count = await prisma.result.count({
        where: query,
    });

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Results</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-sky">
                            <Image src="/filter.png" alt="" width={14} height={14} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-sky">
                            <Image src="/sort.png" alt="" width={14} height={14} />
                        </button>
                        {(role === "admin" || role === "teacher") && <FormModal table="result" type="create" />}
                    </div>
                </div>
            </div>

            {/* LIST */}
            <Table columns={columns} renderRow={renderRow} data={data} />

            {/* PAGINATION */}
            <Pagination page={page} count={count}/>
        </div>
    );
};

export default ResultListPage;