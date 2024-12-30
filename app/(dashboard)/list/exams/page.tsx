import Image from "next/image";

import { ITEM_PER_PAGE } from "@/lib/settings";
import { currentUserId, role } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { Prisma, Exam, Subject, Class, Teacher } from "@prisma/client";

import TableSearch from "@/components/lists/TableSearch";
import Table from "@/components/lists/Table";
import Pagination from "@/components/lists/Pagination";
import FormModal from "@/components/lists/FormModal";

type ExamType = Exam & { subject: Subject } & { class: Class } & { teacher: Teacher };

const columns = [
    {   header: "Title", 
        accessor: "title", 
        className: "text-left pl-4" 
    },
    {
        header: "Subject Name",
        accessor: "name",
        className: "hidden sm:table-cell",
    },
    {
        header: "Class",
        accessor: "class",
        className: "hidden md:table-cell",
    },
    {
        header: "Teacher",
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

const renderRow = (item: ExamType) => (
    <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purpleLight"
    >
        <td className="flex items-center gap-4 p-4">{item.title}</td>
        <td className="hidden text-center sm:table-cell">{item.subject.name}</td>
        <td className="hidden text-center md:table-cell">{item.class.name}</td>
        <td className="hidden text-center xl:table-cell">{item.teacher.name} {item.teacher.surname}</td>
        <td className="hidden text-center xl:table-cell">{new Intl.DateTimeFormat('en-US').format(item.startTime)}</td>
        <td>
            <div className="flex items-center justify-center gap-2">
                {(role === "admin" || role === "teacher") && (
                    <>
                        <FormModal table="exam" type="update" data={item} />
                        <FormModal table="exam" type="delete" id={item.id} />
                    </>
                )}
            </div>
        </td>
    </tr>
);

const ExamListPage = async ({ searchParams }: { searchParams: Record<string, string> }) => {
    const resolvedSearchParams = await searchParams;
    const page = resolvedSearchParams?.page ? parseInt(resolvedSearchParams.page) : 1;
    
    //QUERY
    const query: Prisma.ExamWhereInput = {};
    
    //Search Params condition
    if (Object.keys(resolvedSearchParams).length > 0) {
        for (const [key, value] of Object.entries(resolvedSearchParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "search":
                        const terms = value.split(" ");

                        query.AND = terms.map((term: any) => ({
                            OR: [
                                { title: { contains: term, mode: "insensitive" } },
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
            query.students = {
                some: {
                    id: currentUserId!
                }
            }
        case "parent":
            query.students = {
                some: {
                    parentId: currentUserId!
                }
            }
        default:
            break;
    }

    //DATA
    const data = await prisma.exam.findMany({
        where: query,
        include: {
            subject: { select: { name: true } },
            class: { select: { name: true } },
            teacher: { select: { name: true, surname: true } },
        },
        take: ITEM_PER_PAGE,
        skip: (page - 1) * ITEM_PER_PAGE,
    });

    const count = await prisma.exam.count({
        where: query,
    });

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Exams</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-sky">
                            <Image src="/filter.png" alt="" width={14} height={14} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-sky">
                            <Image src="/sort.png" alt="" width={14} height={14} />
                        </button>
                        {(role === "admin" || role === "teacher") && <FormModal table="exam" type="create" />}
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

export default ExamListPage;