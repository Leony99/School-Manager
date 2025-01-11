import Image from "next/image";

import { ITEM_PER_PAGE } from "@/lib/settings";
import { currentUserId, role } from "@/lib/role";
import prisma from "@/lib/prisma";
import { Prisma, Parent, Student } from "@prisma/client";

import TableSearch from "@/components/lists/TableSearch";
import Table from "@/components/lists/Table";
import Pagination from "@/components/lists/Pagination";
import FormContainer from "@/components/lists/FormContainer";

type ParentType = Parent & { students: Student[] };

const columns = [
    {
        header: "Info",
        accessor: "info",
        className: "text-left pl-4",
    },
    {
        header: "Student Names",
        accessor: "students",
        className: "hidden md:table-cell",
    },
    {
        header: "Phone",
        accessor: "phone",
        className: "hidden xl:table-cell",
    },
    {
        header: "Address",
        accessor: "address",
        className: "hidden xl:table-cell",
    },
    {
        header: "Actions",
        accessor: "action",
        className: (role === "admin" || role === "teacher") ? "" : "hidden",
    },
];

const renderRow = (item: ParentType) => (
    <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purpleLight"
    >
        <td className="flex items-center gap-4 p-4">
            <div className="flex flex-col">
                <h3 className="font-semibold">{item.name} {item.surname}</h3>
                <p className="text-xs text-gray-500">{item?.email}</p>
            </div>
        </td>
        <td className="hidden text-center md:table-cell">
            {item.students.map((item) => item.name + " " + item.surname).join(", ")}
        </td>
        <td className="hidden text-center xl:table-cell">{item.phone}</td>
        <td className="hidden text-center xl:table-cell">{item.address}</td>
        <td>
            <div className="flex items-center justify-center gap-2">
                {(role === "admin" || role === "teacher") && (
                    <>
                        <FormContainer table="parent" type="update" data={item} />
                        <FormContainer table="parent" type="delete" id={item.id} />
                    </>
                )}
            </div>
        </td>
    </tr>
);

const ParentListPage = async ({ searchParams }: { searchParams: Record<string, string> }) => {
    const resolvedSearchParams = await searchParams;
    const page = resolvedSearchParams?.page ? parseInt(resolvedSearchParams.page) : 1;

    //QUERY
    const query: Prisma.ParentWhereInput = {};

    //Search Params condition
    if (Object.keys(resolvedSearchParams).length > 0) {
        for (const [key, value] of Object.entries(resolvedSearchParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "studentId":
                        query.students = {
                            some: {
                                id: value
                            }
                        };
                        break;
                    case "search":
                        const terms = value.split(" ");

                        query.AND = terms.map((term) => ({
                            OR: [
                                { name: { contains: term, mode: "insensitive" } },
                                { surname: { contains: term, mode: "insensitive" } },
                                { email: { contains: term, mode: "insensitive" } },
                                { phone: { contains: term, mode: "insensitive" } },
                                { address: { contains: term, mode: "insensitive" } },
                                { students: { some: { name: { contains: term, mode: "insensitive" } } } },
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
            query.students = {
                some: {
                    class: {
                        supervisorId: currentUserId!
                    }
                }
            }
            break;
        default:
            break;
    }

    //DATA
    const data = await prisma.parent.findMany({
        where: query,
        include: {
            students: { select: {name: true, surname: true} },
        },
        take: ITEM_PER_PAGE,
        skip: (page - 1) * ITEM_PER_PAGE,
    });

    const count = await prisma.parent.count({
        where: query,
    });

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Parents</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-sky">
                            <Image src="/filter.png" alt="" width={14} height={14} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-sky">
                            <Image src="/sort.png" alt="" width={14} height={14} />
                        </button>
                        {(role === "admin" || role === "teacher") && (
                            <FormContainer table="parent" type="create" />
                        )}
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

export default ParentListPage;