import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Launch } from "@/api/types";

interface LaunchModalProps {
  launch: Launch;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LaunchModal = ({
  launch,
  isOpen,
  onOpenChange,
}: LaunchModalProps) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return (
        date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }) +
        " at " +
        date.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } catch {
      return "N/A";
    }
  };

  const getSuccessStatus = () => {
    if (launch.success === null)
      return { text: "Unknown", variant: "secondary" as const };
    return launch.success
      ? { text: "Success", variant: "default" as const }
      : { text: "Failed", variant: "destructive" as const };
  };

  const status = getSuccessStatus();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto p-0 gap-0">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start space-x-4 mb-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
              {launch.links?.patch?.small ? (
                <img
                  src={launch.links.patch.small}
                  alt={`${launch.name} patch`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">🚀</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-xl font-bold text-gray-900">
                  {launch.name}
                </h2>
                <Badge variant={status.variant}>{status.text}</Badge>
              </div>
              <div className="text-sm text-gray-600">{launch.rocket}</div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <p className="text-sm text-gray-700 leading-relaxed">
              {launch.details || "No additional mission details available."}
              {launch.links?.wikipedia && (
                <span>
                  {" "}
                  <a
                    href={launch.links.wikipedia}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Wikipedia
                  </a>
                </span>
              )}
            </p>
          </div>

          {/* Info Table */}
          <div className="space-y-0 text-sm text-gray-900">
            {[
              { label: "Flight Number", value: launch.flight_number },
              { label: "Mission Name", value: launch.name },
              { label: "Rocket Type", value: "v1.0" },
              { label: "Rocket Name", value: launch.rocket },
              { label: "Manufacturer", value: "SpaceX" },
              { label: "Nationality", value: "SpaceX" },
              { label: "Launch Date", value: formatDate(launch.date_utc) },
              { label: "Payload Type", value: "Dragon 1.0" },
              { label: "Orbit", value: "ISS" },
              { label: "Launch Site", value: "CCAFS SLC 40" },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="grid grid-cols-2 py-3 border-b border-gray-200 last:border-none"
              >
                <span className="text-gray-600">{label}</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
