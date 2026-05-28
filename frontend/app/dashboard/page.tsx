"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import MachineCard from "@/components/MachineCard";
import socket from "@/lib/socket";
import { Machine } from "@/types/machine";

import { getToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

import ProductionChart from "@/components/ProductionChart";
import TemperatureChart from "@/components/TemperatureChart";

export default function DashboardPage() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.push("/login");
      return;
    }

    fetchMachines();

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
  }, []);

  const fetchMachines = async () => {
    const response = await api.get("/machines");

    setMachines(response.data);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Smart Factory Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        {machines.map((machine) => (
          <MachineCard key={machine.id} machine={machine} />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6 mt-10">
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
