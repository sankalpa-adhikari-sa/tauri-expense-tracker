import { Button } from "@/components/ui/button";
import { useAuthentication } from "@/hooks/useAuthentication";
import UpdaterService from "@/lib/updaterService";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { DatePickerWithRange } from "../-components/DatePickerWithRange";

export const Route = createFileRoute("/_private/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const { signOut } = useAuthentication();

  const navigate = useNavigate();
  const handleLogout = () => {
    toast.promise(
      new Promise<void>((resolve, reject) => {
        signOut.mutate(undefined, {
          onSuccess: () => resolve(),
          onError: () => reject(),
        });
      }),
      {
        loading: "Logging out...",
        success: () => {
          return "Logged out successfully!";
        },
        error: "Logout failed. Please try again.",
        onAutoClose: () => {
          navigate({ to: "/auth" });
        },
        duration: 1000,
      }
    );
  };
  const { loading, updateStatus, checkForUpdate, downloadAndInstall } =
    UpdaterService({ autoCheck: false });
  const handleCheckUpdate = async () => {
    console.log(loading, updateStatus);
    await checkForUpdate();
    if (updateStatus.version && !updateStatus.status) {
      toast.info(`New update available: v${updateStatus.version}`, {
        description: updateStatus.releaseNotes,
        action: {
          label: "Update Now",
          onClick: downloadAndInstall,
        },
      });
    } else if (updateStatus.status === "Up-to-date") {
      toast.success("App is up to date");
    }
  };
  return (
    <div>
      <Button onClick={handleLogout}>logout</Button>
      <Button
        onClick={handleCheckUpdate}
        disabled={loading}
        variant={"outline"}
        size={"sm"}
      >
        Check for updates
      </Button>
      <DatePickerWithRange />
    </div>
  );
}
