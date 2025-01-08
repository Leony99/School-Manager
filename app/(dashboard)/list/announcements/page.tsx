import Image from "next/image";

import { ITEM_PER_PAGE } from "@/lib/settings";
import { role } from "@/lib/role";
import prisma from "@/lib/prisma";
import { Prisma, Announcement, Class } from "@prisma/client";

import TableSearch from "@/components/lists/TableSearch";
import Table from "@/components/lists/Table";
import Pagination from "@/components/lists/Pagination";
import FormModal from "@/components/lists/FormModal";

type AnnouncementType = Announcement & { class: Class };

const columns = [
    {
        header: "Announcement",
        accessor: "announcement",
        className: "text-left pl-4",
    },
    {
        header: "Class",
        accessor: "class",
        className: "hidden xl:table-cell",
    },
    {
        header: "Date",
        accessor: "date",
        className: "hidden md:table-cell",
    },
    {
        header: "Actions",
        accessor: "action",
        className: role === "admin" ? "" : "hidden",
    },
];

const renderRow = (item: AnnouncementType) => (
    <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purpleLight"
    >
        <td className="gap-4 p-4">
            <div className="flex flex-col">
                <h3 className="font-semibold">
                    {item.title}
                </h3>
                <p className="text-gray-500">
                    {item.description}
                </p>
            </div>
        </td>
        <td className="hidden text-center xl:table-cell">{item.class?.name || "N/A"}</td>
        <td className="hidden text-center md:table-cell">
            {new Intl.DateTimeFormat("en-US").format(item.date)}
        </td>
        <td>
            <div className="flex items-center justify-center gap-2">
                {role === "admin" && (
                    <>
                        <FormModal table="announcement" type="update" data={item} />
                        <FormModal table="announcement" type="delete" id={item.id} />
                    </>
                )}
            </div>
        </td>
    </tr>
);

const AnnouncementListPage = async ({
    searchParams,
}: {
    searchParams: Record<string, string>;
}) => {
    const resolvedSearchParams = await searchParams;
    const page = resolvedSearchParams?.page ? parseInt(resolvedSearchParams.page) : 1;

    //QUERIES
    const query: Prisma.AnnouncementWhereInput = {};

    //Search params conditions
    if (Object.keys(resolvedSearchParams).length > 0) {
        for (const [key, value] of Object.entries(resolvedSearchParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "search":
                        const terms = value.split(" ");

                        query.AND = terms.map((term: any) => ({
                            OR: [
                                { title: { contains: term, mode: "insensitive" } },
                                { class: { name: { contains: term, mode: "insensitive" } } },
                            ],
                        }));
                        break;
                    default:
                        break;
                }
            }
        }
    }

    //DATA
    const data = await prisma.announcement.findMany({
        where: query,
        include: {
            class: { select: { name: true } },
        },
        take: ITEM_PER_PAGE,
        skip: (page - 1) * ITEM_PER_PAGE,
    });

    const count = await prisma.announcement.count({
        where: query,
    });

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">
                    All Announcements
                </h1>
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
                            <FormModal table="announcement" type="create" />
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

export default AnnouncementListPage;