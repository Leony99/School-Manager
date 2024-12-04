import Image from "next/image";

import { ITEM_PER_PAGE } from "@/lib/settings";
import { role } from "@/lib/data";
import prisma from "@/lib/prisma";
import { Prisma, Event, Class } from "@prisma/client";

import TableSearch from "@/components/lists/TableSearch";
import Table from "@/components/lists/Table";
import Pagination from "@/components/lists/Pagination";
import FormModal from "@/components/lists/FormModal";

type EventType = Event & { class: Class };

const columns = [
    {   
        header: "Title", 
        accessor: "title", 
        className: "text-left pl-4" 
    },
    {
        header: "Class",
        accessor: "class",
        className: "hidden sm:table-cell",
    },
    {
        header: "Date",
        accessor: "date",
        className: "hidden md:table-cell",
    },
    {
        header: "Start Time",
        accessor: "startTime",
        className: "hidden lg:table-cell",
    },
    {
        header: "End Time",
        accessor: "endTime",
        className: "hidden xl:table-cell",
    },
    {
        header: "Actions",
        accessor: "action",
        className: role === "admin" ? "" : "hidden",
    },
];

const renderRow = (item: EventType) => (
    <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purpleLight"
    >
        <td className="flex items-center gap-4 p-4">{item.title}</td>
        <td className="hidden text-center sm:table-cell">{item.class?.name || "N/A"}</td>
        <td className="hidden text-center md:table-cell">{new Intl.DateTimeFormat('en-US').format(item.startTime)}</td>
        <td className="hidden text-center lg:table-cell">{new Intl.DateTimeFormat('en-US', {
            hour: '2-digit', 
            minute: '2-digit',
        }).format(item.startTime)}</td>
        <td className="hidden text-center xl:table-cell">{new Intl.DateTimeFormat('en-US', {
            hour: '2-digit', 
            minute: '2-digit',
        }).format(item.endTime)}</td>
        <td>
            <div className="flex items-center justify-center gap-2">
                {(role === "admin") && (
                    <>
                        <FormModal table="event" type="update" data={item} />
                        <FormModal table="event" type="delete" id={item.id} />
                    </>
                )}
            </div>
        </td>
    </tr>
);

const EventListPage = async ({ searchParams }: { searchParams: Record<string, string> }) => {
    const resolvedSearchParams = await searchParams;
    const page = resolvedSearchParams?.page ? parseInt(resolvedSearchParams.page) : 1;

    //Search Params condition
    const query: Prisma.EventWhereInput = {};
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
                            ]
                        }));
                        break;
                    default:
                        break;
                }
            }
        }
    }

    const data = await prisma.event.findMany({
        where: query,
        include: {
            class: { select: { name: true } },
        },
        take: ITEM_PER_PAGE,
        skip: (page - 1) * ITEM_PER_PAGE,
    });

    const count = await prisma.event.count({
        where: query,
    });

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Events</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-sky">
                            <Image src="/filter.png" alt="" width={14} height={14} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-sky">
                            <Image src="/sort.png" alt="" width={14} height={14} />
                        </button>
                        {(role === "admin") && <FormModal table="event" type="create" />}
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

export default EventListPage;