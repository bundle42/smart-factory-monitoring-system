"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Machine, MachineReading } from "@/types/machine";

interface Props {
  machine?: Machine;
  readings: MachineReading[];
  range: "hour" | "day" | "week";
  onRangeChange: (range: "hour" | "day" | "week") => void;
}

const statusStyles: Record<string, string> = {
  RUNNING: "bg-green-100 text-green-700 border-green-200",
  STOPPED: "bg-gray-100 text-gray-700 border-gray-200",
  MAINTENANCE: "bg-yellow-100 text-yellow-800 border-yellow-200",
  ERROR: "bg-red-100 text-red-700 border-red-200",
};

export default function MachineHistoryChart({
  machine,
  readings,
  range,
  onRangeChange,
}: Props) {
  const chartData = readings.map((reading) => ({
    ...reading,
    time: formatReadingTime(reading.createdAt, range),
  }));
  const recentStatuses = readings.slice(-12);

  return (
    <section className="rounded border p-4 shadow">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold">
            {machine ? `${machine.name} History` : "Machine History"}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Temperature, production, and status readings by time.
          </p>
        </div>

        <div className="flex rounded border p-1">
          {(["hour", "day", "week"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onRangeChange(option)}
              className={`rounded px-3 py-1 text-sm font-semibold ${
                range === option ? "bg-black text-white" : "text-gray-600"
              }`}
            >
              {option === "hour" ? "1H" : option === "day" ? "24H" : "7D"}
            </button>
          ))}
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="mt-6 flex h-[320px] items-center justify-center rounded border border-dashed text-sm text-gray-500">
          No readings yet. Let the simulator run for a few ticks.
        </div>
      ) : (
        <>
          <div className="mt-6 w-full min-w-0">
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="temperature" />
                <YAxis yAxisId="production" orientation="right" />
                <Tooltip />
                <Bar
                  yAxisId="production"
                  dataKey="productionCount"
                  fill="#64748b"
                  name="Production"
                />
                <Line
                  yAxisId="temperature"
                  type="monotone"
                  dataKey="temperature"
                  stroke="#dc2626"
                  strokeWidth={2}
                  dot={false}
                  name="Temperature"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {recentStatuses.map((reading) => (
              <div
                key={reading.id}
                className={`rounded border px-3 py-2 text-sm ${
                  statusStyles[reading.status] ??
                  "bg-gray-100 text-gray-700 border-gray-200"
                }`}
              >
                <p className="font-semibold">{reading.status}</p>
                <p className="text-xs opacity-80">
                  {formatReadingTime(reading.createdAt, "hour")}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function formatReadingTime(createdAt: string, range: "hour" | "day" | "week") {
  const date = new Date(createdAt);

  if (range === "week") {
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:00`;
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
