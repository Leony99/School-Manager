import prisma from "@/lib/prisma";
import BigCalendar from "./BigCalendar";
import { adjustScheduleToCurrentWeek } from "@/lib/utils";

const BigCalendarContainer = async ({
    type,
    id,
}: {
    type: "teacherId" | "classId";
    id: string | number;
}) => {

    const dataRes = await prisma.exam.findMany({
        where: {
            ...(type === "teacherId"
                ? { teacherId: id as string }
                : { classId: id as number }),
        },
    });

    const data = dataRes.map((exam) => ({
        title: exam.title,
        start: exam.startTime,
        end: exam.endTime,
    }));

    const schedule = adjustScheduleToCurrentWeek(data);

    return (
        <div className="">
            <BigCalendar data={schedule} />
        </div>
    );
};

export default BigCalendarContainer;