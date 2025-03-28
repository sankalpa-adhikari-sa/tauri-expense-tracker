import { useState, useEffect, useRef } from "react";
import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import { toast } from "sonner";

const DEFAULT_UPDATE_INTERVAL_MS = 3600000; // Hourly

export type UpdaterConfig = {
  autoCheck?: boolean;
  updateIntervalMs?: number;
  showErrorToasts?: boolean;
};

export type UpdateStatus = {
  version?: string;
  releaseNotes?: string;
  status?: InstallStatus;
};

export type InstallStatus =
  | "Checking"
  | "Downloading"
  | "Downloaded"
  | "Installing"
  | "Done"
  | "Up-to-date"
  | "Error";

function isOffline(err: any): boolean {
  return (
    typeof err === "string" &&
    (err.includes("Could not fetch a valid release") ||
      err.includes("Network Error"))
  );
}

function UpdaterService(config?: UpdaterConfig) {
  const {
    autoCheck = true,
    updateIntervalMs = DEFAULT_UPDATE_INTERVAL_MS,
    showErrorToasts = true,
  } = config || {};

  const [loading, setLoading] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>({});
  const intervalId = useRef<NodeJS.Timeout | null>(null);

  const handleError = (err: any, manual: boolean) => {
    if (!manual && isOffline(err)) return;

    console.error("Update error:", err);

    if (showErrorToasts) {
      toast.error("App update failed", {
        description: `Something went wrong while updating the app.\n\nYou can download the latest release from our page.`,
      });
    }
  };

  useEffect(() => {
    if (!autoCheck) return;

    const start = async () => {
      await checkForUpdate(false);

      intervalId.current = setInterval(
        async () => await checkForUpdate(false),
        updateIntervalMs
      );
    };

    start();

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
    };
  }, [autoCheck, updateIntervalMs]);

  const checkForUpdate = async (manual = true) => {
    setLoading(true);
    setStatus("Checking");

    try {
      const updateResult = await check();
      if (updateResult) {
        handleUpdate(updateResult);
      } else {
        setStatus("Up-to-date");
      }
    } catch (err: unknown) {
      handleError(err, manual);
      setStatus("Error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (updateResult: any) => {
    if (updateResult === null) {
      setUpdateStatus({});
      return;
    }

    if (updateResult.currentVersion === "0.0.0") {
      // DEV mode
      setStatus("Up-to-date");
      return;
    }

    const { version, body } = updateResult;
    setUpdateStatus({
      version,
      releaseNotes: body,
      status: undefined,
    });
  };

  const downloadAndInstall = async () => {
    setLoading(true);
    try {
      const updateResult = await check();
      if (updateResult) {
        setStatus("Downloading");

        await updateResult.downloadAndInstall((event) => {
          switch (event.event) {
            case "Started":
              setStatus("Downloading");
              break;
            case "Progress":
              setStatus("Downloading");
              break;
            case "Finished":
              setStatus("Downloaded");
              break;
          }
        });

        setStatus("Installing");
        await relaunch();
        setStatus("Done");
      }
    } catch (error: any) {
      handleError(error, true);
      setStatus("Error");
    } finally {
      setLoading(false);
    }
  };

  const setStatus = (status: InstallStatus) => {
    setUpdateStatus((prev) => ({ ...prev, status }));
  };

  return {
    loading,
    updateStatus,
    checkForUpdate,
    downloadAndInstall,
  };
}

export default UpdaterService;
