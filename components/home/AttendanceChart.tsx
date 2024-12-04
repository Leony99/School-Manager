"use client";
import Image from "next/image";
import { AgCharts } from 'ag-charts-react';

const data = [
  {
    name: "Mon",
    present: 60,
    absent: 40,
  },
  {
    name: "Tue",
    present: 70,
    absent: 60,
  },
  {
    name: "Wed",
    present: 90,
    absent: 75,
  },
  {
    name: "Thu",
    present: 90,
    absent: 75,
  },
  {
    name: "Fri",
    present: 65,
    absent: 55,
  },
];

const chartOptions: any = {
    data: data,

    series: [
        { type: 'bar', xKey: 'name', yKey: 'present', yName: 'Present', cornerRadius: 5, fill: '#85deff',
            label: {
                enabled: true,
                color: '#000000',
                formatter: ({ value }: { value: number }) => `${value}`,
              },
        },
        { type: 'bar', xKey: 'name', yKey: 'absent', yName: 'Absent', cornerRadius: 5, fill: '#a8a7fe',
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

const AttendanceChart = () => {
  return (
    <div className="bg-white rounded-lg p-4 h-full flex flex-col">
        {/* TITLE */}
        <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold">Attendance</h1>
            <Image src="/moreDark.png" alt="" width={20} height={20} />
        </div>

        {/* CHART */}
        <div className="flex-grow">
            <AgCharts options={chartOptions} style={{ width: "100%", height: "100%" }} />
        </div>
    </div>
  );
};

export default AttendanceChart;