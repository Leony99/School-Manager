"use client";

import Image from "next/image";
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

const data = 92;

const Performance = () => {
    return (
        <div className="bg-white p-4 rounded-md h-80 flex flex-col">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Performance</h1>
                <Image src="/moreDark.png" alt="" width={16} height={16} />
            </div>
            <Gauge
                value={data}
                startAngle={0}
                endAngle={360}
                cornerRadius={10}
                cx="50%"
                cy="50%"
                className="flex-grow"

                text={
                    ({ value, valueMax }) => `${value} / ${valueMax}`
                }

                sx={() => ({
                    [`& .${gaugeClasses.valueText}`]: {
                        fontSize: "1.75rem",
                        fontWeight: "semi-bold",
                        fontFamily: "Inter"
                    },
                    [`& .${gaugeClasses.valueArc}`]: {
                        fill: '#85deff',
                    },
                    [`& .${gaugeClasses.referenceArc}`]: {
                        fill: '#C3EBFA',
                    },
                })}
            />
        </div>
    );
};

export default Performance;