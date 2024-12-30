import prisma from "@/lib/prisma";

const EventList = async ({ dateParam }: { dateParam: string | undefined }) => {
    const date = dateParam ? new Date(`${dateParam}T00:00:00Z`) : new Date();

    const startOfDay = new Date(date.setUTCHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setUTCHours(23, 59, 59, 999));

    const data = await prisma.event.findMany({
        where: {
            startTime: {
                gte: startOfDay,
                lte: endOfDay,
            },
        },
        orderBy: {
            startTime: "asc",
        },
    });

    if (!data.length) {
        return <p className="text-gray-500">No events found for the selected date.</p>;
    }

    return (
        <>
            {data.map((event) => (
                <div
                    className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-sky even:border-t-purple"
                    key={event.id}
                >
                    <div className="flex items-center justify-between">
                        <h1 className="font-semibold text-gray-600">{event.title}</h1>
                        <span className="text-gray-300 text-xs">
                            {new Date(event.startTime).toISOString().split("T")[1].slice(0, 5)} 
                        </span>
                    </div>
                    <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
                </div>
            ))}
        </>
    );
};

export default EventList;
