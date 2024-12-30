import Image from "next/image";
import ExamsChart from "./ExamsChart";
import prisma from "@/lib/prisma";

const ExamsChartContainer = async () => {
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const examsInWeek = await prisma.exam.findMany({
    where: {
      startTime: {
        gte: startOfWeek,
        lte: endOfWeek,
      },
    },
  });

  const weekdaysCount: 
  { [key in 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday']: number } = 
  {
    "Sunday": 0,
    "Monday": 0,
    "Tuesday": 0,
    "Wednesday": 0,
    "Thursday": 0,
    "Friday": 0,
    "Saturday": 0,
  };

  examsInWeek.forEach((exam) => {
    const date = new Date(exam.startTime);
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' }) as keyof typeof weekdaysCount;
    weekdaysCount[weekday]++;
  });
  
  const result = Object.entries(weekdaysCount).map(([weekday, count]) => ({
    weekday,
    count,
  }));

  return (
    <div className="bg-white rounded-lg p-4 h-full flex flex-col">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Exams in Week</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>

      {/* CHART */}
      <ExamsChart examsPerDay={result} />
    </div>
  );
};

export default ExamsChartContainer;