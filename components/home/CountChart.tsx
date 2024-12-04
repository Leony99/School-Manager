"use client";
import Image from "next/image";
import { AgCharts } from 'ag-charts-react';

const data = [
  {
    name: "Students",
    count: 120,
    boysCount: 70,
    girlsCount: 50,
  },
];

const chartOptions: any = {
  data: data,

  series: [
    { type: 'bar', xKey: 'name', yKey: 'count', yName: 'Total', cornerRadius: 5, fill: '#fdee58', 
      label: {
        enabled: true,
        color: '#000000',
        formatter: ({ value }: { value: number }) => `${value}`,
      },
    },
    { type: 'bar', xKey: 'name', yKey: 'boysCount', yName: 'Boys', cornerRadius: 5, fill: '#85deff', 
      label: {
        enabled: true,
        color: '#000000',
        formatter: ({ value }: { value: number }) => `${value}`,
      },
    },
    { type: 'bar', xKey: 'name', yKey: 'girlsCount', yName: 'Girls', cornerRadius: 5, fill: '#a8a7fe', 
      label: {
        enabled: true,
        color: '#000000',
        formatter: ({ value }: { value: number }) => `${value}`,
      },
    }
  ],

  axes: [
    {
      type: 'category',
      position: 'bottom',
      label: {
        rotation: 0,
      },
    },
    {
      type: 'number',
      position: 'left',
      label: {
        enabled: false,
      },
    },
  ],
};

const CountChart = () => {
  return (
    <div className="bg-white rounded-xl w-full h-full p-4 flex flex-col">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Students</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>

      {/* CHART */}
      <div className="relative w-full flex-grow">
        <AgCharts options={chartOptions} style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
};

export default CountChart;