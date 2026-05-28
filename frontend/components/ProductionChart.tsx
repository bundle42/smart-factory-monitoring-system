"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: {
    name: string;
    productionCount: number;
  }[];
}

export default function ProductionChart({ data }: Props) {
  return (
    <div className="bg-white border rounded-xl p-4 shadow">
      <h2 className="text-xl font-bold mb-4">Production Overview</h2>

      <div className="w-full h-[300px]">
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />

            <Bar dataKey="productionCount" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
