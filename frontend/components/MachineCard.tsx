import { Machine } from "@/types/machine";

interface Props {
  machine: Machine;
  selected?: boolean;
  onSelect?: () => void;
}

export default function MachineCard({ machine, selected = false, onSelect }: Props) {
  const getStatusColor = () => {
    switch (machine.status) {
      case "RUNNING":
        return "bg-green-500";

      case "STOPPED":
        return "bg-gray-500";

      case "MAINTENANCE":
        return "bg-yellow-500";

      case "ERROR":
        return "bg-red-500";

      default:
        return "bg-gray-300";
    }
  };

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded border p-4 text-left shadow transition hover:border-black ${
        selected ? "border-black ring-2 ring-black/10" : ""
      }`}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{machine.name}</h2>

        <div className={`w-4 h-4 rounded-full ${getStatusColor()}`} />
      </div>

      <p className="mt-2 text-gray-600">{machine.location}</p>

      <div className="mt-4 space-y-1">
        <p>
          <strong>Status:</strong> {machine.status}
        </p>

        <p>
          <strong>Temperature:</strong> {machine.temperature}°C
        </p>

        <p>
          <strong>Production:</strong> {machine.productionCount}
        </p>
      </div>
    </button>
  );
}
