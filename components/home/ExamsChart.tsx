"use client";

import { AgCharts } from 'ag-charts-react';

const ExamsChart = ({examsPerDay}: {examsPerDay: any}) => {

  const data = [
    {
      name: "Mon",
      exams: examsPerDay[1].count,
    },
    {
      name: "Tue",
      exams: examsPerDay[2].count,
    },
    {
      name: "Wed",
      exams: examsPerDay[3].count,
    },
    {
      name: "Thu",
      exams: examsPerDay[4].count,
    },
    {
      name: "Fri",
      exams: examsPerDay[5].count,
    },
  ];
  
  const chartOptions: any = {
    data: data,
  
    series: [
      {
        type: 'bar', xKey: 'name', yKey: 'exams', yName: 'Exams', cornerRadius: 5, fill: '#fdee58',
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

  return (
    <div className="flex-grow">
      <AgCharts options={chartOptions} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default ExamsChart;