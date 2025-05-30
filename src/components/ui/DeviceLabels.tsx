import React from "react";
import { Label } from "../../types/label.types";
import { LabelBadge } from ".";
import { useLabels, useDevice } from "@/hooks/api";

interface DeviceLabelsProps {
  deviceId: string;
  onLabelClick?: (labelId: string) => void;
  labels?: Label[]; // Optional prop to pass in already fetched labels
  allLabels?: Label[]; // All labels in the system (more efficient lookup)
}

const DeviceLabels: React.FC<DeviceLabelsProps> = ({
  deviceId,
  onLabelClick,
  labels: providedLabels,
  allLabels: externalLabels,
}) => {
  // Use React Query hooks directly to fetch data
  const { data: device, isLoading: isDeviceLoading } = useDevice(deviceId, {
    // Only fetch device data if no labels are provided
    enabled: !providedLabels && !externalLabels?.length,
    queryKey: ['device', deviceId],
  });

  const { data: fetchedLabels = [], isLoading: isLabelsLoading } = useLabels({
    // Only fetch labels if no external labels are provided
    enabled: !externalLabels?.length,
    queryKey: ['labels'],
  });

  // Use externally provided labels if available, otherwise use the ones from the hook
  const allLabelsData = externalLabels || fetchedLabels;

  // Check if we're still loading data
  const isLoading =
    (isDeviceLoading && !providedLabels) ||
    (isLabelsLoading && !externalLabels?.length);

  // Calculate labels to display based on available data
  const labelsToDisplay = React.useMemo(() => {
    // If explicit labels are provided, use those
    if (providedLabels?.length) {
      return providedLabels;
    }

    // If we have device data and all labels, filter to get the device's labels
    if (device?.label_ids && allLabelsData.length) {
      return allLabelsData.filter((label) =>
        device.label_ids?.some((id) => String(id) === String(label.id))
      );
    }

    return [];
  }, [device, providedLabels, allLabelsData]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex gap-1 animate-pulse">
        <div className="h-5 w-16 bg-purple-900/30 rounded-full"></div>
      </div>
    );
  }

  // Empty state
  if (!labelsToDisplay.length) {
    return null;
  }

  // Render labels
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {labelsToDisplay.map((label) => (
        <LabelBadge
          key={label.id}
          label={label}
          onClick={() => onLabelClick && onLabelClick(label.id)}
        />
      ))}
    </div>
  );
};

export default DeviceLabels;
