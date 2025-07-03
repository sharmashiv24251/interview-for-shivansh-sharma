import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Launch } from "@/api/types";

interface LaunchesCardsProps {
  launches: Launch[];
  isLoading: boolean;
  startIndex: number;
}

export function LaunchesCards({
  launches,
  isLoading,
  startIndex,
}: LaunchesCardsProps) {
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
    if (launch.cores?.[0]) {
      return "LEO";
    }
    return "Unknown";
  };

  const getLaunchpad = (launch: Launch) => {
    const launchpadMap: Record<string, string> = {
      "5e9e4502f509094188566f88": "Kwajalein Atoll",
      "5e9e4501f509094188566f87": "CCAFS SLC 40",
      "5e9e4502f509094188566f89": "KSC LC 39A",
    };
    return launchpadMap[launch.launchpad] || "Unknown Location";
  };

  if (isLoading) {
    return (
      <div className="grid gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (launches.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-500">
          No launches found
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {launches.map((launch, index) => (
        <Card key={launch.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-gray-500">
                  #{String(startIndex + index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-semibold">{launch.name}</h3>
              </div>
              {getStatusBadge(launch.success, launch.upcoming)}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Date:</span>
                <span>
                  {new Date(launch.date_utc).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  at{" "}
                  {new Date(launch.date_utc).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Location:</span>
                <span>{getLaunchpad(launch)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Orbit:</span>
                <span>{getOrbit(launch)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Rocket:</span>
                <span>Falcon 9</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
