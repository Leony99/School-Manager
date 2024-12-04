"use client";
import Image from "next/image";
import { AgCharts } from 'ag-charts-react';

const data = [
  {
    name: "Jan",
    income: 4000,
    expense: 2400,
  },
  {
    name: "Feb",
    income: 3000,
    expense: 1398,
  },
  {
    name: "Mar",
    income: 2000,
    expense: 9800,
  },
  {
    name: "Apr",
    income: 2780,
    expense: 3908,
  },
  {
    name: "May",
    income: 1890,
    expense: 4800,
  },
  {
    name: "Jun",
    income: 2390,
    expense: 3800,
  },
  {
    name: "Jul",
    income: 3490,
    expense: 4300,
  },
  {
    name: "Aug",
    income: 3490,
    expense: 4300,
  },
  {
    name: "Sep",
    income: 3490,
    expense: 4300,
  },
  {
    name: "Oct",
    income: 3490,
    expense: 4300,
  },
  {
    name: "Nov",
    income: 3490,
    expense: 4300,
  },
  {
    name: "Dec",
    income: 3490,
    expense: 4300,
  },
];

const chartOptions: any = {
    data: data,
  
    series: [
      { type: 'line', xKey: 'name', yKey: 'income', yName: 'Income', stroke: '#85deff',
        marker: {
            enabled: true,
            fill: '#85deff',
            size: 10,
        },
        label: {
          enabled: true,
          color: '#000000',
          formatter: ({ value }: { value: number }) => `${value}`,
        },
        tooltip: {
          renderer: () => {
            return {
              backgroundColor: '#85deff',
            };
          },
        },
      },
      { type: 'line', xKey: 'name', yKey: 'expense', yName: 'Expense', stroke: '#a8a7fe',
        marker: {
            enabled: true,
            fill: '#a8a7fe',
            size: 10,
        }, 
        label: {
          enabled: true,
          color: '#000000',
          formatter: ({ value }: { value: number }) => `${value}`,
        },
        tooltip: {
          renderer: () => {
            return {
              backgroundColor: '#a8a7fe',
            };
          },
        },
      },
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

const FinanceChart = () => {
  return (
    <div className="bg-white rounded-xl w-full h-full p-4 flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Finance</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>

      {/* CHART */}
      <div className="relative w-full flex-grow">
        <AgCharts options={chartOptions} style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
};

export default FinanceChart;