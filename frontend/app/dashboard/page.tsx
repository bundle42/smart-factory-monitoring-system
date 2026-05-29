"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/services/api";
import MachineCard from "@/components/MachineCard";
import socket from "@/lib/socket";
import { Machine } from "@/types/machine";

import { getToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

import ProductionChart from "@/components/ProductionChart";
import TemperatureChart from "@/components/TemperatureChart";

interface SimulatorStatus {
  running: boolean;
  intervalMs: number;
  ticks: number;
  autoStart: boolean;
}

export default function DashboardPage() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [simulator, setSimulator] = useState<SimulatorStatus | null>(null);
  const [simulatorError, setSimulatorError] = useState("");
  const [simulatorBusy, setSimulatorBusy] = useState(false);
  const router = useRouter();

  const fetchMachines = useCallback(async () => {
    const response = await api.get("/machines");

    setMachines(response.data);
  }, []);

  const fetchSimulatorStatus = useCallback(async () => {
    try {
      const response = await api.get("/simulator");

      setSimulator(response.data);
      setSimulatorError("");
    } catch {
      setSimulatorError("Simulator status is unavailable");
    }
  }, []);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.push("/login");
      return;
    }

    const initializeDashboard = async () => {
      await Promise.all([fetchMachines(), fetchSimulatorStatus()]);
    };

    void initializeDashboard();

    socket.on("machineUpdated", (updatedMachine) => {
      setMachines((prev) =>
        prev.map((machine) =>
          machine.id === updatedMachine.id ? updatedMachine : machine,
        ),
      );
    });

    return () => {
      socket.off("machineUpdated");
    };
  }, [fetchMachines, fetchSimulatorStatus, router]);

  const runSimulatorAction = async (
    action: "start" | "stop" | "tick" | "reset",
  ) => {
    setSimulatorBusy(true);
    setSimulatorError("");

    try {
      const response = await api.post(`/simulator/${action}`);

      setSimulator(response.data);
      await fetchMachines();
    } catch {
      setSimulatorError("Admin permission is required for simulator controls");
    } finally {
      setSimulatorBusy(false);
    }
  };

  const runningMachines = machines.filter(
    (machine) => machine.status === "RUNNING",
  ).length;
  const totalProduction = machines.reduce(
    (sum, machine) => sum + machine.productionCount,
    0,
  );
  const averageTemperature =
    machines.length > 0
      ? machines.reduce((sum, machine) => sum + machine.temperature, 0) /
        machines.length
      : 0;

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Smart Factory Dashboard</h1>
          <p className="mt-2 text-sm text-gray-500">
            Virtual machine telemetry is streaming through the same dashboard
            path that real sensors can use later.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={simulatorBusy || simulator?.running}
            onClick={() => runSimulatorAction("start")}
            className="rounded border px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
          >
            Start
          </button>
          <button
            type="button"
            disabled={simulatorBusy || !simulator?.running}
            onClick={() => runSimulatorAction("stop")}
            className="rounded border px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
          >
            Stop
          </button>
          <button
            type="button"
            disabled={simulatorBusy}
            onClick={() => runSimulatorAction("tick")}
            className="rounded bg-black px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Tick
          </button>
          <button
            type="button"
            disabled={simulatorBusy}
            onClick={() => runSimulatorAction("reset")}
            className="rounded border px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded border p-4">
          <p className="text-sm text-gray-500">Simulator</p>
          <p className="mt-2 text-2xl font-bold">
            {simulator?.running ? "Running" : "Stopped"}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {simulator
              ? `${simulator.intervalMs / 1000}s interval / ${simulator.ticks} ticks`
              : "Loading status"}
          </p>
        </div>
        <div className="rounded border p-4">
          <p className="text-sm text-gray-500">Running Machines</p>
          <p className="mt-2 text-2xl font-bold">
            {runningMachines}/{machines.length}
          </p>
        </div>
        <div className="rounded border p-4">
          <p className="text-sm text-gray-500">Total Production</p>
          <p className="mt-2 text-2xl font-bold">{totalProduction}</p>
        </div>
        <div className="rounded border p-4">
          <p className="text-sm text-gray-500">Average Temperature</p>
          <p className="mt-2 text-2xl font-bold">
            {averageTemperature.toFixed(1)}°C
          </p>
        </div>
      </div>

      {simulatorError && (
        <div className="rounded border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800">
          {simulatorError}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {machines.map((machine) => (
          <MachineCard key={machine.id} machine={machine} />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <ProductionChart
          data={machines.map((machine) => ({
            name: machine.name,
            productionCount: machine.productionCount,
          }))}
        />

        <TemperatureChart
          data={machines.map((machine) => ({
            name: machine.name,
            temperature: machine.temperature,
          }))}
        />
      </div>
    </div>
  );
}
