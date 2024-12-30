import Image from "next/image";
import Link from "next/link";

import { ITEM_PER_PAGE } from "@/lib/settings";
import { currentUserId, role } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { Prisma, Teacher, Subject, Class } from "@prisma/client";

import TableSearch from "@/components/lists/TableSearch";
import Table from "@/components/lists/Table";
import Pagination from "@/components/lists/Pagination";
import FormModal from "@/components/lists/FormModal";

type TeacherType = Teacher & { subjects: Subject[] } & { classes: Class[] };

const columns = [
    {
        header: "Info",
        accessor: "info",
        className: "text-left pl-4",
    },
    {
        header: "Subjects",
        accessor: "subjects",
        className: "hidden xl:table-cell",
    },
    {
        header: "Classes",
        accessor: "classes",
        className: "hidden xl:table-cell",
    },
    {
        header: "Phone",
        accessor: "phone",
        className: "hidden md:table-cell",
    },
    {
        header: "Address",
        accessor: "address",
        className: "hidden md:table-cell",
    },
    {
        header: "Actions",
        accessor: "action",
        className: role === "admin" ? "" : "hidden",
    },
];

const renderRow = (item: TeacherType) => (
    <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purpleLight"
    >
        <td className="flex items-center gap-4 p-4">
            <Image
                src={item.img || "/avatar.png"}
                alt=""
                width={40}
                height={40}
                className="xl:block w-10 h-10 rounded-full object-cover"
            />
            <div className="flex flex-col">
                <h3 className="font-semibold">{item.name} {item.surname}</h3>
                <p className="text-xs text-gray-500">{item?.email}</p>
            </div>
        </td>
        <td className="hidden text-center xl:table-cell">
            {item.subjects.map((item) => item.name).join(", ")}</td>
        <td className="hidden text-center xl:table-cell">
            {item.classes.map((item) => item.name).join(", ")}</td>
        <td className="hidden text-center md:table-cell">{item.phone}</td>
        <td className="hidden text-center md:table-cell">{item.address}</td>
        <td>
            <div className="flex items-center justify-center gap-2">
                <Link href={`/list/teachers/${item.id}`}>
                    <button className="w-7 h-7 flex items-center justify-center rounded-full bg-sky">
                        <Image src="/view.png" alt="" width={16} height={16} />
                    </button>
                </Link>
                {role === "admin" && (
                    <>
                        <FormModal table="teacher" type="update" data={item} />
                        <FormModal table="teacher" type="delete" id={item.id} />
                    </>
                )}
            </div>
        </td>
    </tr>
);

const TeacherListPage = async ({ searchParams }: { searchParams: Record<string, string> }) => {
    const resolvedSearchParams = await searchParams;
    const page = resolvedSearchParams?.page ? parseInt(resolvedSearchParams.page) : 1;

    //QUERY
    const query: Prisma.TeacherWhereInput = {};

    //Search Params condition
    if (Object.keys(resolvedSearchParams).length > 0) {
        for (const [key, value] of Object.entries(resolvedSearchParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "classId":
                        query.lessons = {
                            some: {
                                classId: parseInt(value)
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
                                { subjects: { some: { name: { contains: term, mode: "insensitive" } } } },
                                { classes: { some: { name: { contains: term, mode: "insensitive" } } } },
                            ]
                        }));
                        break;
                    default:
                        break;
                }
            }
        }
    }

    //DATA
    const data = await prisma.teacher.findMany({
        where: query,
        include: {
            subjects: { select: { name: true } },
            classes: { select: { name: true } },
        },
        take: ITEM_PER_PAGE,
        skip: (page - 1) * ITEM_PER_PAGE,
    });

    const count = await prisma.teacher.count({
        where: query,
    });

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Teachers</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-sky">
                            <Image src="/filter.png" alt="" width={14} height={14} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-sky">
                            <Image src="/sort.png" alt="" width={14} height={14} />
                        </button>
                        {role === "admin" && (
                            <FormModal table="teacher" type="create" />
                        )}
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

export default TeacherListPage;