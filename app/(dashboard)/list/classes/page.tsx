import Image from "next/image";

import { ITEM_PER_PAGE } from "@/lib/settings";
import { currentUserId, role } from "@/lib/role";
import prisma from "@/lib/prisma";
import { Prisma, Class, Grade, Teacher } from "@prisma/client";

import TableSearch from "@/components/lists/TableSearch";
import Table from "@/components/lists/Table";
import Pagination from "@/components/lists/Pagination";
import FormContainer from "@/components/lists/FormContainer";

type ClassType = Class & { grade: Grade } & { supervisor: Teacher };

const columns = [
    {
        header: "Class Name",
        accessor: "name",
        className: "text-left pl-4",
    },
    {
        header: "Capacity",
        accessor: "capacity",
        className: "hidden md:table-cell",
    },
    {
        header: "Grade",
        accessor: "grade",
        className: "hidden md:table-cell",
    },
    {
        header: "Supervisor",
        accessor: "supervisor",
        className: "hidden md:table-cell",
    },
    {
        header: "Actions",
        accessor: "action",
        className: role === "admin" ? "" : "hidden",
    },
];

const renderRow = (item: ClassType) => (
    <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purpleLight"
    >
        <td className="flex items-center gap-4 p-4">{item.name}</td>
        <td className="hidden text-center md:table-cell">{item.capacity}</td>
        <td className="hidden text-center md:table-cell">{item.grade.level}</td>
        <td className="hidden text-center md:table-cell">
            {item?.supervisor?.name} {item?.supervisor?.surname}
        </td>
        <td>
            <div className="flex items-center justify-center gap-2">
                {role === "admin" && (
                    <>
                        <FormContainer table="class" type="update" data={item} />
                        <FormContainer table="class" type="delete" id={item.id} />
                    </>
                )}
            </div>
        </td>
    </tr>
);

const ClassListPage = async ({ searchParams }: { searchParams: Record<string, string> }) => {
    const resolvedSearchParams = await searchParams;
    const page = resolvedSearchParams?.page ? parseInt(resolvedSearchParams.page) : 1;

    //QUERIES
    const query: Prisma.ClassWhereInput = {};

    //Search params conditions
    if (Object.keys(resolvedSearchParams).length > 0) {
        for (const [key, value] of Object.entries(resolvedSearchParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "teacherId":
                        query.supervisorId = value;
                        break;
                    case "search":
                        const terms = value.split(" ");

                        query.AND = terms.map((term) => {
                            const isNumber = !isNaN(Number(term));
                            return {
                                OR: [
                                    { name: { contains: term, mode: "insensitive" } },
                                    { supervisor: { name: { contains: term, mode: "insensitive" } } },
                                    { supervisor: { surname: { contains: term, mode: "insensitive" } } },
                                    ...(isNumber
                                        ? [{ grade: { level: { equals: Number(term) } } },
                                        { capacity: { equals: Number(term) } },]
                                        : []),
                                ]
                            };
                        });
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
            query.supervisorId = currentUserId!;
            break;
        default:
            break;
    }

    //DATA
    const data = await prisma.class.findMany({
        where: query,
        include: {
            grade: { select: { level: true } },
            supervisor: { select: { name: true, surname: true } },
        },
        take: ITEM_PER_PAGE,
        skip: (page - 1) * ITEM_PER_PAGE,
    });

    const count = await prisma.class.count({
        where: query,
    });

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Classes</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-sky">
                            <Image src="/filter.png" alt="" width={14} height={14} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-sky">
                            <Image src="/sort.png" alt="" width={14} height={14} />
                        </button>
                        {role === "admin" && <FormContainer table="class" type="create" />}
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

export default ClassListPage;