"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: {
    name: string;
    temperature: number;
  }[];
}

export default function TemperatureChart({ data }: Props) {
  return (
    <div className="bg-white border rounded-xl p-4 shadow">
      <h2 className="text-xl font-bold mb-4">Temperature Monitoring</h2>

      <div className="w-full min-w-0">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />

            <Line type="monotone" dataKey="temperature" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
