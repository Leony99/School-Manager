import Image from "next/image";
import CountChart from "./CountChart";
import prisma from "@/lib/prisma";

const CountChartContainer = async () => {
  const data = await prisma.student.groupBy({
    by: ["sex"],
    _count: true,
  });

  const boys = data.find((d) => d.sex === "male")?._count || 0;
  const girls = data.find((d) => d.sex === "female")?._count || 0;
  
  return (
    <div className="bg-white rounded-xl w-full h-full p-4 flex flex-col">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Students</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>

      {/* CHART */}
      <CountChart boys={boys} girls={girls} />
    </div>
  );
};

export default CountChartContainer;