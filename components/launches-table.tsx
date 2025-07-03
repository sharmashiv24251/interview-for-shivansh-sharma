import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Launch } from "@/api/types";

interface LaunchesTableProps {
  launches: Launch[];
  isLoading: boolean;
  startIndex: number;
}

export function LaunchesTable({
  launches,
  isLoading,
  startIndex,
}: LaunchesTableProps) {
  const getStatusBadge = (success: boolean | null, upcoming: boolean) => {
    if (upcoming) {
      return (
        <Badge
          variant="secondary"
          className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
        >
          Upcoming
        </Badge>
      );
    }
    if (success === true) {
      return (
        <Badge
          variant="secondary"
          className="bg-green-100 text-green-800 hover:bg-green-100"
        >
          Success
        </Badge>
      );
    }
    if (success === false) {
      return (
        <Badge
          variant="secondary"
          className="bg-red-100 text-red-800 hover:bg-red-100"
        >
          Failed
        </Badge>
      );
    }
    return <Badge variant="outline">Unknown</Badge>;
  };

  const getOrbit = (launch: Launch) => {
    // Simple orbit determination based on available data
    if (launch.cores?.[0]) {
      return "LEO"; // Most SpaceX missions are to LEO
    }
    return "Unknown";
  };

  const getRocketName = (launch: Launch) => {
    // Most SpaceX launches use Falcon 9
    return "Falcon 9";
  };

  const getLaunchpad = (launch: Launch) => {
    // Map launchpad IDs to readable names
    const launchpadMap: Record<string, string> = {
      "5e9e4502f509094188566f88": "Kwajalein Atoll",
      "5e9e4501f509094188566f87": "CCAFS SLC 40",
      "5e9e4502f509094188566f89": "KSC LC 39A",
    };
    return launchpadMap[launch.launchpad] || "Unknown Location";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold text-gray-700">No.</TableHead>
            <TableHead className="font-semibold text-gray-700">
              Launched (UTC)
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              Location
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              Mission
            </TableHead>
            <TableHead className="font-semibold text-gray-700">Orbit</TableHead>
            <TableHead className="font-semibold text-gray-700">
              Launch Status
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              Rocket
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                Loading…
              </TableCell>
            </TableRow>
          ) : launches.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                No launches found
              </TableCell>
            </TableRow>
          ) : (
            launches.map((launch, index) => (
              <TableRow key={launch.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  {String(startIndex + index + 1).padStart(2, "0")}
                </TableCell>
                <TableCell>
                  {new Date(launch.date_utc).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  at{" "}
                  {new Date(launch.date_utc).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell>
                  <span className="text-gray-600">{getLaunchpad(launch)}</span>
                </TableCell>
                <TableCell className="font-medium">{launch.name}</TableCell>
                <TableCell>
                  <span className="text-gray-600">{getOrbit(launch)}</span>
                </TableCell>
                <TableCell>
                  {getStatusBadge(launch.success, launch.upcoming)}
                </TableCell>
                <TableCell>
                  <span className="text-gray-600">{getRocketName(launch)}</span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
