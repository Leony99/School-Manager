import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

import Announcements from "@/components/home/Announcements";
import BigCalendarContainer from "@/components/home/BigCalendarContainer";

const StudentPage = async () => {
  const { userId } = await auth();

  const student = await prisma.student.findUnique({
    where: {
      id: userId!,
    },
    include: {
      class: true,
    },
  });

  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule {student!.class!.name}</h1>
          <BigCalendarContainer type="classId" id={student!.classId!} />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <Announcements />
      </div>
    </div>
  );
};

export default StudentPage;