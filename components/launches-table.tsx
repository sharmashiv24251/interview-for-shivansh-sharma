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
import { Loader } from "./ui/loading";

interface LaunchesTableProps {
  launches: Launch[];
  isLoading: boolean;
  startIndex: number;
}

interface LaunchesTableProps {
  launches: Launch[];
  isLoading: boolean;
  startIndex: number;
  onRowClick: (launch: Launch) => void;
}

export function LaunchesTable({
  launches,
  isLoading,
  startIndex,
  onRowClick,
}: LaunchesTableProps) {
  const getStatusBadge = (success: boolean | null, upcoming: boolean) => {
    if (upcoming) {
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          Upcoming
        </Badge>
      );
    }
    if (success === true) {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Success
        </Badge>
      );
    }
    if (success === false) {
      return (
        <Badge variant="secondary" className="bg-red-100 text-red-800">
          Failed
        </Badge>
      );
    }
    return <Badge variant="outline">Unknown</Badge>;
  };

  const getOrbit = (launch: Launch) => {
    if (launch.cores?.[0]) return "LEO";
    return "Unknown";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="min-h-[510px] flex flex-col">
        <Table className="flex-1">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>No.</TableHead>
              <TableHead>Launched (UTC)</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Mission</TableHead>
              <TableHead>Orbit</TableHead>
              <TableHead>Launch Status</TableHead>
              <TableHead>Rocket</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="h-[450px] flex items-center justify-center">
                    <Loader />
                  </div>
                </TableCell>
              </TableRow>
            ) : launches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="h-[450px] flex items-center justify-center text-gray-500">
                    No launches found
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              launches.map((launch, index) => (
                <TableRow
                  key={launch.id}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => onRowClick(launch)}
                >
                  <TableCell>
                    {String(startIndex + index + 1).padStart(2, "0")}
                  </TableCell>
                  <TableCell>
                    {new Date(launch.date_utc).toLocaleDateString("en-GB")} at{" "}
                    {new Date(launch.date_utc).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>{launch.launchpad}</TableCell>
                  <TableCell className="font-medium">{launch.name}</TableCell>
                  <TableCell>{getOrbit(launch)}</TableCell>
                  <TableCell>
                    {getStatusBadge(launch.success, launch.upcoming)}
                  </TableCell>
                  <TableCell>{launch.name}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
