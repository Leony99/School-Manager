import Link from "next/link";
import Image from "next/image";
import { role, teachersData } from "@/lib/data";
import TableSearch from "@/components/TableSearch";
import Table from "@/components/Table";
//import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";

type Teacher = {
    id: number;
    teacherId: string;
    name: string;
    email?: string;
    photo: string;
    phone: string;
    subjects: string[];
    classes: string[];
    address: string;
};

const columns = [
    {
        header: "Info",
        accessor: "info",
        className: "text-left pl-4",
    },
    {
        header: "Teacher ID",
        accessor: "teacherId",
        className: "hidden xl:table-cell",
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
    },
];

const TeacherListPage = () => {
    const renderRow = (item: Teacher) => (
        <tr
            key={item.id}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purpleLight"
        >
            <td className="flex items-center gap-4 p-4">
                <Image
                    src={item.photo}
                    alt=""
                    width={40}
                    height={40}
                    className="xl:block w-10 h-10 rounded-full object-cover"
                />
                <div className="flex flex-col">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-xs text-gray-500">{item?.email}</p>
                </div>
            </td>
            <td className="hidden text-center xl:table-cell">{item.teacherId}</td>
            <td className="hidden text-center xl:table-cell">{item.subjects.join(", ")}</td>
            <td className="hidden text-center xl:table-cell">{item.classes.join(", ")}</td>
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
                        <button className="w-7 h-7 flex items-center justify-center rounded-full bg-sky">
                            <Image src="/delete.png" alt="" width={16} height={16} />
                        </button>
                        //<FormModal table="teacher" type="delete" id={item.id} />
                    )}
                </div>
            </td>
        </tr>
    );

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
                            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-sky">
                                <Image src="/plus.png" alt="" width={14} height={14} />
                            </button>
                            //<FormModal table="teacher" type="create" />
                        )}
                    </div>
                </div>
            </div>

            {/* LIST */}
            <Table columns={columns} renderRow={renderRow} data={teachersData} />

            {/* PAGINATION */}
            <Pagination />
        </div>
    );
};

export default TeacherListPage;