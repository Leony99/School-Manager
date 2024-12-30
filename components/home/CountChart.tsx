'use client';

import { AgCharts } from 'ag-charts-react';

const CountChart = ({ boys, girls }: { boys: number; girls: number }) => {
  const data = [
    {
      name: "Students",
      count: boys + girls,
      boysCount: boys,
      girlsCount: girls,
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

  return (
      <div className="relative w-full flex-grow">
        <AgCharts options={chartOptions} style={{ width: "100%", height: "100%" }} />
      </div>
  );
};

export default CountChart;